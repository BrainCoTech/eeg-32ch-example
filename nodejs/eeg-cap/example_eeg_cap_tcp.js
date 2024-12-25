import mdns from "mdns";
import net from "net";
import {
  proto_sdk,
  initMsgParser,
  receiveData,
  prepareEEGData,
  NoiseTypes,
  EegSampleRate,
  EegSignalGain,
  EegSignalSource,
  ImuSampleRate,
} from "./example_eeg_cap.js";

import { EEGData, IMUData } from "./example_eeg_cap_model.js";

// EEG数据
const fs = 250; // 采样频率
const num_channels = 32; // 通道数
const eeg_buffer_length = 1000; // 默认缓冲区长度, 1000个数据点，每个数据点有32个通道，每个通道的值类型为float32，即4字节，大约占用128KB内存, 1000 * 32 * 4 = 128000 bytes
// let eeg_seq_num = 0; // EEG数据包序号
let eegValues = Array.from({ length: num_channels }, () =>
  Array(eeg_buffer_length).fill(0)
);

// IMU数据
const imu_buffer_length = 1000; // 默认缓冲区长度, 1000个数据点

function initCfg() {
  console.log("initCfg");
  // 滤波器参数设置，去除50Hz电流干扰
  proto_sdk.set_env_noise_filter_cfg(NoiseTypes.FIFTY, fs); // 设置环境噪声滤波器，50Hz 电源干扰
  proto_sdk.set_eeg_buffer_cfg(eeg_buffer_length); // 设置EEG数据缓冲区长度
  proto_sdk.set_imu_buffer_cfg(imu_buffer_length); // 设置IMU数据缓冲区长度
  proto_sdk.on("resp", (resp) => {
    console.log("on msg resp", resp);
  });
}

await initMsgParser();
initCfg();
initChart();

// 使用 TCP 连接脑电设备
const client = new net.Socket();

// 如果已知IP地址和端口，可以直接指定
// scan_service();
// let addr = "192.168.3.7"; // hailong-dev
// let addr = "192.168.3.12"; // yongle-dev
let addr = "192.168.3.23"; // xiangao-dev
let port = 53129;
connectToService(addr, port);

function scan_service() {
  // 使用 mdns 库发现服务
  const browser = mdns.createBrowser(mdns.tcp("brainco-eeg"));
  // 扫描不到service时，可以对照[Discovery APP](https://apps.apple.com/cn/app/discovery-dns-sd-browser/id1381004916)

  browser.on("error", (error) => {
    console.error("Error:", error);
  });

  // browser.on("serviceChanged", (service) => {
  //   console.log("Service Changed:", service);
  // });

  let connecting = false;

  /*
  Service up: {
    interfaceIndex: 10,
    type: ServiceType {
      name: 'brainco-eeg',
      protocol: 'tcp',
      subtypes: [],
      fullyQualified: true
    },
    replyDomain: 'local.',
    flags: 3,
    name: 'EEG 32ch (2)',
    networkInterface: 'en0',
    fullname: 'EEG\\03232ch\\032(2)._brainco-eeg._tcp.local.',
    host: 'ameba-2.local.',
    port: 53129,
    addresses: [ '192.168.2.23' ]
  }
  */
  browser.on("serviceUp", (service) => {
    console.log("Service up:", service);
    browser.stop();
    const address = service.addresses[0];

    if (connecting) return;
    connecting = true;
    connectToService(address, service.port);
  });

  browser.on("serviceDown", (service) => {
    console.log("Service down:", service);
  });

  console.log("start scan ...");
  browser.start();
}

// 连接到发现的服务
async function connectToService(address, port) {
  client.connect(port, address, () => {
    console.log(`Connected to ${address}:${port}`);
    // await initMsgParser();

    // 读取设备信息
    sendCommand(client, proto_sdk.get_device_info);

    // 读取配置
    // sendCommand(client, proto_sdk.get_eeg_config);
    // sendCommand(client, proto_sdk.get_imu_config);

    // 配置EEG/IMU
    // sendCommand(client, () =>
    //   proto_sdk.set_eeg_config(
    //     EegSampleRate.SR_250Hz,
    //     EegSignalGain.GAIN_6,
    //     EegSignalSource.NORMAL
    //   )
    // );
    // sendCommand(client, () =>
    //   proto_sdk.set_eeg_config(
    //     EegSampleRate.SR_500Hz,
    //     EegSignalGain.GAIN_1,
    //     EegSignalSource.TEST_SIGNAL
    //   )
    // );
    // sendCommand(client, () => proto_sdk.set_imu_config(ImuSampleRate.SR_50Hz));
    // sendCommand(client, () => proto_sdk.set_imu_config(ImuSampleRate.SR_100Hz));

    // 开始/停止EEG/IMU数据流
    // sendCommand(client, proto_sdk.stop_eeg_stream);
    // sendCommand(client, proto_sdk.stop_imu_stream);
    // sendCommand(client, proto_sdk.start_eeg_stream);
    // sendCommand(client, proto_sdk.start_imu_stream);
  });

  client.on("data", (data) => {
    // print data, e.g. 0x01, 0x02, 0x03
    // const hex = data.toString("hex").match(/.{2}/g).join(", 0x");
    // console.debug("Received data:", `0x${hex}`);
    receiveData(data);
  });

  client.on("close", () => {
    console.log("Connection closed");
  });

  client.on("error", (error) => {
    console.error("Connection error:", error);
  });
}

function sendCommand(client, builder) {
  let msg = builder();
  console.debug("sendCommand", msg);
  let info = JSON.parse(msg);
  console.debug("sendCommand, msg_id", info.msg_id);
  const buffer = Buffer.from(info.buf);
  client.write(buffer);
}

function initChart() {
  // 初始化绘图
  // initPlotlyChart();
  setInterval(updateEegChart, 100); // 每 100ms 更新绘图
}

function updateEegChart() {
  // 获取EEG数据缓冲区中的数据
  const fetch_num = 100; // 每次获取的数据点数, 超过缓冲区长度时，返回缓冲区中的所有数据
  const clean = true; // 是否清空缓冲区
  let json = proto_sdk.get_eeg_data_buffer(fetch_num, clean);
  let eegBuff = JSON.parse(json);
  console.log(`eegBuff, len=${eegBuff.length}`);
  for (const row of eegBuff) {
    const eegData = EEGData.fromData(row);
    const channelValues = eegData.channelValues;

    // 更新每个通道的数据
    for (let i = 0; i < channelValues.length; i++) {
      eegValues[i].shift(); // 移除第一个元素
      eegValues[i].push(channelValues[i]); // 添加最新的数据值
    }
  }

  // 绘制更新后的数据
  for (let i = 0; i < eegValues.length; i++) {
    const rawData = eegValues[i];
    const data = prepareEEGData(rawData);
    // updatePlotlyChart(i, data);
  }

  if (eegBuff.length < 6) {
    console.log("eegBuff.lengh", eegBuff.length);
    return;
  }

  // 只打印前3及最后3条EEG数据
  for (let i = 0; i < 3; i++) {
    const eegData = EEGData.fromData(eegBuff[i]);
    console.log("timestamp", eegData.timestamp);
  }
  console.log("...");
  for (let i = eegBuff.length - 3; i < eegBuff.length; i++) {
    const eegData = EEGData.fromData(eegBuff[i]);
    console.log("timestamp", eegData.timestamp);
  }
}
