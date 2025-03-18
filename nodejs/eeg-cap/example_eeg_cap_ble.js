import {
  proto_sdk,
  initBleMsgParser,
  receiveBleData,
} from "./example_eeg_cap.js";

function initCfg() {
  // console.log("initCfg");
  proto_sdk.on("resp", (device_id, resp) => {
    console.log(`[${device_id}] resp received, ${resp}`);
  });
}

await initBleMsgParser();
initCfg();

/// TODO: scan and connect device
// const SERVICE_UUID = Uuid::from_u128(0x4de5a20c_0001_ae0b_bf63_0242ac130002);
// const ECAP_TX_CHARACTERISTIC_UUID: Uuid::from_u128(0x4de5a20c_0002_ae0b_bf63_0242ac130002);
// const ECAP_RX_CHARACTERISTIC_UUID = Uuid::from_u128(0x4de5a20c_0003_ae0b_bf63_0242ac130002);

async function onConnected() {
  /// setter methods
  // const model = "EEG32";
  // const sn = "SN-123456";
  // sendCommand(ble, () => proto_sdk.set_ble_device_info(model, sn));

  // const ssid = "eeg-wifi";
  // const password = "0123456789";
  // sendCommand(ble, () =>
  //   proto_sdk.set_wifi_config(
  //     true,
  //     proto_sdk.WiFiSecurity.SecurityWpa2MixedPsk,
  //     ssid,
  //     password
  //   )
  // );

  /// getter methods
  sendCommand(ble, proto_sdk.get_ble_device_info);
  sendCommand(ble, proto_sdk.get_wifi_status);
  sendCommand(ble, proto_sdk.get_wifi_config);
}

function sendCommand(ble, builder) {
  let msg = builder();
  console.debug("sendCommand", msg);
  let info = JSON.parse(msg);
  console.debug("sendCommand, msg_id", info.msg_id);
  const buffer = Buffer.from(info.buf);
  ble.write(buffer);
}

// TODO: implement onBleReceived
function onBleReceived(data) {
  receiveBleData(data);
}
