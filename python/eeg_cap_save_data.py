import asyncio
import logging
import binascii

from logger import getLogger
from bc_proto_sdk import MessageParser, MsgType, PyTcpClient

# logger = getLogger(logging.DEBUG)
logger = getLogger(logging.INFO)


async def write_data_to_file(data_stream, f):
    async for data in data_stream:
        hex_data = binascii.hexlify(data).decode("utf-8")
        formatted_data = ", ".join(
            f"0x{hex_data[i:i+2]}" for i in range(0, len(hex_data), 2)
        )
        logger.info(f"data: {formatted_data}")
        f.write(formatted_data + "\n")


async def scan_and_connect():
    # 如果已知IP地址和端口，可以直接指定
    (addr, port) = ("192.168.3.7", 53129)  # hailong-dev
    (addr, port) = ("192.168.3.23", 53129)  # xiangao-dev
    # (addr, port) = ("192.168.3.12", 53129) # yongle-dev

    # 创建消息解析器
    parser = MessageParser("eeg-cap-device", MsgType.EEGCap)

    # 创建TCP客户端
    client = PyTcpClient(addr, port)
    data_stream = await client.get_data_stream()

    # 连接设备
    await client.connect(parser)

    await client.stop_eeg_stream()
    await client.stop_imu_stream()
    await client.start_eeg_stream()
    # await client.start_imu_stream()
    # await client.get_eeg_config()
    # await client.get_imu_config()
    # await client.get_device_info()

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
