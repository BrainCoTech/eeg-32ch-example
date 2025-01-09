import asyncio
import logging

from logger import getLogger
import bc_proto_sdk
from bc_proto_sdk import MessageParser, MsgType

# logger = getLogger(logging.DEBUG)
logger = getLogger(logging.INFO)
ecap = bc_proto_sdk.eeg_cap
ble = bc_proto_sdk.ble
parser = MessageParser("ecap-ble", MsgType.EEGCap)
loop = None


async def stop_scan_and_connect(id):
    logger.info("Stopping scan")
    await ble.stop_scan()
    await ble.connect(id)
    logger.info("Connected")

    # test set_ble_device_info
    # model = "EEG32"
    # sn = "SN-12345678"
    # await ecap.set_ble_device_info(id, model, sn)

    # test set_wifi_config
    # bandwidth_40hz = True
    # security = ecap.WiFiSecurity.SECURITY_WPA2_MIXED_PSK
    # ssid = "eeg-wifi"
    # password = "123456789"
    # await ecap.set_wifi_config(id, bandwidth_40hz, security, ssid, password)

    # getters
    msgId = await ecap.get_ble_device_info(id)
    logger.warning(f"msgId: {msgId}")
    msgId = await ecap.get_wifi_config(id)
    logger.warning(f"msgId: {msgId}")
    msgId = await ecap.get_wifi_status(id)
    logger.warning(f"msgId: {msgId}")


def on_device_discovered(id, device):
    logger.info(f"Device {id} discovered: {device.name}")
    if device.name == "Zephyr [EEG-776E2]":
        # if device.name == "Zephyr [EEG-E5FF3]":
        logger.info(f"found device")
        asyncio.run_coroutine_threadsafe(stop_scan_and_connect(id), loop)


def on_connection_state(id, state):
    logger.info(f"Device {id} connection state: {state}")
    if state == ble.ConnectionState.Connected:
        logger.info(f"Device {id} connected")
        # asyncio.run(ble.send_data(id, "Hello, World!"))


def on_received_data(id, data):
    # logger.info(f"Device {id} received data: {data}")
    parser.receive_data(data)


async def main():
    ecap.set_msg_resp_callback(lambda msg: logger.warning(f"Message response: {msg}"))

    # logger.info("Starting BLE adapter")
    # print(ble.set_adapter_state_callback)
    # fmt: off
    ble.set_adapter_state_callback(lambda state: logger.info(f"Adapter state: {state}"))
    ble.set_battery_level_callback(lambda id, battery_level: logger.info(f"Device {id} battery level: {battery_level}"))
    # ble.set_device_info_callback(lambda id, device_info: logger.info(f"Device {id} device_info: {device_info}"))
    ble.set_connection_state_callback(on_connection_state)
    ble.set_received_data_callback(on_received_data)
    ble.set_device_discovered_callback(on_device_discovered)

    await ble.init_adapter()
    await parser.start_message_stream()
    await ble.start_scan(["4de5a20c-0001-ae0b-bf63-0242ac130002"])
    await asyncio.sleep(50)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    logger.info("Starting main")
    print(loop)
    loop.run_until_complete(main())
