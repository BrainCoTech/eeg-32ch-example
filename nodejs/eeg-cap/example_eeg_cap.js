let proto_sdk = null;
let tcp_message_parser = null;
let ble_message_parser = null;
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
  // proto_sdk.init_logging("debug");
  proto_sdk.init_logging("info");

  // 用原始 proto_sdk 作为原型，创建一个新的对象
  proto_sdk = Object.create(proto_sdk);

  // 给新对象添加 on 方法
  proto_sdk.on = function (eventName, callback) {
    if (eventName === "resp") {
      proto_sdk.set_resp_callback(callback);
    }
  };

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

async function initTcpMsgParser() {
  await initSDK();

  if (tcp_message_parser) return;
  console.debug("initTcpMsgParser");
  tcp_message_parser = new proto_sdk.MessageParser(
    "ecap-tcp",
    proto_sdk.MsgType.EEGCap
  );
  await tcp_message_parser.start_message_stream();
}

async function initBleMsgParser() {
  await initSDK();

  if (ble_message_parser) return;
  console.debug("initBleMsgParser");
  ble_message_parser = new proto_sdk.MessageParser(
    "ecap-ble",
    proto_sdk.MsgType.EEGCap
  );
  await ble_message_parser.start_message_stream();
}

// 处理接收到的TCP数据
function receiveTcpData(data) {
  const uint8Array = new Uint8Array(data);
  tcp_message_parser.receive_data(uint8Array);
}

// 处理接收到的BLE数据
function receiveBleData(data) {
  const uint8Array = new Uint8Array(data);
  ble_message_parser.receive_data(uint8Array);
}

// EEG数据滤波处理, channel_data为某个通道的数据
function prepareEEGData(channel_data) {
  if (default_eeg_filter_enabled) {
    channel_data = proto_sdk.apply_eeg_filters(channel_data);
    // console.log("apply_eeg_filters", channel_data);
    return channel_data;
  } else {
    // custom filter
    // 去除环境噪声
    // channel_data = proto_sdk.remove_env_noise(channel_data);
    channel_data = proto_sdk.apply_bandstop_filter(channel_data, 49, 51, 250);

    // 带通滤波, 2~45Hz
    data = proto_sdk.apply_bandpass_filter(data, order, lowCut, highCut, fs);

    // channel_data = proto_sdk.apply_highpass_filter(channel_data, 0.5, 250);
    console.log("apply_custom_filter", channel_data);
    return channel_data;
  }
}

// Buffer.from(eegData.data, "base64"),

export {
  proto_sdk,
  initSDK,
  initTcpMsgParser,
  initBleMsgParser,
  receiveTcpData,
  receiveBleData,
  prepareEEGData,
  EegSampleRate,
  EegSignalGain,
  EegSignalSource,
  ImuSampleRate,
  WiFiSecurity,
  NoiseTypes,
};
