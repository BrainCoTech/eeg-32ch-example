import asyncio
import logging
import numpy as np

from logger import getLogger
from bc_proto_sdk import MessageParser, MsgType, PyTcpClient, NoiseTypes
from eeg_cap_model import (
    EEGData,
    IMUData,
    eeg_cap,
    perform_bandpass,
    set_env_noise_filter_cfg,
    remove_env_noise,
    set_eeg_buffer_length,
)

# logger = getLogger(logging.DEBUG)
logger = getLogger(logging.INFO)

# EEG数据
fs = 250  # 采样频率
num_channels = 32  # 通道数
eeg_buffer_length = 1000  # 默认缓冲区长度, 1000个数据点，每个数据点有32个通道，每个通道的值类型为float32，即4字节，大约占用128KB内存, 1000 * 32 * 4 = 128000 bytes
eeg_seq_num = None  # EEG数据包序号
eeg_values = np.zeros((num_channels, eeg_buffer_length))  # 32通道的EEG数据

# 滤波器参数设置
order = 4  # 滤波器阶数
low_cut = 2  # 低通滤波截止频率
high_cut = 45  # 高通滤波截止频率


def print_imu_data():
    fetch_num = 100  # 每次获取的数据点数, 超过缓冲区长度时，返回缓冲区中的所有数据
    clean = True  # 是否清空缓冲区
    imu_buff = eeg_cap.get_imu_buffer(fetch_num, clean)
    imu_result = []
    for i in range(len(imu_buff)):
        imu_result.append(IMUData.from_data(imu_buff[i]))

    result_str = "\n\t".join(map(str, imu_result))
    logger.info(f"Got IMU buffer result:\n\t{result_str}")

def print_eeg_data():
    # 获取EEG数据
    fetch_num = 100  # 每次获取的数据点数, 超过缓冲区长度时，返回缓冲区中的所有数据
    clean = True  # 是否清空缓冲区
    eeg_buff = eeg_cap.get_eeg_buffer(fetch_num, clean)
    logger.info(f"get_eeg_buffer result len={len(eeg_buff)}")
    if len(eeg_buff) == 0:
        return

    for row in eeg_buff:
        eeg_data = EEGData.from_data(row)

        # 检查数据包序号
        timestamp = eeg_data.timestamp
        global eeg_seq_num
        # logger.info(f"timestamp={timestamp}")
        if eeg_seq_num is not None and timestamp != eeg_seq_num + 1:
            logger.warning(f"eeg_seq_num={eeg_seq_num}, timestamp={timestamp}")
        if eeg_seq_num is not None or timestamp == 2:  # 第一个数据包的时间戳有误
            eeg_seq_num = timestamp

        channel_values = eeg_data.data
        # 更新每个通道的数据
        for i in range(len(channel_values)):
            eeg_values[i] = np.roll(eeg_values[i], -1)  # 数据向左滚动，腾出最后一个位置
            eeg_values[i, -1] = channel_values[i]  # 更新最新的数据值

    # 打印数据
    for i in range(len(eeg_values)):
        raw_data = eeg_values[i]
        data = remove_env_noise(raw_data)
        data = perform_bandpass(data, order, low_cut, high_cut, fs)
        # 打印通道1数据
        if i == 0:
            # logger.debug(f"raw_data: {raw_data}")
            logger.debug(f"data: {data}")
            # logger.info(f"data len: {len(data)}")


async def scan_and_connect():
    # 扫描不到service时，可以对照[Discovery APP](https://apps.apple.com/cn/app/discovery-dns-sd-browser/id1381004916)
    # 扫描设备IP地址和端口, TODO: 有多个设备的情况
    # (addr, port) = await bc_proto_sdk.eeg_cap.mdns_scan()
    # logger.info(addr)

    # 如果已知IP地址和端口，可以直接指定
    (addr, port) = ("192.168.3.7", 53129)  # hailong-dev
    (addr, port) = ("192.168.3.23", 53129)  # xiangao-dev
    # (addr, port) = ("192.168.3.12", 53129) # yongle-dev

    # 创建消息解析器
    parser = MessageParser("eeg-cap-device", MsgType.EEGCap)
    # 开始消息流
    await parser.start_message_stream()

    # 创建TCP客户端
    client = PyTcpClient(addr, port)
    # 连接设备
    await client.connect(parser)

    # 开始EEG数据流
    await client.start_eeg_stream()
    # 开始IMU数据流
    await client.start_imu_stream()


def init_cfg():
    logger.info("Init cfg")
    set_env_noise_filter_cfg(NoiseTypes.FIFTY, fs)  # 滤波器参数设置，去除50Hz电流干扰
    set_eeg_buffer_length(eeg_buffer_length)  # 设置EEG数据缓冲区长度


async def main():
    init_cfg()
    await scan_and_connect()
    while True:
        print_eeg_data()
        print_imu_data()
        await asyncio.sleep(0.1)  # 100ms


if __name__ == "__main__":
    asyncio.run(main())