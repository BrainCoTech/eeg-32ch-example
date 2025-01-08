import mdns from "mdns";
import net from "net";
import {
  proto_sdk,
  initTcpMsgParser,
  receiveTcpData,
  prepareEEGData,
  NoiseTypes,
  EegSampleRate,
  EegSignalGain,
  EegSignalSource,
  ImuSampleRate,
} from "./example_eeg_cap.js";

import { EEGData, IMUData, printTimestamp } from "./example_eeg_cap_model.js";

// EEG数据
const fs = 250; // 采样频率
const num_channels = 32; // 通道数
const eeg_buffer_length = 1000; // 默认缓冲区长度, 1000个数据点，每个数据点有32个通道，每个通道的值类型为float32，即4字节，大约占用128KB内存, 1000 * 32 * 4 = 128000 bytes
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

await initTcpMsgParser();
initCfg();
initChart();

// 使用 TCP 连接脑电设备
const client = new net.Socket();

// 如果已知IP地址和端口，可以直接指定
// scan_service();
// let addr = "192.168.3.7"; // hailong-dev
// let addr = "192.168.3.12"; // xiangao-dev
let addr = "192.168.3.23"; // yongle-dev
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

// 注意：进行阻抗检测的同时无法采集正常的EEG数据流，需要分别进行
function start_leadoff_check(client) {
  const current = proto_sdk.LeadOffCurrent.Cur6nA; // 默认使用6nA
  const freq = proto_sdk.LeadOffFreq.Ac31p2hz; // AC 31.2 Hz
  // 开始阻抗检测, 从芯片1~4轮询，每个芯片包含8个通道
  // 至少轮询过一轮chip 1~4，才能获取到完整的32个通道的阻抗值
  // const loop_check = false; // 是否循环检测
  const loop_check = true; // 是否循环检测
  proto_sdk.start_leadoff_check(
    loop_check,
    freq,
    current,
    (chip, impedance_values) => {
      // chip 1~4
      // impedance_values, Unit: kΩ, 计算结果不正确时，为0
      console.log(`chip=${chip}, impedance_values=${impedance_values}`);
    }
  );

  // 停止阻抗检测
  // proto_sdk.stop_leadoff_check();
}

function start_eeg_stream(client) {
  // 配置EEG为正常佩戴信号
  // sendCommand(client, () =>
  //   proto_sdk.set_eeg_config(
  //     EegSampleRate.SR_250Hz,
  //     EegSignalGain.GAIN_6,
  //     EegSignalSource.NORMAL
  //   )
  // );

  // 250Hz，增益为1倍，测试信号，循环 1Hz 方波
  sendCommand(client, () =>
    proto_sdk.set_eeg_config(
      EegSampleRate.SR_250Hz,
      EegSignalGain.GAIN_1,
      EegSignalSource.TEST_SIGNAL
    )
  );
  sendCommand(client, proto_sdk.get_eeg_config); // 读取EEG配置, 计算EEG电压值用到配置信息, gain
  sendCommand(client, proto_sdk.start_eeg_stream); // 开启连续EEG数据流通知
}

function start_imu_stream(client) {
  // 设置IMU采样率
  sendCommand(client, () => proto_sdk.set_imu_config(ImuSampleRate.SR_50Hz));
  // sendCommand(client, () => proto_sdk.set_imu_config(ImuSampleRate.SR_100Hz));
  // 读取配置
  sendCommand(client, proto_sdk.get_imu_config);
  sendCommand(client, proto_sdk.start_imu_stream); // 开启连续IMU数据流通知
}

