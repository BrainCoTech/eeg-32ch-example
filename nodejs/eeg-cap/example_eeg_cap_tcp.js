import mdns from "mdns";
import net from "net";
import {
  initMsgParser,
  receiveData,
  EegSampleRate,
  EegSignalGain,
  EegSignalSource,
  ImuSampleRate,
  get_eeg_config_builder,
  set_eeg_config_builder,
  start_eeg_stream_builder,
  stop_eeg_stream_builder,
  get_imu_config_builder,
  set_imu_config_builder,
  start_imu_stream_builder,
  stop_imu_stream_builder,
} from "./example_eeg_cap.js";

await initMsgParser();

// 使用 mdns 库发现服务
const browser = mdns.createBrowser(mdns.tcp("brainco-eeg"));
// 扫描不到service时，可以对照[Discovery APP](https://apps.apple.com/cn/app/discovery-dns-sd-browser/id1381004916)
// TODO: 有时无法扫描到service，等待固件排查修复

// 使用 TCP 连接脑电设备
const client = new net.Socket();

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

// 连接到发现的服务
async function connectToService(address, port) {
  client.connect(port, address, () => {
    console.log(`Connected to ${address}:${port}`);
    // await initMsgParser();

    // 读取配置
    // TODO: 连续发送多条cmd时，固件返回的resp可能不正确，等待固件修复
    // sendCommand(client, get_eeg_config_builder);
    // sendCommand(client, get_imu_config_builder);

    // 配置EEG/IMU
    // sendCommand(client, () =>
    //   set_eeg_config_builder(
    //     EegSampleRate.SR_250Hz,
    //     EegSignalGain.GAIN_6,
    //     EegSignalSource.NORMAL
    //   )
    // );
    // sendCommand(client, () =>
    //   set_eeg_config_builder(
    //     EegSampleRate.SR_500Hz,
    //     EegSignalGain.GAIN_1,
    //     EegSignalSource.TEST_SIGNAL
    //   )
    // );
    // sendCommand(client, () => set_imu_config_builder(ImuSampleRate.SR_50Hz));
    // sendCommand(client, () => set_imu_config_builder(ImuSampleRate.SR_100Hz));

    // 开始/停止EEG/IMU数据流
    // sendCommand(client, stop_eeg_stream_builder);
    // sendCommand(client, stop_imu_stream_builder);
    sendCommand(client, start_eeg_stream_builder);
    sendCommand(client, start_imu_stream_builder);
  });

  client.on("data", (data) => {
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
