let proto_sdk = null;
let message_parser = null;

async function initLogger() {
  if (proto_sdk) return;
  console.debug("initLogger");
  proto_sdk = await import("./pkg/bc_proto_sdk.js");
  // console.debug("proto_sdk", proto_sdk);

  // 初始化日志记录
  proto_sdk.init_logging("info");
  EegSampleRate = proto_sdk.EegSampleRate;
  EegSignalGain = proto_sdk.EegSignalGain;
  EegSignalSource = proto_sdk.EegSignalSource;
  ImuSampleRate = proto_sdk.ImuSampleRate;
  WiFiSecurity = proto_sdk.WiFiSecurity;
}

async function initMsgParser() {
  await initLogger();

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
      logger.info(`eeg_data: ${eegData.sample1.length}`);
      // logger.info(`eeg_data: ${eegData}`);
    } else if (message.EEGCap.Mcu2App.imu) {
      const imuData = message.EEGCap.Mcu2App.imu;
      logger.info(`imu_data: ${JSON.stringify(imuData)}`);
    }
  } else {
    logger.warn(`received message: ${_message}`);
  }
}

class EEGData {
  constructor(timestamp, gain, sample1) {
    // sample2, sample3, sample4) { // TODO: current received sample1 data only
    this.timestamp = timestamp;
    this.gain = gain;
    this.sample1 = sample1;
  }

  static fromJson(eeg, gain) {
    const eegData = eeg.data.sample1;
    const timestamp = eegData.timestamp;
    const sample1 = proto_sdk.parse_eeg_data(
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

let EegSampleRate;
// SR_None = 0x00,
// SR_250Hz = 0x6F,
// SR_500Hz = 0x5F,
// SR_1000Hz = 0x4F,
// SR_2000Hz = 0x3F,
// SR_4000Hz = 0x2F,
// SR_8000Hz = 0x1F,
// SR_16000Hz = 0x0F

let EegSignalGain;
// GAIN_NONE = 0x00,
// GAIN_1 = 0x0F,
// GAIN_2 = 0x1F,
// GAIN_4 = 0x2F,
// GAIN_6 = 0x3F,
// GAIN_8 = 0x4F,
// GAIN_12 = 0x5F,
// GAIN_24 = 0x6F

let EegSignalSource;
// SIGNAL_NONE = 0x00,
// NORMAL = 0x0F,
// SHORTED = 0x1F,
// MVDD = 0x3F,
// TEST_SIGNAL = 0x5F

let ImuSampleRate;
// SR_NONE = 0, SR_50Hz = 1, SR_100Hz = 2

let WiFiSecurity;
// SECURITY_NONE = 0,
// SECURITY_OPEN = 1,
// SECURITY_WPA2_AES_PSK = 2,
// SECURITY_WPA2_TKIP_PSK = 3,
// SECURITY_WPA2_MIXED_PSK = 4,
// SECURITY_WPA_WPA2_TKIP_PSK = 5,
// SECURITY_WPA_WPA2_AES_PSK = 6,
// SECURITY_WPA_WPA2_MIXED_PSK = 7,
// SECURITY_WPA3_AES_PSK = 8,
// SECURITY_WPA2_WPA3_MIXED = 9

export {
  initLogger,
  initMsgParser,
  receiveData,
  EegSampleRate,
  EegSignalGain,
  EegSignalSource,
  ImuSampleRate,
  WiFiSecurity,
  get_eeg_config_builder,
  set_eeg_config_builder,
  start_eeg_stream_builder,
  stop_eeg_stream_builder,
  get_imu_config_builder,
  set_imu_config_builder,
  start_imu_stream_builder,
  stop_imu_stream_builder,
};
