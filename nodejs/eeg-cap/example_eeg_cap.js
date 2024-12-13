let proto_sdk = null;
let message_parser = null;
let default_eeg_filter_enabled = true;

let EegSampleRate;
let EegSignalGain;
let EegSignalSource;
let ImuSampleRate;
let WiFiSecurity;
let NoiseTypes;

async function initSDK() {
  if (proto_sdk) return;

  console.debug("initSDK");
  proto_sdk = await import("../pkg/bc_proto_sdk.js");
  // console.log("proto_sdk", proto_sdk);
  // 初始化日志记录
  proto_sdk.init_logging("info");

  EegSampleRate = proto_sdk.EegSampleRate;
  EegSignalGain = proto_sdk.EegSignalGain;
  EegSignalSource = proto_sdk.EegSignalSource;
  ImuSampleRate = proto_sdk.ImuSampleRate;
  WiFiSecurity = proto_sdk.WiFiSecurity;
  NoiseTypes = proto_sdk.NoiseTypes;

  // 默认配置
  // 250Hz采样率
  // 2~45Hz bandpass
  // 49~51Hz bandstop，去除环境噪声，50Hz电流干扰
  const cfg = {
    fs: 250,
    enable_highpass: false,
    high_cut: 0.5,
    enable_lowpass: false,
    low_cut: 49,
    enable_bandpass: true,
    bandpass_low: 2,
    bandpass_high: 45,
    enable_bandstop: true,
    bandstop_low: 49,
    bandstop_high: 51,
  };
  set_eeg_filter_cfg(cfg);
}

function set_eeg_filter_cfg(cfg) {
  proto_sdk.set_eeg_filter_cfg(
    cfg.enable_highpass,
    cfg.high_cut,
    cfg.enable_lowpass,
    cfg.low_cut,
    cfg.enable_bandpass,
    cfg.bandpass_low,
    cfg.bandpass_high,
    cfg.enable_bandstop,
    cfg.bandstop_low,
    cfg.bandstop_high,
    cfg.fs
  );
}

async function initMsgParser() {
  await initSDK();

  if (message_parser) return;
  console.debug("initMsgParser");
  message_parser = new proto_sdk.MessageParser(
    "eeg-cap-device",
    proto_sdk.MsgType.EEGCap
  );
  listenMessages();
}

// 处理接收到的数据
function receiveData(data) {
  const uint8Array = new Uint8Array(data);
  message_parser.receive_data(uint8Array);
}

// 持续获取消息
async function listenMessages() {
  while (true) {
    try {
      // Fetch the next message
      const message = await message_parser.next_message();
      // console.log("Received message:", message);
      handleMessage(message);
    } catch (error) {
      // Handle any errors that occur during message fetching
      console.error("Error while fetching message:", error);
    }
    // Optional: consider add a delay to prevent the loop from consuming too much CPU
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

// const logger = require('./logger'); // 假设你有类似的日志记录器模块
const logger = console;

function handleMessage(_message) {
  if (_message === null) {
    logger.warn("Received None");
    return;
  }

  const device_message = JSON.parse(_message);
  // const device_id = device_message[0];
  const message = device_message[1];

  // 检查是否EEG数据
  if (message.EEGCap && message.EEGCap.Mcu2App) {
    if (message.EEGCap.Mcu2App.eeg && message.EEGCap.Mcu2App.eeg.data) {
      const gain = EegSignalGain.GAIN_6; //  default is GAIN_6 // TODO: updated by eeg cfg
      const eegData = EEGData.fromJson(message.EEGCap.Mcu2App.eeg, gain);
      on_eeg_data(eegData.sample1);
      // logger.info(`eeg_data: ${eegData.sample1.length}`);
      logger.info(`eeg_data: ${eegData.toString()}`);
    } else if (message.EEGCap.Mcu2App.imu) {
      const imuData = message.EEGCap.Mcu2App.imu;
      logger.info(`imu_data: ${JSON.stringify(imuData)}`);
    }
  } else {
    logger.warn(`received message: ${_message}`);
  }
}

// 32通道的EEG数据，二维数组
let eeg_values = Array.from({ length: 32 }, () => []);
let counter = 0;

function on_eeg_data(sample1) {
  for (let i = 0; i < 32; i++) {
    eeg_values[i].push(sample1[i]);
    // 每个通道最大保存1000个数据
    if (eeg_values[i].length > 1000) {
      eeg_values[i] = eeg_values[i].slice(-1000);
    }
  }

  counter++;
  if (counter % 250 === 0) {
    // 每250次绘制一次数据
    for (let i = 0; i < 32; i++) {
      perform_filter(eeg_values[i]);
    }
    // TODO: 更新绘图
    // update_eeg_plot();
  }
}

// EEG数据滤波处理, channel_data为某个通道的数据
function perform_filter(channel_data) {
  if (default_eeg_filter_enabled) {
    channel_data = proto_sdk.apply_eeg_filters(channel_data);
    console.log("apply_eeg_filters", channel_data);
    return channel_data;
  } else {
    // custom filter
    channel_data = proto_sdk.apply_high_pass_filter(channel_data, 0.5, 250);
    channel_data = proto_sdk.apply_band_stop_filter(channel_data, 49, 51, 250);
    console.log("apply_custom_filter", channel_data);
    return channel_data;
  }
}

class EEGData {
  constructor(timestamp, gain, sample1) {
    this.timestamp = timestamp;
    this.gain = gain;
    this.sample1 = sample1;
  }

  static fromJson(eeg, gain) {
    const eegData = eeg.data.sample1;
    const timestamp = eegData.timestamp;
    var sample1 = proto_sdk.parse_eeg_data(
      Buffer.from(eegData.data, "base64"),
      gain
    );
    return new EEGData(timestamp, gain, sample1);
  }

  toString() {
    return `EEGData(timestamp=${this.timestamp},
    sample1=${Array.from(this.sample1)})`;
  }
}

function get_eeg_config_builder() {
  return proto_sdk.get_eeg_config();
}

function set_eeg_config_builder(sr, gain, signal) {
  return proto_sdk.set_eeg_config(sr, gain, signal);
}

function start_eeg_stream_builder() {
  return proto_sdk.start_eeg_stream();
}

function stop_eeg_stream_builder() {
  return proto_sdk.stop_eeg_stream();
}

function get_imu_config_builder() {
  return proto_sdk.get_imu_config();
}

function start_imu_stream_builder() {
  return proto_sdk.start_imu_stream();
}

function stop_imu_stream_builder() {
  return proto_sdk.stop_imu_stream();
}

function set_imu_config_builder(sr) {
  return proto_sdk.set_imu_config(sr);
}

export {
  initSDK,
  initMsgParser,
  receiveData,
  get_eeg_config_builder,
  set_eeg_config_builder,
  start_eeg_stream_builder,
  stop_eeg_stream_builder,
  get_imu_config_builder,
  set_imu_config_builder,
  start_imu_stream_builder,
  stop_imu_stream_builder,
  EegSampleRate,
  EegSignalGain,
  EegSignalSource,
  ImuSampleRate,
  WiFiSecurity,
  NoiseTypes,
};
