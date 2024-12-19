import pyqtgraph as pg
from pyqtgraph.Qt.QtWidgets import QApplication
import numpy as np
import asyncio
from qasync import QEventLoop

plots = []
curves = []
num_channels = 32
data_length = 100  # 每个通道显示的数据点数

# 生成初始数据
eeg_values = np.zeros((num_channels, data_length))

# 创建主窗口
app = QApplication([])

win = pg.GraphicsLayoutWidget(show=True, title="32-Channel Dynamic Plot")
win.resize(1000, 600)
win.setWindowTitle("32-Channel Dynamic Plot")

# 生成32个图表，每个图表表示一个通道
for i in range(num_channels):
    plot = win.addPlot(title=f"Channel {i + 1}")
    plot.setYRange(-1, 1)  # 设置Y轴范围
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
    timer.timeout.connect(mock_update_plot)
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
    asyncio.run(mock_scan_and_connect(loop))
