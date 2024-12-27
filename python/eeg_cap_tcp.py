import asyncio
import logging
import numpy as np
import pyqtgraph as pg
from pyqtgraph.Qt.QtWidgets import QApplication
from qasync import QEventLoop

from logger import getLogger
from bc_proto_sdk import MessageParser, MsgType, PyTcpClient, NoiseTypes
from eeg_cap_model import eeg_cap, perform_bandpass, set_env_noise_filter_cfg, remove_env_noise

# logger = getLogger(logging.DEBUG)
logger = getLogger(logging.INFO)

plots = []
curves = []
num_channels = 32
data_length = 100  # 每个通道显示的数据点数

fs = 250  # 采样频率
order = 4  # 滤波器阶数
low_cut = 2  # 低通滤波截止频率
high_cut = 45  # 高通滤波截止频率

# 32通道的EEG数据
eeg_values = np.zeros((num_channels, data_length))


def update_plot():
    # 从获取EEG数据
    eeg_buff = eeg_cap.get_eeg_buffer(data_length, False)  # `eeg_buff` 是二维数组
    logger.info(f"update_plot, len={len(eeg_buff)}")
    if len(eeg_buff) == 0:
        return

    for row in eeg_buff:
        # 每行的第一个元素是时间戳，忽略或用于记录
        timestamp = row[0]

        # 后续 32 个值为 EEG 信号数据
        channel_values = row[1:]

        # 更新每个通道的数据
        for i in range(len(channel_values)):
            eeg_values[i] = np.roll(eeg_values[i], -1)  # 数据向左滚动，腾出最后一个位置
            eeg_values[i, -1] = channel_values[i]  # 更新最新的数据值

    # 绘制更新后的数据
    for i in range(len(eeg_values)):
        raw_data = eeg_values[i]
        data = remove_env_noise(raw_data)
        data = perform_bandpass(data, order, low_cut, high_cut, fs)
        curves[i].setData(data)  # 更新曲线
        # 打印通道1数据
        # if i == 0:
        #     print(f"raw_data: {raw_data}")
        #     print(f"data: {data}")


async def scan_and_connect(loop):
    # 扫描不到service时，可以对照[Discovery APP](https://apps.apple.com/cn/app/discovery-dns-sd-browser/id1381004916)
    # 扫描设备IP地址和端口
    # (addr, port) = await bc_proto_sdk.eeg_cap.mdns_scan()
    # logger.info(addr)
    # 如果已知IP地址和端口，可以直接指定
    (addr, port) = ("192.168.3.7", 53129)  # hailong-dev
    (addr, port) = ("192.168.3.12", 53129)

    # 创建消息解析器
    parser = MessageParser("eeg-cap-device", MsgType.EEGCap)
    # 开始消息流
    await parser.start_message_stream()

    # 创建TCP客户端
    client = PyTcpClient(addr, port)
    # 连接设备
    await client.connect(parser)

    # 读取配置
    await client.get_eeg_config()
    await client.get_imu_config()

    # fmt: off
    # 配置EEG/IMU
    # await client.set_eeg_config(EegSampleRate.SR_250Hz, EegSignalGain.GAIN_6, EegSignalSource.NORMAL)
    # await client.set_eeg_config(EegSampleRate.SR_500Hz, EegSignalGain.GAIN_1, EegSignalSource.NORMAL)
    # await client.set_imu_config(ImuSampleRate.SR_50Hz)
    # await client.set_imu_config(ImuSampleRate.SR_100Hz)

    # 开始/停止EEG/IMU数据流
    # await client.stop_eeg_stream()
    # await client.stop_imu_stream()
    await client.start_eeg_stream()
    # await client.start_imu_stream()

    try:
        loop.run_forever()  # 事件循环运行直到手动退出
    finally:
        loop.close()


# 创建主窗口
app = QApplication([])

win = pg.GraphicsLayoutWidget(show=True, title="32-Channel Dynamic Plot")
win.resize(1000, 600)
win.setWindowTitle("32-Channel Dynamic Plot")

# 生成32个图表，每个图表表示一个通道
for i in range(num_channels):
    plot = win.addPlot(title=f"Channel {i + 1}")
    # plot.setYRange(-200, 200)  # 设置Y轴范围
    plot.enableAutoRange(axis=pg.ViewBox.YAxis)  # 设置Y轴范围动态调整
    plots.append(plot)
    curve = plot.plot(
        pen=pg.mkPen(color=(i * 8 % 255, i * 16 % 255, i * 32 % 255), width=1.5)
    )  # 设置曲线颜色
    curves.append(curve)
    if (i + 1) % 4 == 0:  # 每4个通道换一行
        win.nextRow()


# 更新函数
def mock_update_plot():
    global eeg_values
    # 随机生成新数据
    new_data = np.random.uniform(-1, 1, size=(num_channels,))
    eeg_values = np.roll(eeg_values, -1, axis=1)  # 左移
    eeg_values[:, -1] = new_data  # 更新最新数据

    # 更新每条曲线
    for i in range(num_channels):
        curves[i].setData(eeg_values[i])


def init_timer():
    print("Init timer")
    # 定时器
    timer = pg.QtCore.QTimer()
    # timer.timeout.connect(mock_update_plot)
    timer.timeout.connect(update_plot)
    timer.start(50)  # 每50ms更新一次
    return timer


async def mock_scan_and_connect(loop):
    # 示例逻辑：异步连接设备
    print("Scanning and connecting to device...")
    await asyncio.sleep(2)  # 模拟扫描耗时
    print("Device connected.")
    try:
        loop.run_forever()  # 事件循环运行直到手动退出
    finally:
        loop.close()


if __name__ == "__main__":
    loop = QEventLoop(app)
    asyncio.set_event_loop(loop)
    timer = init_timer()
    set_env_noise_filter_cfg(NoiseTypes.FIFTY, fs)
    asyncio.run(scan_and_connect(loop))
    # asyncio.run(mock_scan_and_connect(loop))