// 连接到发现的服务
async function connectToService(address, port) {
  client.connect(port, address, () => {
    console.log(`Connected to ${address}:${port}`);
    /// 注意，连续发送多条命令时(4条以上？)，固件resp不正确，先绕过，等固件修复

    // 读取设备信息
    // sendCommand(client, proto_sdk.get_device_info);

    // 开始/停止EEG/IMU数据流
    // sendCommand(client, proto_sdk.stop_eeg_stream);
    // sendCommand(client, proto_sdk.stop_imu_stream);

    // 开启阻抗检测模式，与正常EEG模式互斥
    start_leadoff_check(client);

    // start_eeg_stream(client);
    // start_imu_stream(client);
  });

  client.on("data", (data) => {
    // print data, e.g. 0x01, 0x02, 0x03
    // const hex = data.toString("hex").match(/.{2}/g).join(", 0x");
    // console.debug("Received data:", `0x${hex}`);
    receiveTcpData(data);
  });

  client.on("close", () => {
    console.log("Connection closed");
  });

  client.on("error", (error) => {
    console.error("Connection error:", error);
  });
  proto_sdk.set_tcp_write_callback((data) => {
    const buffer = Buffer.from(data);
    client.write(buffer);
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
  // TODO: initPlotlyChart();
  setInterval(updateChart, 100); // 每 100ms 更新绘图
}

function updateChart() {
  // 更新绘图
  updateEegChart();
  updateImuChart();
}

let startTime = Date.now(); // 记录开始时间

function updateEegChart() {
  // 获取EEG数据缓冲区中的数据
  const fetch_num = 100; // 每次获取的数据点数, 超过缓冲区长度时，返回缓冲区中的所有数据
  const clean = true; // 是否清空缓冲区
  let json = proto_sdk.get_eeg_data_buffer(fetch_num, clean);
  let eegBuff = JSON.parse(json);
  if (eegBuff.length <= 0) {
    return;
  }
  let elapsedTime = (Date.now() - startTime) / 1000;
  console.log(`elapsedTime=${elapsedTime}, eegBuff, len=${eegBuff.length}`);
  let list = eegBuff.map((row) => EEGData.fromData(row));
  printTimestamp(list);

  for (const row of list) {
    const channelValues = row.channelValues;

    // 更新每个通道的数据
    for (let i = 0; i < channelValues.length; i++) {
      eegValues[i].shift(); // 移除第一个元素
      eegValues[i].push(channelValues[i]); // 添加最新的数据值
    }
  }

  // TODO: 根据需要绘制EEG时域信号图表和FFT图表
  for (let channel = 0; channel < eegValues.length; channel++) {
    // TODO: 绘制EEG时域信号图表
    const rawData = eegValues[channel]; // 连续的时域数据
    if (channel == 0)
      console.log(
        `rawData, len=${rawData.length}, ${rawData.slice(rawData.length - 5)}`
      );
    const filterData = prepareEEGData(rawData, channel);
    if (channel == 0)
      console.log(`filterData, ${filterData.slice(filterData.length - 5)}`);

    // TODO: 绘制FFT图表
    const n = rawData.length;
    const fftFreq = proto_sdk.get_filtered_freq(n, fs);
    const fftData = proto_sdk.get_filtered_fft(rawData, fs); // 原始EEG数据fft
    const fftData2 = proto_sdk.get_filtered_fft(filterData, fs); // 滤波后的EEG数据fft
  }
}

function updateImuChart() {
  // 获取IMU数据缓冲区中的数据
  const fetch_num = 5000; // 每次获取的数据点数, 超过缓冲区长度时，返回缓冲区中的所有数据
  const clean = true; // 是否清空缓冲区
  let json = proto_sdk.get_imu_data_buffer(fetch_num, clean);
  let imuBuff = JSON.parse(json);
  if (imuBuff.length <= 0) {
    return;
  }
  let elapsedTime = (Date.now() - startTime) / 1000;
  console.log(`elapsedTime=${elapsedTime}, imuBuff, len=${imuBuff.length}`);
  let list = imuBuff.map((row) => IMUData.fromData(row));
  printTimestamp(list);
  // TODO: updateImuPlotlyChart(list);
}
