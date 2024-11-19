import asyncio
import logging
from logger import getLogger
from bc_proto_sdk import MessageParser, MsgType, mdns_scan, PyTcpClient
from eeg_cap_model import (
    EegSampleRate,
    EegSignalGain,
    EegSignalSource,
    ImuSampleRate,
    # WiFiSecurity,
    handle_message,
)

# logger = getLogger(logging.DEBUG)
logger = getLogger(logging.INFO)


### main.py
async def main():
    # 扫描不到service时，可以对照[Discovery APP](https://apps.apple.com/cn/app/discovery-dns-sd-browser/id1381004916)
    # TODO: 有时无法扫描到service，等待固件排查修复
    (addr, port) = await mdns_scan()
    logger.info(addr)

    # 创建消息解析器
    parser = MessageParser("eeg-cap-device", MsgType.EEGCap)
    message_stream = parser.get_message_stream()

    # 创建TCP客户端
    client = PyTcpClient(addr, port)
    # 连接设备
    await client.connect(parser)

    # 读取配置
    # TODO: 连续发送多条cmd时，固件返回的resp可能不正确，等待固件修复
    # await client.get_eeg_config()
    # await client.get_eeg_config()
    # await client.get_imu_config()
    # await client.get_imu_config()

    # 配置EEG/IMU
    # await client.set_eeg_config(
    #     EegSampleRate.SR_250Hz, EegSignalGain.GAIN_6, EegSignalSource.NORMAL
    # )
    # await client.set_eeg_config(
    #     EegSampleRate.SR_500Hz, EegSignalGain.GAIN_1, EegSignalSource.NORMAL
    # )
    # await client.set_imu_config(ImuSampleRate.SR_50Hz)
    # await client.set_imu_config(ImuSampleRate.SR_100Hz)

    # 开始/停止EEG/IMU数据流
    # await client.stop_eeg_stream()
    # await client.stop_imu_stream()
    await client.start_eeg_stream()
    await client.start_imu_stream()

    logger.debug("Starting Received messages")
    async for py_message in message_stream:
        handle_message(py_message, logger)

    logger.info("Finished Received messages")


asyncio.run(main())
