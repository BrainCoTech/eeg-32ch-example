import {
  initMsgParser,
  receiveData,
  // EegSignalGain,  
} from "./example_eeg_cap.js";

await initMsgParser();

/// Simulate incoming data
// EEG data
receiveData([
  66, 82, 78, 67, 2, 11, 121, 0, 0, 2, 0, 8, 1, 26, 117, 18, 115, 10, 113, 8,
  213, 8, 18, 108, 192, 0, 0, 17, 177, 229, 17, 176, 135, 17, 181, 47, 17, 189,
  18, 17, 191, 248, 17, 184, 115, 17, 192, 86, 17, 194, 105, 192, 0, 0, 219,
  237, 13, 221, 144, 42, 15, 77, 164, 13, 9, 104, 219, 221, 63, 217, 90, 108,
  13, 27, 136, 13, 90, 223, 192, 0, 0, 13, 0, 65, 12, 234, 68, 17, 188, 254, 13,
  219, 151, 12, 221, 3, 13, 18, 253, 16, 175, 80, 13, 14, 152, 192, 0, 0, 13,
  28, 40, 13, 2, 123, 13, 28, 153, 13, 3, 246, 13, 40, 144, 12, 245, 37, 17,
  191, 50, 17, 196, 51, 151, 63,
]);
receiveData([
  66, 82, 78, 67, 2, 11, 121, 0, 0, 2, 0, 8, 1, 26, 117, 18, 115, 10, 113, 8,
  214, 8, 18, 108, 192, 0, 0, 17, 171, 152, 17, 170, 61, 17, 174, 231, 17, 182,
  195, 17, 185, 173, 17, 178, 41, 17, 186, 8, 17, 188, 33, 192, 0, 0, 219, 243,
  101, 221, 150, 129, 15, 77, 190, 13, 6, 210, 219, 227, 131, 217, 96, 162, 13,
  19, 229, 13, 90, 185, 192, 0, 0, 12, 255, 201, 12, 228, 181, 17, 182, 186, 13,
  218, 119, 12, 219, 216, 13, 18, 5, 16, 174, 225, 13, 13, 50, 192, 0, 0, 13,
  27, 229, 12, 251, 200, 13, 20, 219, 12, 251, 65, 13, 40, 130, 12, 242, 249,
  17, 184, 212, 17, 189, 214, 174, 78,
]);

// IMU data
receiveData([
  66, 82, 78, 67, 2, 11, 55, 0, 0, 2, 0, 34, 53, 18, 51, 10, 15, 21, 0, 12, 226,
  198, 29, 0, 8, 16, 70, 37, 0, 64, 206, 70, 18, 15, 21, 0, 8, 136, 197, 29, 0,
  0, 160, 68, 37, 0, 64, 64, 196, 26, 15, 21, 0, 128, 139, 67, 29, 0, 0, 130,
  194, 37, 0, 0, 114, 195, 171, 223,
]);
receiveData([
  66, 82, 78, 67, 2, 11, 55, 0, 0, 2, 0, 34, 53, 18, 51, 10, 15, 21, 0, 12, 236,
  198, 29, 0, 8, 40, 70, 37, 0, 64, 188, 70, 18, 15, 21, 0, 8, 136, 197, 29, 0,
  0, 128, 68, 37, 0, 64, 64, 196, 26, 15, 21, 0, 128, 141, 67, 29, 0, 0, 104,
  194, 37, 0, 0, 112, 195, 145, 106,
]);
