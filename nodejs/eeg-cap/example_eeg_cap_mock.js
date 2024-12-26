import {
  proto_sdk,
  initMsgParser,
  receiveData,
  prepareEEGData,
  NoiseTypes,
} from "./example_eeg_cap.js";

import { EEGData, IMUData, printTimestamp } from "./example_eeg_cap_model.js";

import path from "path";
import { fileURLToPath } from "url";
import fileSystem from "fs";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EEG数据
const fs = 250; // 采样频率
const num_channels = 32; // 通道数
const eeg_buffer_length = 10000; // 默认缓冲区长度, 1000个数据点，每个数据点有32个通道，每个通道的值类型为float32，即4字节，大约占用128KB内存, 1000 * 32 * 4 = 128000 bytes
let eeg_seq_num = 0; // EEG数据包序号
let eegValues = Array.from({ length: num_channels }, () =>
  Array(eeg_buffer_length).fill(0)
);

// 滤波器参数设置
const order = 4; // 滤波器阶数
const lowCut = 2; // 低通滤波截止频率
const highCut = 45; // 高通滤波截止频率

// IMU数据
const imu_buffer_length = 10000; // 默认缓冲区长度, 1000个数据点

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

function updateEegChart() {
  // 获取EEG数据缓冲区中的数据
  const fetch_num = 5000; // 每次获取的数据点数, 超过缓冲区长度时，返回缓冲区中的所有数据
  const clean = true; // 是否清空缓冲区
  let json = proto_sdk.get_eeg_data_buffer(fetch_num, clean);
  let eegBuff = JSON.parse(json);
  if (eegBuff.length <= 0) {
    return;
  }
  console.log(`eegBuff, len=${eegBuff.length}`);
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

  // 绘制更新后的数据
  for (let i = 0; i < eegValues.length; i++) {
    const rawData = eegValues[i];
    const data = prepareEEGData(rawData);
    // updatePlotlyChart(i, data);
  }
}

function printImuData() {
  const fetch_num = 5000; // 每次获取的数据点数, 超过缓冲区长度时，返回缓冲区中的所有数据
  const clean = true; // 是否清空缓冲区
  let json = proto_sdk.get_imu_data_buffer(fetch_num, clean);
  let imuBuff = JSON.parse(json);
  if (imuBuff.length <= 0) {
    return;
  }
  console.log(`imuBuff, len=${imuBuff.length}`);
  let list = imuBuff.map((row) => IMUData.fromData(row));
  printTimestamp(list);
}

function mock_recv_data() {
  console.log("mock_recv_data");
  const msgs = [
    // empty response
    [
      0x42, 0x52, 0x4e, 0x43, 0x02, 0x0b, 0x02, 0x00, 0x00, 0x02, 0x00, 0x08,
      0x02, 0xac, 0x36,
    ],
    // Device info response
    [
      0x42, 0x52, 0x4e, 0x43, 0x02, 0x0b, 0x27, 0x00, 0x00, 0x02, 0x00, 0x08,
      0x02, 0x32, 0x23, 0x0a, 0x05, 0x45, 0x45, 0x47, 0x33, 0x32, 0x12, 0x0c,
      0x45, 0x45, 0x47, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
      0x22, 0x05, 0x31, 0x2e, 0x30, 0x2e, 0x30, 0x2a, 0x05, 0x30, 0x2e, 0x30,
      0x2e, 0x36, 0xb1, 0x8c,
    ],
    // EEG config response
    [
      0x42, 0x52, 0x4e, 0x43, 0x02, 0x0b, 0x0c, 0x00, 0x00, 0x02, 0x00, 0x08,
      0x03, 0x1a, 0x08, 0x0a, 0x06, 0x08, 0x6f, 0x10, 0x3f, 0x18, 0x0f, 0xd2,
      0x00,
    ],
    // IMU config response
    [
      0x42, 0x52, 0x4e, 0x43, 0x02, 0x0b, 0x08, 0x00, 0x00, 0x02, 0x00, 0x08,
      0x03, 0x22, 0x04, 0x0a, 0x02, 0x08, 0x01, 0x4b, 0xf8,
    ],
  ];
  for (const msg of msgs) {
    receiveData(msg);
  }
  // return;

  // read from file, eeg_cap_sample_eeg.log
  console.log(path.resolve(__dirname, "eeg_cap_sample_eeg.log"));
  const f = fileSystem.readFileSync(
    path.resolve(__dirname, "eeg_cap_sample_eeg.log")
  );
  const lines = f.toString().split("\n");
  console.log(`lines, len=${lines.length}`);
  for (const line of lines) {
    const data = line.split(", ");
    receiveData(data);
  }

  // read from file, eeg_cap_sample_imu.log
  console.log(path.resolve(__dirname, "eeg_cap_sample_imu.log"));
  const f2 = fileSystem.readFileSync(
    path.resolve(__dirname, "eeg_cap_sample_imu.log")
  );
  const lines2 = f2.toString().split("\n");
  console.log(`lines2, len=${lines2.length}`);
  for (const line of lines2) {
    const data = line.split(", ");
    receiveData(data);
  }
}

await initMsgParser();
initCfg();
mock_recv_data();
await setTimeout(() => {
  updateEegChart();
  printImuData();
}, 1000);
