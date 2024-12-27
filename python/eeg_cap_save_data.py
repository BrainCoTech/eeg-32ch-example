import asyncio
import logging
import binascii

from eeg_cap_model import get_addr_port, eeg_cap
from logger import getLogger
from bc_proto_sdk import (
    MessageParser,
    MsgType,
    PyTcpClient,
)  # , EegSampleRate, EegSignalGain, EegSignalSource

# logger = getLogger(logging.DEBUG)
logger = getLogger(logging.INFO)


async def write_data_to_file(data_stream, f):
    async for data in data_stream:
        hex_data = binascii.hexlify(data).decode("utf-8")
        formatted_data = ", ".join(
            f"0x{hex_data[i:i+2]}" for i in range(0, len(hex_data), 2)
        )
        # logger.info(f"data: {formatted_data}")
        logger.info(f"data len: {len(data)}")
        f.write(formatted_data + "\n")


async def scan_and_connect():
    (addr, port) = await get_addr_port()

    # 创建消息解析器
    parser = MessageParser("eeg-cap-device", MsgType.EEGCap)

    # 创建TCP客户端
    client = PyTcpClient(addr, port)
    data_stream = await client.get_data_stream()

    # 连接设备
    await client.connect(parser)

    # await client.stop_eeg_stream()
    # await client.stop_imu_stream()

    # await client.get_device_info()
    # await client.get_eeg_config()
    # await client.get_imu_config()

    # await client.set_eeg_config(eeg_cap.EegSampleRate.SR_2000Hz, eeg_cap.EegSignalGain.GAIN_6, eeg_cap.EegSignalSource.NORMAL)
    # await client.set_imu_config(eeg_cap.ImuSampleRate.SR_50Hz)
    # await client.set_imu_config(eeg_cap.ImuSampleRate.SR_100Hz)

    await client.start_eeg_stream()
    # await client.start_imu_stream()

    with open("eeg-cap-msg.log", "w+") as f:
        write_task = asyncio.create_task(write_data_to_file(data_stream, f))

        logger.info("start to read data")

        # 等待30秒
        await asyncio.sleep(30)

        logger.info("stop to read data")

        # 停止流
        await client.stop_imu_stream()
        await client.stop_eeg_stream()

        # 等待写任务完成
        write_task.cancel()

        logger.info("write data to file")
        f.flush()
        f.close()
        logger.info("write data to file done")


async def main():
    await scan_and_connect()


if __name__ == "__main__":
    asyncio.run(main())
