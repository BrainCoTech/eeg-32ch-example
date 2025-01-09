import asyncio
import logging
import numpy as np

from logger import getLogger
from bc_proto_sdk import MessageParser, MsgType, PyTcpClient, NoiseTypes
from eeg_cap_model import (
    eeg_cap,
    get_addr_port,
    set_env_noise_filter_cfg,
)

# logger = getLogger(logging.DEBUG)
logger = getLogger(logging.INFO)

# EEG数据
fs = 250  # 采样频率
num_channels = 32  # 通道数


async def scan_and_connect():
    (addr, port) = await get_addr_port()

    # 创建消息解析器
    parser = MessageParser("eeg-cap-device", MsgType.EEGCap)
    # 开始消息流
    await parser.start_message_stream()

    # 创建TCP客户端
    client = PyTcpClient(addr, port)
    # 连接设备
    await client.connect(parser)
    await start_leadoff_check(client)


# 开始阻抗检测，与正常EEG模式互斥，注意：从阻抗检测模式切换到正常EEG模式, 需要先停止阻抗检测
async def start_leadoff_check(client):
    # fmt: off
    # 设置阻抗检测结果回调
    eeg_cap.set_imp_data_callback(lambda chip, values: logger.info(f"chip: {chip}, impendance values: {values}"))
    # 是否循环检测芯片1~4
    # loop_check = True
    loop_check = False
    await client.start_leadoff_check(loop_check, eeg_cap.LeadOffFreq.Ac31p2hz, eeg_cap.LeadOffCurrent.Cur6nA)


# 停止阻抗检测，与正常EEG模式互斥，注意：从阻抗检测模式切换到正常EEG模式, 需要先停止阻抗检测
async def stop_leadoff_check(client):
    await client.stop_leadoff_check()


def init_cfg():
    logger.info("Init cfg")
    set_env_noise_filter_cfg(NoiseTypes.FIFTY, fs)  # 滤波器参数设置，去除50Hz电流干扰
    eeg_cap.set_msg_resp_callback(
        lambda msg: logger.warning(f"Message response: {msg}")
    )


async def main():
    init_cfg()
    await scan_and_connect()
    await asyncio.sleep(30)


if __name__ == "__main__":
    asyncio.run(main())
