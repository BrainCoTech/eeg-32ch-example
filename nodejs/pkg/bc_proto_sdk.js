
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_0(addHeapObject(e));
    }
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let cachedUint16ArrayMemory0 = null;

function getUint16ArrayMemory0() {
    if (cachedUint16ArrayMemory0 === null || cachedUint16ArrayMemory0.byteLength === 0) {
        cachedUint16ArrayMemory0 = new Uint16Array(wasm.memory.buffer);
    }
    return cachedUint16ArrayMemory0;
}

function getArrayU16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
 * @param {string} level
 */
module.exports.init_logging = function(level) {
    const ptr0 = passStringToWasm0(level, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
    const len0 = WASM_VECTOR_LEN;
    wasm.init_logging(ptr0, len0);
};

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @returns {any}
 */
module.exports.get_device_info = function() {
    const ret = wasm.get_device_info();
    return takeObject(ret);
};

/**
 * @returns {any}
 */
module.exports.start_eeg_stream = function() {
    const ret = wasm.start_eeg_stream();
    return takeObject(ret);
};

/**
 * @returns {any}
 */
module.exports.stop_eeg_stream = function() {
    const ret = wasm.stop_eeg_stream();
    return takeObject(ret);
};

/**
 * @param {number} take
 * @param {boolean} clean
 * @returns {any}
 */
module.exports.get_eeg_data_buffer = function(take, clean) {
    const ret = wasm.get_eeg_data_buffer(take, clean);
    return takeObject(ret);
};

/**
 * @param {number} take
 * @param {boolean} clean
 * @returns {any}
 */
module.exports.get_imu_data_buffer = function(take, clean) {
    const ret = wasm.get_imu_data_buffer(take, clean);
    return takeObject(ret);
};

/**
 * @returns {any}
 */
module.exports.get_eeg_config = function() {
    const ret = wasm.get_eeg_config();
    return takeObject(ret);
};

/**
 * @param {EegSampleRate} sr
 * @param {EegSignalGain} gain
 * @param {EegSignalSource} signal
 * @returns {any}
 */
module.exports.set_eeg_config = function(sr, gain, signal) {
    const ret = wasm.set_eeg_config(sr, gain, signal);
    return takeObject(ret);
};

/**
 * @returns {any}
 */
module.exports.start_imu_stream = function() {
    const ret = wasm.start_imu_stream();
    return takeObject(ret);
};

/**
 * @returns {any}
 */
module.exports.stop_imu_stream = function() {
    const ret = wasm.stop_imu_stream();
    return takeObject(ret);
};

/**
 * @returns {any}
 */
module.exports.get_imu_config = function() {
    const ret = wasm.get_imu_config();
    return takeObject(ret);
};

/**
 * @param {ImuSampleRate} sr
 * @returns {any}
 */
module.exports.set_imu_config = function(sr) {
    const ret = wasm.set_imu_config(sr);
    return takeObject(ret);
};

/**
 * @param {NoiseTypes} noise_type
 * @param {number} fs
 */
module.exports.set_env_noise_filter_cfg = function(noise_type, fs) {
    wasm.set_env_noise_filter_cfg(noise_type, fs);
};

let cachedFloat32ArrayMemory0 = null;

function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
 * @param {Float32Array} data
 * @returns {Float32Array}
 */
module.exports.remove_env_noise = function(data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF32ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.remove_env_noise(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayF32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_1(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {boolean} high_pass_enabled
 * @param {number} high_cut
 * @param {boolean} low_pass_enabled
 * @param {number} low_cut
 * @param {boolean} band_pass_enabled
 * @param {number} band_pass_low
 * @param {number} band_pass_high
 * @param {boolean} band_stop_enabled
 * @param {number} band_stop_low
 * @param {number} band_stop_high
 * @param {number} fs
 */
module.exports.set_eeg_filter_cfg = function(high_pass_enabled, high_cut, low_pass_enabled, low_cut, band_pass_enabled, band_pass_low, band_pass_high, band_stop_enabled, band_stop_low, band_stop_high, fs) {
    wasm.set_eeg_filter_cfg(high_pass_enabled, high_cut, low_pass_enabled, low_cut, band_pass_enabled, band_pass_low, band_pass_high, band_stop_enabled, band_stop_low, band_stop_high, fs);
};

/**
 * @param {Float32Array} data
 * @returns {Float32Array}
 */
module.exports.apply_eeg_filters = function(data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF32ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.apply_eeg_filters(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayF32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_1(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {Float32Array} data
 * @param {number} order
 * @param {number} high_cut
 * @param {number} fs
 * @returns {Float32Array}
 */
module.exports.apply_highpass_filter = function(data, order, high_cut, fs) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF32ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.apply_highpass_filter(retptr, ptr0, len0, order, high_cut, fs);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayF32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_1(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {Float32Array} data
 * @param {number} order
 * @param {number} low_cut
 * @param {number} fs
 * @returns {Float32Array}
 */
module.exports.apply_lowpass_filter = function(data, order, low_cut, fs) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF32ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.apply_highpass_filter(retptr, ptr0, len0, order, low_cut, fs);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayF32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_1(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {Float32Array} data
 * @param {number} order
 * @param {number} low_cut
 * @param {number} high_cut
 * @param {number} fs
 * @returns {Float32Array}
 */
module.exports.apply_bandpass_filter = function(data, order, low_cut, high_cut, fs) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF32ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.apply_bandpass_filter(retptr, ptr0, len0, order, low_cut, high_cut, fs);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayF32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_1(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {Float32Array} data
 * @param {number} order
 * @param {number} low_cut
 * @param {number} high_cut
 * @param {number} fs
 * @returns {Float32Array}
 */
module.exports.apply_bandstop_filter = function(data, order, low_cut, high_cut, fs) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF32ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.apply_bandstop_filter(retptr, ptr0, len0, order, low_cut, high_cut, fs);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayF32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_1(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {Function} callback
 */
module.exports.set_resp_callback = function(callback) {
    wasm.set_resp_callback(addHeapObject(callback));
};

/**
 * @param {number} eeg_buffer_len
 */
module.exports.set_eeg_buffer_cfg = function(eeg_buffer_len) {
    wasm.set_eeg_buffer_cfg(eeg_buffer_len);
};

/**
 * @param {number} imu_buffer_len
 */
module.exports.set_imu_buffer_cfg = function(imu_buffer_len) {
    wasm.set_imu_buffer_cfg(imu_buffer_len);
};

module.exports.clear_eeg_buffer = function() {
    wasm.clear_eeg_buffer();
};

module.exports.clear_imu_buffer = function() {
    wasm.clear_imu_buffer();
};

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
 * @param {Function} cb
 */
module.exports.set_web_callback = function(cb) {
    try {
        wasm.set_web_callback(addBorrowedObject(cb));
    } finally {
        heap[stack_pointer++] = undefined;
    }
};

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function passArray16ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 2, 2) >>> 0;
    getUint16ArrayMemory0().set(arg, ptr / 2);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedInt8ArrayMemory0 = null;

function getInt8ArrayMemory0() {
    if (cachedInt8ArrayMemory0 === null || cachedInt8ArrayMemory0.byteLength === 0) {
        cachedInt8ArrayMemory0 = new Int8Array(wasm.memory.buffer);
    }
    return cachedInt8ArrayMemory0;
}

function getArrayI8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

let cachedInt16ArrayMemory0 = null;

function getInt16ArrayMemory0() {
    if (cachedInt16ArrayMemory0 === null || cachedInt16ArrayMemory0.byteLength === 0) {
        cachedInt16ArrayMemory0 = new Int16Array(wasm.memory.buffer);
    }
    return cachedInt16ArrayMemory0;
}

function getArrayI16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}
/**
 * @param {Uint8Array} data
 * @param {number} gain
 * @returns {Float32Array}
 */
module.exports.parse_eeg_data = function(data, gain) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.parse_eeg_data(retptr, ptr0, len0, gain);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayF32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_1(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

function __wbg_adapter_40(arg0, arg1) {
    wasm.__wbindgen_export_5(arg0, arg1);
}

function __wbg_adapter_43(arg0, arg1, arg2) {
    wasm.__wbindgen_export_6(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_305(arg0, arg1, arg2, arg3) {
    wasm.__wbindgen_export_7(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
 * @enum {1 | 2 | 3 | 4 | 5 | 6}
 */
module.exports.ActionCmd = Object.freeze({
    SetStart: 1, "1": "SetStart",
    SetFinish: 2, "2": "SetFinish",
    ReadStart: 3, "3": "ReadStart",
    ReadFinish: 4, "4": "ReadFinish",
    Save: 5, "5": "Save",
    Run: 6, "6": "Run",
});
/**
 * @enum {1 | 2 | 3 | 4 | 5 | 6 | 10 | 11 | 12 | 13 | 14 | 15}
 */
module.exports.ActionSequenceId = Object.freeze({
    DefaultGestureOpen: 1, "1": "DefaultGestureOpen",
    DefaultGestureFist: 2, "2": "DefaultGestureFist",
    DefaultGesturePinchTwo: 3, "3": "DefaultGesturePinchTwo",
    DefaultGesturePinchThree: 4, "4": "DefaultGesturePinchThree",
    DefaultGesturePinchSide: 5, "5": "DefaultGesturePinchSide",
    DefaultGesturePoint: 6, "6": "DefaultGesturePoint",
    CustomGesture1: 10, "10": "CustomGesture1",
    CustomGesture2: 11, "11": "CustomGesture2",
    CustomGesture3: 12, "12": "CustomGesture3",
    CustomGesture4: 13, "13": "CustomGesture4",
    CustomGesture5: 14, "14": "CustomGesture5",
    CustomGesture6: 15, "15": "CustomGesture6",
});
/**
 * @enum {0 | 1 | 2 | 3}
 */
module.exports.ActionStatus = Object.freeze({
    Idle: 0, "0": "Idle",
    Running: 1, "1": "Running",
    Completed: 2, "2": "Completed",
    Error: 3, "3": "Error",
});
/**
 * @enum {0 | 1}
 */
module.exports.AggOperations = Object.freeze({
    Mean: 0, "0": "Mean",
    Median: 1, "1": "Median",
});
/**
 * @enum {0 | 1 | 2 | 3}
 */
module.exports.Baudrate = Object.freeze({
    Baud115200: 0, "0": "Baud115200",
    Baud57600: 1, "1": "Baud57600",
    Baud19200: 2, "2": "Baud19200",
    Baud460800: 3, "3": "Baud460800",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
module.exports.DfuState = Object.freeze({
    Idle: 0, "0": "Idle",
    Starting: 1, "1": "Starting",
    Started: 2, "2": "Started",
    Transfer: 3, "3": "Transfer",
    Completed: 4, "4": "Completed",
    Aborted: 5, "5": "Aborted",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */
module.exports.DownsamplingOperations = Object.freeze({
    Mean: 0, "0": "Mean",
    Median: 1, "1": "Median",
    Max: 2, "2": "Max",
    Min: 3, "3": "Min",
    Sum: 4, "4": "Sum",
    First: 5, "5": "First",
    Last: 6, "6": "Last",
    Extremes: 7, "7": "Extremes",
});
/**
 * @enum {0 | 1 | 2}
 */
module.exports.EEGCapModuleId = Object.freeze({
    MCU: 0, "0": "MCU",
    BLE: 1, "1": "BLE",
    APP: 2, "2": "APP",
});
/**
 * @enum {1 | 2 | 3}
 */
module.exports.EduModuleId = Object.freeze({
    APP: 1, "1": "APP",
    DONGLE: 2, "2": "DONGLE",
    DEVICE: 3, "3": "DEVICE",
});
/**
 * @enum {0 | 111 | 95 | 79 | 63 | 47 | 31 | 15}
 */
module.exports.EegSampleRate = Object.freeze({
    SR_None: 0, "0": "SR_None",
    SR_250Hz: 111, "111": "SR_250Hz",
    SR_500Hz: 95, "95": "SR_500Hz",
    SR_1000Hz: 79, "79": "SR_1000Hz",
    SR_2000Hz: 63, "63": "SR_2000Hz",
    SR_4000Hz: 47, "47": "SR_4000Hz",
    SR_8000Hz: 31, "31": "SR_8000Hz",
    SR_16000Hz: 15, "15": "SR_16000Hz",
});
/**
 * @enum {0 | 15 | 31 | 47 | 63 | 79 | 95 | 111}
 */
module.exports.EegSignalGain = Object.freeze({
    GAIN_NONE: 0, "0": "GAIN_NONE",
    GAIN_1: 15, "15": "GAIN_1",
    GAIN_2: 31, "31": "GAIN_2",
    GAIN_4: 47, "47": "GAIN_4",
    GAIN_6: 63, "63": "GAIN_6",
    GAIN_8: 79, "79": "GAIN_8",
    GAIN_12: 95, "95": "GAIN_12",
    GAIN_24: 111, "111": "GAIN_24",
});
/**
 * @enum {0 | 15 | 31 | 63 | 95}
 */
module.exports.EegSignalSource = Object.freeze({
    SIGNAL_NONE: 0, "0": "SIGNAL_NONE",
    NORMAL: 15, "15": "NORMAL",
    SHORTED: 31, "31": "SHORTED",
    MVDD: 63, "63": "MVDD",
    TEST_SIGNAL: 95, "95": "TEST_SIGNAL",
});
/**
 * @enum {1 | 2 | 3 | 4 | 5 | 6}
 */
module.exports.FingerId = Object.freeze({
    Thumb: 1, "1": "Thumb",
    ThumbAux: 2, "2": "ThumbAux",
    Index: 3, "3": "Index",
    Middle: 4, "4": "Middle",
    Ring: 5, "5": "Ring",
    Pinky: 6, "6": "Pinky",
});
/**
 * @enum {1 | 2 | 3}
 */
module.exports.ForceLevel = Object.freeze({
    Small: 1, "1": "Small",
    Normal: 2, "2": "Normal",
    Full: 3, "3": "Full",
});
/**
 * @enum {0 | 1 | 2}
 */
module.exports.ImuSampleRate = Object.freeze({
    SR_NONE: 0, "0": "SR_NONE",
    SR_50Hz: 1, "1": "SR_50Hz",
    SR_100Hz: 2, "2": "SR_100Hz",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */
module.exports.LedColor = Object.freeze({
    Unchanged: 0, "0": "Unchanged",
    R: 1, "1": "R",
    G: 2, "2": "G",
    RG: 3, "3": "RG",
    B: 4, "4": "B",
    RB: 5, "5": "RB",
    GB: 6, "6": "GB",
    RGB: 7, "7": "RGB",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6}
 */
module.exports.LedMode = Object.freeze({
    None: 0, "0": "None",
    Shutdown: 1, "1": "Shutdown",
    Keep: 2, "2": "Keep",
    Blink: 3, "3": "Blink",
    OneShot: 4, "4": "OneShot",
    Blink0_5Hz: 5, "5": "Blink0_5Hz",
    Blink2Hz: 6, "6": "Blink2Hz",
});
/**
 * @enum {0 | 1 | 2}
 */
module.exports.MotorState = Object.freeze({
    Idle: 0, "0": "Idle",
    Running: 1, "1": "Running",
    Stall: 2, "2": "Stall",
});
/**
 * @enum {0 | 1 | 3 | 4 | 5 | 6 | 2 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 15 | 16}
 */
module.exports.MsgType = Object.freeze({
    Crimson: 0, "0": "Crimson",
    OxyZen: 1, "1": "OxyZen",
    Mobius: 3, "3": "Mobius",
    MobiusV1_5: 4, "4": "MobiusV1_5",
    Almond: 5, "5": "Almond",
    AlmondV2: 6, "6": "AlmondV2",
    Morpheus: 2, "2": "Morpheus",
    Luna: 7, "7": "Luna",
    REN: 8, "8": "REN",
    Breeze: 9, "9": "Breeze",
    Stark: 10, "10": "Stark",
    EEGCap: 11, "11": "EEGCap",
    Edu: 12, "12": "Edu",
    Clear: 13, "13": "Clear",
    Melody: 15, "15": "Melody",
    Aura: 16, "16": "Aura",
});
/**
 * @enum {0 | 1 | 2}
 */
module.exports.NoiseTypes = Object.freeze({
    FIFTY: 0, "0": "FIFTY",
    SIXTY: 1, "1": "SIXTY",
    FIFTY_AND_SIXTY: 2, "2": "FIFTY_AND_SIXTY",
});
/**
 * @enum {0 | 1 | 2}
 */
module.exports.PressState = Object.freeze({
    None: 0, "0": "None",
    Down: 1, "1": "Down",
    Up: 2, "2": "Up",
});
/**
 * @enum {900 | 901 | 910 | 920 | 936 | 942 | 948 | 954 | 960 | 966 | 972 | 1000 | 1001 | 1002 | 1009 | 1010 | 1016 | 1022 | 1023 | 1030 | 1031 | 1032 | 1033 | 1034 | 1098 | 1099 | 1100 | 2000 | 2006 | 2012 | 2018 | 2024 | 2025 | 3000 | 3010 | 4000 | 4001 | 4002 | 4003 | 4004 | 4005 | 4006 | 4008 | 4009 | 4010 | 4011 | 4012 | 4013 | 4014 | 4015 | 4016 | 4017 | 4018 | 4020 | 4022 | 4024 | 4025 | 4026 | 4027 | 4028 | 4029 | 4030 | 4031 | 4032 | 4033 | 4034 | 4036 | 4038 | 4040 | 4041 | 4042 | 4043 | 4044 | 4045 | 4046 | 4047 | 4048 | 4049 | 4050 | 4052 | 4054 | 4056 | 4057 | 4058 | 4059 | 4060 | 4061 | 4062 | 4063 | 4065 | 4067 | 4100 | 4101 | 4102 | 4103 | 4104 | 4105 | 4106 | 4107 | 4108 | 4109 | 4200}
 */
module.exports.RegisterAddress = Object.freeze({
    SetOta: 900, "900": "SetOta",
    SkuType: 901, "901": "SkuType",
    SetFactoryKey: 910, "910": "SetFactoryKey",
    SetSn: 920, "920": "SetSn",
    StallDuration: 936, "936": "StallDuration",
    PwmSmall: 942, "942": "PwmSmall",
    PwmNormal: 948, "948": "PwmNormal",
    PwmFull: 954, "954": "PwmFull",
    StallCurrentSmall: 960, "960": "StallCurrentSmall",
    StallCurrentNormal: 966, "966": "StallCurrentNormal",
    StallCurrentFull: 972, "972": "StallCurrentFull",
    DeviceId: 1000, "1000": "DeviceId",
    Baudrate: 1001, "1001": "Baudrate",
    Force: 1002, "1002": "Force",
    SetReboot: 1009, "1009": "SetReboot",
    Position: 1010, "1010": "Position",
    Speed: 1016, "1016": "Speed",
    Led: 1022, "1022": "Led",
    Current: 1023, "1023": "Current",
    Turbo: 1030, "1030": "Turbo",
    TurboInterval: 1031, "1031": "TurboInterval",
    TurboDuration: 1032, "1032": "TurboDuration",
    AutoCalibration: 1033, "1033": "AutoCalibration",
    ManualCalibration: 1034, "1034": "ManualCalibration",
    ActionCmd: 1098, "1098": "ActionCmd",
    ActionNum: 1099, "1099": "ActionNum",
    ActionData: 1100, "1100": "ActionData",
    GetNowPosition: 2000, "2000": "GetNowPosition",
    GetNowSpeed: 2006, "2006": "GetNowSpeed",
    GetNowCurrent: 2012, "2012": "GetNowCurrent",
    GetMotorState: 2018, "2018": "GetMotorState",
    GetVoltage: 2024, "2024": "GetVoltage",
    GetButtonStatus: 2025, "2025": "GetButtonStatus",
    GetFwVersion: 3000, "3000": "GetFwVersion",
    GetSn: 3010, "3010": "GetSn",
    GetThumbNormalForce1: 4000, "4000": "GetThumbNormalForce1",
    GetThumbTangentialForce1: 4001, "4001": "GetThumbTangentialForce1",
    GetThumbTangentialDirection1: 4002, "4002": "GetThumbTangentialDirection1",
    GetThumbNormalForce2: 4003, "4003": "GetThumbNormalForce2",
    GetThumbTangentialForce2: 4004, "4004": "GetThumbTangentialForce2",
    GetThumbTangentialDirection2: 4005, "4005": "GetThumbTangentialDirection2",
    GetThumbSelfClose1: 4006, "4006": "GetThumbSelfClose1",
    GetThumbStatus: 4008, "4008": "GetThumbStatus",
    GetIndexNormalForce1: 4009, "4009": "GetIndexNormalForce1",
    GetIndexTangentialForce1: 4010, "4010": "GetIndexTangentialForce1",
    GetIndexTangentialDirection1: 4011, "4011": "GetIndexTangentialDirection1",
    GetIndexNormalForce2: 4012, "4012": "GetIndexNormalForce2",
    GetIndexTangentialForce2: 4013, "4013": "GetIndexTangentialForce2",
    GetIndexTangentialDirection2: 4014, "4014": "GetIndexTangentialDirection2",
    GetIndexNormalForce3: 4015, "4015": "GetIndexNormalForce3",
    GetIndexTangentialForce3: 4016, "4016": "GetIndexTangentialForce3",
    GetIndexTangentialDirection3: 4017, "4017": "GetIndexTangentialDirection3",
    GetIndexSelfClose1: 4018, "4018": "GetIndexSelfClose1",
    GetIndexSelfClose2: 4020, "4020": "GetIndexSelfClose2",
    GetIndexMutualClose: 4022, "4022": "GetIndexMutualClose",
    GetIndexStatus: 4024, "4024": "GetIndexStatus",
    GetMiddleNormalForce1: 4025, "4025": "GetMiddleNormalForce1",
    GetMiddleTangentialForce1: 4026, "4026": "GetMiddleTangentialForce1",
    GetMiddleTangentialDirection1: 4027, "4027": "GetMiddleTangentialDirection1",
    GetMiddleNormalForce2: 4028, "4028": "GetMiddleNormalForce2",
    GetMiddleTangentialForce2: 4029, "4029": "GetMiddleTangentialForce2",
    GetMiddleTangentialDirection2: 4030, "4030": "GetMiddleTangentialDirection2",
    GetMiddleNormalForce3: 4031, "4031": "GetMiddleNormalForce3",
    GetMiddleTangentialForce3: 4032, "4032": "GetMiddleTangentialForce3",
    GetMiddleTangentialDirection3: 4033, "4033": "GetMiddleTangentialDirection3",
    GetMiddleSelfClose1: 4034, "4034": "GetMiddleSelfClose1",
    GetMiddleSelfClose2: 4036, "4036": "GetMiddleSelfClose2",
    GetMiddleMutualClose: 4038, "4038": "GetMiddleMutualClose",
    GetMiddleStatus: 4040, "4040": "GetMiddleStatus",
    GetRingNormalForce1: 4041, "4041": "GetRingNormalForce1",
    GetRingTangentialForce1: 4042, "4042": "GetRingTangentialForce1",
    GetRingTangentialDirection1: 4043, "4043": "GetRingTangentialDirection1",
    GetRingNormalForce2: 4044, "4044": "GetRingNormalForce2",
    GetRingTangentialForce2: 4045, "4045": "GetRingTangentialForce2",
    GetRingTangentialDirection2: 4046, "4046": "GetRingTangentialDirection2",
    GetRingNormalForce3: 4047, "4047": "GetRingNormalForce3",
    GetRingTangentialForce3: 4048, "4048": "GetRingTangentialForce3",
    GetRingTangentialDirection3: 4049, "4049": "GetRingTangentialDirection3",
    GetRingSelfClose1: 4050, "4050": "GetRingSelfClose1",
    GetRingSelfClose2: 4052, "4052": "GetRingSelfClose2",
    GetRingMutualClose: 4054, "4054": "GetRingMutualClose",
    GetRingStatus: 4056, "4056": "GetRingStatus",
    GetPinkyNormalForce1: 4057, "4057": "GetPinkyNormalForce1",
    GetPinkyTangentialForce1: 4058, "4058": "GetPinkyTangentialForce1",
    GetPinkyTangentialDirection1: 4059, "4059": "GetPinkyTangentialDirection1",
    GetPinkyNormalForce2: 4060, "4060": "GetPinkyNormalForce2",
    GetPinkyTangentialForce2: 4061, "4061": "GetPinkyTangentialForce2",
    GetPinkyTangentialDirection2: 4062, "4062": "GetPinkyTangentialDirection2",
    GetPinkySelfClose1: 4063, "4063": "GetPinkySelfClose1",
    GetPinkyMutualClose1: 4065, "4065": "GetPinkyMutualClose1",
    GetPinkyStatus: 4067, "4067": "GetPinkyStatus",
    SetThumbReset: 4100, "4100": "SetThumbReset",
    SetIndexReset: 4101, "4101": "SetIndexReset",
    SetMiddleReset: 4102, "4102": "SetMiddleReset",
    SetRingReset: 4103, "4103": "SetRingReset",
    SetPinkyReset: 4104, "4104": "SetPinkyReset",
    SetThumbCalibration: 4105, "4105": "SetThumbCalibration",
    SetIndexCalibration: 4106, "4106": "SetIndexCalibration",
    SetMiddleCalibration: 4107, "4107": "SetMiddleCalibration",
    SetRingCalibration: 4108, "4108": "SetRingCalibration",
    SetPinkyCalibration: 4109, "4109": "SetPinkyCalibration",
    GetTouchFwVersion: 4200, "4200": "GetTouchFwVersion",
});
/**
 * @enum {1 | 2 | 3 | 4}
 */
module.exports.SkuType = Object.freeze({
    MediumRight: 1, "1": "MediumRight",
    MediumLeft: 2, "2": "MediumLeft",
    SmallRight: 3, "3": "SmallRight",
    SmallLeft: 4, "4": "SmallLeft",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 11}
 */
module.exports.StarkError = Object.freeze({
    None: 0, "0": "None",
    Unknown: 1, "1": "Unknown",
    InvalidParams: 2, "2": "InvalidParams",
    InvalidData: 3, "3": "InvalidData",
    ParseFailed: 4, "4": "ParseFailed",
    AllocFailed: 5, "5": "AllocFailed",
    ReadFailed: 6, "6": "ReadFailed",
    OperationFailed: 7, "7": "OperationFailed",
    SystemIsBusy: 11, "11": "SystemIsBusy",
});
/**
 * @enum {1 | 2 | 3 | 4}
 */
module.exports.StarkModuleId = Object.freeze({
    MCU: 1, "1": "MCU",
    MTR: 2, "2": "MTR",
    APP: 3, "3": "APP",
    SERIAL: 4, "4": "SERIAL",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
 */
module.exports.WiFiSecurity = Object.freeze({
    SECURITY_NONE: 0, "0": "SECURITY_NONE",
    SECURITY_OPEN: 1, "1": "SECURITY_OPEN",
    SECURITY_WPA2_AES_PSK: 2, "2": "SECURITY_WPA2_AES_PSK",
    SECURITY_WPA2_TKIP_PSK: 3, "3": "SECURITY_WPA2_TKIP_PSK",
    SECURITY_WPA2_MIXED_PSK: 4, "4": "SECURITY_WPA2_MIXED_PSK",
    SECURITY_WPA_WPA2_TKIP_PSK: 5, "5": "SECURITY_WPA_WPA2_TKIP_PSK",
    SECURITY_WPA_WPA2_AES_PSK: 6, "6": "SECURITY_WPA_WPA2_AES_PSK",
    SECURITY_WPA_WPA2_MIXED_PSK: 7, "7": "SECURITY_WPA_WPA2_MIXED_PSK",
    SECURITY_WPA3_AES_PSK: 8, "8": "SECURITY_WPA3_AES_PSK",
    SECURITY_WPA2_WPA3_MIXED: 9, "9": "SECURITY_WPA2_WPA3_MIXED",
});

const ActionSequenceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_actionsequence_free(ptr >>> 0, 1));

class ActionSequence {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ActionSequence.prototype);
        obj.__wbg_ptr = ptr;
        ActionSequenceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ActionSequenceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_actionsequence_free(ptr, 0);
    }
    /**
     * @returns {ActionSequenceId}
     */
    get action_id() {
        const ret = wasm.__wbg_get_actionsequence_action_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {ActionSequenceId} arg0
     */
    set action_id(arg0) {
        wasm.__wbg_set_actionsequence_action_id(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {(ActionSequenceItem)[]}
     */
    get data() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_actionsequence_data(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_1(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {(ActionSequenceItem)[]} arg0
     */
    set data(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionsequence_data(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {ActionSequenceId} action_id
     * @param {(ActionSequenceItem)[]} data
     */
    constructor(action_id, data) {
        const ptr0 = passArrayJsValueToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.actionsequence_new(action_id, ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        ActionSequenceFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.actionsequence_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.ActionSequence = ActionSequence;

const ActionSequenceItemFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_actionsequenceitem_free(ptr >>> 0, 1));

class ActionSequenceItem {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ActionSequenceItem.prototype);
        obj.__wbg_ptr = ptr;
        ActionSequenceItemFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof ActionSequenceItem)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ActionSequenceItemFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_actionsequenceitem_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get index() {
        const ret = wasm.__wbg_get_actionsequenceitem_index(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set index(arg0) {
        wasm.__wbg_set_actionsequenceitem_index(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get duration() {
        const ret = wasm.__wbg_get_actionsequenceitem_duration(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set duration(arg0) {
        wasm.__wbg_set_actionsequenceitem_duration(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Uint16Array}
     */
    get positions() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_actionsequenceitem_positions(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU16FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_1(r0, r1 * 2, 2);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint16Array} arg0
     */
    set positions(arg0) {
        const ptr0 = passArray16ToWasm0(arg0, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionsequenceitem_positions(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Int16Array}
     */
    get speeds() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_actionsequenceitem_speeds(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayI16FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_1(r0, r1 * 2, 2);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Int16Array} arg0
     */
    set speeds(arg0) {
        const ptr0 = passArray16ToWasm0(arg0, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionsequenceitem_speeds(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Int16Array}
     */
    get strengths() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_actionsequenceitem_strengths(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayI16FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_1(r0, r1 * 2, 2);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Int16Array} arg0
     */
    set strengths(arg0) {
        const ptr0 = passArray16ToWasm0(arg0, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_actionsequenceitem_strengths(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} index
     * @param {number} duration
     * @param {Uint16Array} positions
     * @param {Int16Array} speeds
     * @param {Int16Array} strengths
     */
    constructor(index, duration, positions, speeds, strengths) {
        const ptr0 = passArray16ToWasm0(positions, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray16ToWasm0(speeds, wasm.__wbindgen_export_3);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray16ToWasm0(strengths, wasm.__wbindgen_export_3);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.actionsequenceitem_new(index, duration, ptr0, len0, ptr1, len1, ptr2, len2);
        this.__wbg_ptr = ret >>> 0;
        ActionSequenceItemFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.actionsequenceitem_desc(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    desc() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.actionsequenceitem_desc(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.ActionSequenceItem = ActionSequenceItem;

const ButtonPressEventFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_buttonpressevent_free(ptr >>> 0, 1));

class ButtonPressEvent {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ButtonPressEvent.prototype);
        obj.__wbg_ptr = ptr;
        ButtonPressEventFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ButtonPressEventFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_buttonpressevent_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get timestamp() {
        const ret = wasm.__wbg_get_buttonpressevent_timestamp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set timestamp(arg0) {
        wasm.__wbg_set_buttonpressevent_timestamp(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get button_id() {
        const ret = wasm.__wbg_get_buttonpressevent_button_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set button_id(arg0) {
        wasm.__wbg_set_buttonpressevent_button_id(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {PressState}
     */
    get press_state() {
        const ret = wasm.__wbg_get_buttonpressevent_press_state(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {PressState} arg0
     */
    set press_state(arg0) {
        wasm.__wbg_set_buttonpressevent_press_state(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} timestamp
     * @param {number} button_id
     * @param {PressState} press_state
     */
    constructor(timestamp, button_id, press_state) {
        const ret = wasm.buttonpressevent_new(timestamp, button_id, press_state);
        this.__wbg_ptr = ret >>> 0;
        ButtonPressEventFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.buttonpressevent_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.ButtonPressEvent = ButtonPressEvent;

const DeviceInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_deviceinfo_free(ptr >>> 0, 1));

class DeviceInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DeviceInfo.prototype);
        obj.__wbg_ptr = ptr;
        DeviceInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DeviceInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_deviceinfo_free(ptr, 0);
    }
    /**
     * Hand SKU
     * @returns {SkuType}
     */
    get sku_type() {
        const ret = wasm.__wbg_get_deviceinfo_sku_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * Hand SKU
     * @param {SkuType} arg0
     */
    set sku_type(arg0) {
        wasm.__wbg_set_deviceinfo_sku_type(this.__wbg_ptr, arg0);
    }
    /**
     * Serial number
     * @returns {string}
     */
    get serial_number() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_deviceinfo_serial_number(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Serial number
     * @param {string} arg0
     */
    set serial_number(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_deviceinfo_serial_number(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Firmware version
     * @returns {string}
     */
    get firmware_version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_deviceinfo_firmware_version(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Firmware version
     * @param {string} arg0
     */
    set firmware_version(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_deviceinfo_firmware_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {SkuType} sku_type
     * @param {string} serial_number
     * @param {string} firmware_version
     */
    constructor(sku_type, serial_number, firmware_version) {
        const ptr0 = passStringToWasm0(serial_number, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(firmware_version, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.deviceinfo_new(sku_type, ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        DeviceInfoFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    desc() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.deviceinfo_desc(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.deviceinfo_desc(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.DeviceInfo = DeviceInfo;

const LedInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ledinfo_free(ptr >>> 0, 1));

class LedInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LedInfo.prototype);
        obj.__wbg_ptr = ptr;
        LedInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LedInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ledinfo_free(ptr, 0);
    }
    /**
     * @returns {LedColor}
     */
    get color() {
        const ret = wasm.__wbg_get_ledinfo_color(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LedColor} arg0
     */
    set color(arg0) {
        wasm.__wbg_set_ledinfo_color(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {LedMode}
     */
    get mode() {
        const ret = wasm.__wbg_get_ledinfo_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LedMode} arg0
     */
    set mode(arg0) {
        wasm.__wbg_set_ledinfo_mode(this.__wbg_ptr, arg0);
    }
    /**
     * @param {LedColor} color
     * @param {LedMode} mode
     */
    constructor(color, mode) {
        const ret = wasm.ledinfo_new(color, mode);
        this.__wbg_ptr = ret >>> 0;
        LedInfoFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.ledinfo_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.LedInfo = LedInfo;

const MessageParserFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_messageparser_free(ptr >>> 0, 1));

class MessageParser {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MessageParserFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_messageparser_free(ptr, 0);
    }
    /**
     * @param {string} device_id
     * @param {MsgType} msg_type
     */
    constructor(device_id, msg_type) {
        const ptr0 = passStringToWasm0(device_id, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.messageparser_new(ptr0, len0, msg_type);
        this.__wbg_ptr = ret >>> 0;
        MessageParserFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Uint8Array} data
     */
    receive_data(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.messageparser_receive_data(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Promise<any>}
     */
    next_message() {
        const ret = wasm.messageparser_next_message(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Promise<any>}
     */
    start_message_stream() {
        const ret = wasm.messageparser_start_message_stream(this.__wbg_ptr);
        return takeObject(ret);
    }
}
module.exports.MessageParser = MessageParser;

const MotorStatusDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_motorstatusdata_free(ptr >>> 0, 1));

class MotorStatusData {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MotorStatusDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_motorstatusdata_free(ptr, 0);
    }
    /**
     * Motor positions, [u8; 6]
     * @returns {Uint8Array}
     */
    get positions() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_motorstatusdata_positions(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_1(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Motor positions, [u8; 6]
     * @param {Uint8Array} arg0
     */
    set positions(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_deviceinfo_serial_number(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Motor speed
     * @returns {Int8Array}
     */
    get speeds() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_motorstatusdata_speeds(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayI8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_1(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Motor speed
     * @param {Int8Array} arg0
     */
    set speeds(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_deviceinfo_firmware_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Motor PWM
     * Motor state
     * @returns {any[]}
     */
    get states() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_motorstatusdata_states(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_1(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Motor PWM
     * Motor state
     * @param {any[]} arg0
     */
    set states(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_motorstatusdata_states(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {Uint8Array} positions
     * @param {Int8Array} speeds
     * @param {Int8Array} currents
     * @param {Uint8Array} states
     */
    constructor(positions, speeds, currents, states) {
        const ptr0 = passArray8ToWasm0(positions, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(speeds, wasm.__wbindgen_export_3);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(currents, wasm.__wbindgen_export_3);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArray8ToWasm0(states, wasm.__wbindgen_export_3);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.motorstatusdata_new(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        this.__wbg_ptr = ret >>> 0;
        MotorStatusDataFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {boolean}
     */
    is_idle() {
        const ret = wasm.motorstatusdata_is_idle(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_opened() {
        const ret = wasm.motorstatusdata_is_opened(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_closed() {
        const ret = wasm.motorstatusdata_is_closed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    desc() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.motorstatusdata_desc(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.motorstatusdata_desc(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.MotorStatusData = MotorStatusData;

const SerialPortCfgFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_serialportcfg_free(ptr >>> 0, 1));

class SerialPortCfg {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SerialPortCfg.prototype);
        obj.__wbg_ptr = ptr;
        SerialPortCfgFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SerialPortCfgFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_serialportcfg_free(ptr, 0);
    }
    /**
     * Slave ID for the protocol
     * - For Protobuf protocol: range 10~254, default is 10, 254 is the broadcast address
     * - For Modbus protocol: range 0~254, default is 1, 0 is the broadcast address (broadcast is only for control commands)
     * @returns {number}
     */
    get slave_id() {
        const ret = wasm.__wbg_get_serialportcfg_slave_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * Slave ID for the protocol
     * - For Protobuf protocol: range 10~254, default is 10, 254 is the broadcast address
     * - For Modbus protocol: range 0~254, default is 1, 0 is the broadcast address (broadcast is only for control commands)
     * @param {number} arg0
     */
    set slave_id(arg0) {
        wasm.__wbg_set_serialportcfg_slave_id(this.__wbg_ptr, arg0);
    }
    /**
     * Baud rate for the serial communication
     * @returns {Baudrate}
     */
    get baudrate() {
        const ret = wasm.__wbg_get_serialportcfg_baudrate(this.__wbg_ptr);
        return ret;
    }
    /**
     * Baud rate for the serial communication
     * @param {Baudrate} arg0
     */
    set baudrate(arg0) {
        wasm.__wbg_set_serialportcfg_baudrate(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} slave_id
     * @param {Baudrate} baudrate
     */
    constructor(slave_id, baudrate) {
        const ret = wasm.serialportcfg_new(slave_id, baudrate);
        this.__wbg_ptr = ret >>> 0;
        SerialPortCfgFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.serialportcfg_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.SerialPortCfg = SerialPortCfg;

const StarkOTAFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_starkota_free(ptr >>> 0, 1));

class StarkOTA {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StarkOTAFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_starkota_free(ptr, 0);
    }
    /**
     * @returns {DfuState}
     */
    get dfu_state() {
        const ret = wasm.__wbg_get_starkota_dfu_state(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {DfuState} arg0
     */
    set dfu_state(arg0) {
        wasm.__wbg_set_starkota_dfu_state(this.__wbg_ptr, arg0);
    }
    constructor() {
        const ret = wasm.starkota_new();
        this.__wbg_ptr = ret >>> 0;
        StarkOTAFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {DfuState}
     */
    get_dfu_state() {
        const ret = wasm.starkota_get_dfu_state(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    is_dfu_available() {
        const ret = wasm.starkota_is_dfu_available(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {string} path
     */
    set_dfu_file_path(path) {
        const ptr0 = passStringToWasm0(path, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        const len0 = WASM_VECTOR_LEN;
        wasm.starkota_set_dfu_file_path(this.__wbg_ptr, ptr0, len0);
    }
    start_dfu_mode_check() {
        wasm.starkota_start_dfu_mode_check(this.__wbg_ptr);
    }
    stop_check_dfu_mode() {
        wasm.starkota_stop_check_dfu_mode(this.__wbg_ptr);
    }
    /**
     * @param {Function} cb
     */
    set_dfu_state_callback(cb) {
        wasm.starkota_set_dfu_state_callback(this.__wbg_ptr, addHeapObject(cb));
    }
    /**
     * @param {Function} cb
     */
    set_dfu_progress_callback(cb) {
        wasm.starkota_set_dfu_progress_callback(this.__wbg_ptr, addHeapObject(cb));
    }
    /**
     * @param {DfuState} state
     * @returns {Promise<void>}
     */
    trigger_dfu_state(state) {
        const ret = wasm.starkota_trigger_dfu_state(this.__wbg_ptr, state);
        return takeObject(ret);
    }
    /**
     * @param {number} progress
     * @returns {Promise<void>}
     */
    trigger_dfu_progress(progress) {
        const ret = wasm.starkota_trigger_dfu_progress(this.__wbg_ptr, progress);
        return takeObject(ret);
    }
}
module.exports.StarkOTA = StarkOTA;

const StarkSDKFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_starksdk_free(ptr >>> 0, 1));

class StarkSDK {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StarkSDKFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_starksdk_free(ptr, 0);
    }
    /**
     * @param {boolean | undefined} [is_modbus]
     * @param {string | undefined} [level]
     */
    static init(is_modbus, level) {
        var ptr0 = isLikeNone(level) ? 0 : passStringToWasm0(level, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        var len0 = WASM_VECTOR_LEN;
        wasm.starksdk_init(isLikeNone(is_modbus) ? 0xFFFFFF : is_modbus ? 1 : 0, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    static get_sdk_version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.starksdk_get_sdk_version(retptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * 接收数据
     *
     * # 参数
     * - `slave_id`: 设备的从属 ID
     * - `data`: 接收到的数据
     * @param {number} slave_id
     * @param {Uint8Array} data
     */
    static did_receive_data(slave_id, data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        wasm.starksdk_did_receive_data(slave_id, ptr0, len0);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_device_info(slave_id) {
        const ret = wasm.starksdk_get_device_info(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_device_sn(slave_id) {
        const ret = wasm.starksdk_get_device_sn(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_device_fw_version(slave_id) {
        const ret = wasm.starksdk_get_device_fw_version(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_sku_type(slave_id) {
        const ret = wasm.starksdk_get_sku_type(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_serial_port_cfg(slave_id) {
        const ret = wasm.starksdk_get_serial_port_cfg(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_serial_baudrate(slave_id) {
        const ret = wasm.starksdk_get_serial_baudrate(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_force_level(slave_id) {
        const ret = wasm.starksdk_get_force_level(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_voltage(slave_id) {
        const ret = wasm.starksdk_get_voltage(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_auto_calibration_enabled(slave_id) {
        const ret = wasm.starksdk_get_auto_calibration_enabled(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_turbo_mode_enabled(slave_id) {
        const ret = wasm.starksdk_get_turbo_mode_enabled(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_turbo_config(slave_id) {
        const ret = wasm.starksdk_get_turbo_config(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_led_info(slave_id) {
        const ret = wasm.starksdk_get_led_info(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_button_event(slave_id) {
        const ret = wasm.starksdk_get_button_event(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_motor_state(slave_id) {
        const ret = wasm.starksdk_get_motor_state(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_finger_positions(slave_id) {
        const ret = wasm.starksdk_get_finger_positions(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_finger_speeds(slave_id) {
        const ret = wasm.starksdk_get_finger_speeds(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static get_finger_currents(slave_id) {
        const ret = wasm.starksdk_get_finger_currents(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ActionSequenceId} action_id
     * @returns {Promise<Promise<any>>}
     */
    static get_action_sequence(slave_id, action_id) {
        const ret = wasm.starksdk_get_action_sequence(slave_id, action_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ActionSequenceId} action_id
     * @param {ActionCmd} cmd
     * @returns {Promise<any>}
     */
    static set_action_cmd(slave_id, action_id, cmd) {
        const ret = wasm.starksdk_set_action_cmd(slave_id, action_id, cmd);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ActionSequenceId} action_id
     * @returns {Promise<Promise<any>>}
     */
    static save_action_sequence(slave_id, action_id) {
        const ret = wasm.starksdk_save_action_sequence(slave_id, action_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ActionSequenceId} action_id
     * @returns {Promise<Promise<any>>}
     */
    static run_action_sequence(slave_id, action_id) {
        const ret = wasm.starksdk_run_action_sequence(slave_id, action_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ActionSequenceId} action_id
     * @param {Array<any>} sequences
     * @returns {Promise<Promise<any>>}
     */
    static transfer_action_sequence(slave_id, action_id, sequences) {
        const ret = wasm.starksdk_transfer_action_sequence(slave_id, action_id, addHeapObject(sequences));
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<void>}
     */
    static reboot(slave_id) {
        const ret = wasm.starksdk_reboot(slave_id);
        return takeObject(ret);
    }
    /**
     * 设置串口波特率
     * 注意：更新串口配置后设备将重启
     *
     * # 参数
     * - `baudrate`: 波特率值
     * @param {number} slave_id
     * @param {Baudrate} baudrate
     * @returns {Promise<Promise<any>>}
     */
    static set_serialport_baudrate(slave_id, baudrate) {
        const ret = wasm.starksdk_set_serialport_baudrate(slave_id, baudrate);
        return takeObject(ret);
    }
    /**
     * 设置设备 ID
     * 注意：更新设备 ID 后设备将重启
     *
     * # 参数
     * - `new_slave_id`: 新的设备 ID
     * @param {number} slave_id
     * @param {number} new_slave_id
     * @returns {Promise<Promise<any>>}
     */
    static set_serialport_device_id(slave_id, new_slave_id) {
        const ret = wasm.starksdk_set_serialport_device_id(slave_id, new_slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ForceLevel} force_level
     * @returns {Promise<Promise<any>>}
     */
    static set_force_level(slave_id, force_level) {
        const ret = wasm.starksdk_set_force_level(slave_id, force_level);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {boolean} enabled
     * @returns {Promise<Promise<any>>}
     */
    static set_position_auto_calibration(slave_id, enabled) {
        const ret = wasm.starksdk_set_position_auto_calibration(slave_id, enabled);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static set_position_calibration(slave_id) {
        const ret = wasm.starksdk_set_position_calibration(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {boolean} enabled
     * @returns {Promise<Promise<any>>}
     */
    static set_turbo_mode_enabled(slave_id, enabled) {
        const ret = wasm.starksdk_set_turbo_mode_enabled(slave_id, enabled);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {TurboConfig} turbo_conf
     * @returns {Promise<Promise<any>>}
     */
    static set_turbo_config(slave_id, turbo_conf) {
        _assertClass(turbo_conf, TurboConfig);
        var ptr0 = turbo_conf.__destroy_into_raw();
        const ret = wasm.starksdk_set_turbo_config(slave_id, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {LedInfo} led_info
     * @returns {Promise<Promise<any>>}
     */
    static set_led_info(slave_id, led_info) {
        _assertClass(led_info, LedInfo);
        var ptr0 = led_info.__destroy_into_raw();
        const ret = wasm.starksdk_set_led_info(slave_id, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {number} position
     * @returns {Promise<Promise<any>>}
     */
    static set_finger_position(slave_id, position) {
        const ret = wasm.starksdk_set_finger_position(slave_id, position);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {Uint16Array} positions
     * @returns {Promise<Promise<any>>}
     */
    static set_finger_positions(slave_id, positions) {
        const ptr0 = passArray16ToWasm0(positions, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.starksdk_set_finger_positions(slave_id, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {number} speed
     * @returns {Promise<Promise<any>>}
     */
    static set_finger_speed(slave_id, speed) {
        const ret = wasm.starksdk_set_finger_speed(slave_id, speed);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {Int16Array} speeds
     * @returns {Promise<Promise<any>>}
     */
    static set_finger_speeds(slave_id, speeds) {
        const ptr0 = passArray16ToWasm0(speeds, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.starksdk_set_finger_speeds(slave_id, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * Factory Functions
     * @param {number} slave_id
     * @param {string} operation_key
     * @returns {Promise<Promise<any>>}
     */
    static factory_set_key(slave_id, operation_key) {
        const ptr0 = passStringToWasm0(operation_key, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.starksdk_factory_set_key(slave_id, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {string} sn
     * @returns {Promise<Promise<any>>}
     */
    static factory_set_device_sn(slave_id, sn) {
        const ptr0 = passStringToWasm0(sn, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.starksdk_factory_set_device_sn(slave_id, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {SkuType} hand_type
     * @returns {Promise<Promise<any>>}
     */
    static factory_set_sku_type(slave_id, hand_type) {
        const ret = wasm.starksdk_factory_set_sku_type(slave_id, hand_type);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {Uint16Array} durations
     * @returns {Promise<Promise<any>>}
     */
    static factory_set_stall_durations(slave_id, durations) {
        const ptr0 = passArray16ToWasm0(durations, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.starksdk_factory_set_stall_durations(slave_id, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ForceLevel} level
     * @param {Uint16Array} currents
     * @returns {Promise<Promise<any>>}
     */
    static factory_set_stall_currents(slave_id, level, currents) {
        const ptr0 = passArray16ToWasm0(currents, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.starksdk_factory_set_stall_currents(slave_id, level, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ForceLevel} level
     * @param {Uint16Array} pwms
     * @returns {Promise<Promise<any>>}
     */
    static factory_set_finger_pwms(slave_id, level, pwms) {
        const ptr0 = passArray16ToWasm0(pwms, wasm.__wbindgen_export_3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.starksdk_factory_set_finger_pwms(slave_id, level, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @returns {Promise<Promise<any>>}
     */
    static factory_get_stall_durations(slave_id) {
        const ret = wasm.starksdk_factory_get_stall_durations(slave_id);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ForceLevel} level
     * @returns {Promise<Promise<any>>}
     */
    static factory_get_stall_currents(slave_id, level) {
        const ret = wasm.starksdk_factory_get_stall_currents(slave_id, level);
        return takeObject(ret);
    }
    /**
     * @param {number} slave_id
     * @param {ForceLevel} level
     * @returns {Promise<Promise<any>>}
     */
    static factory_get_finger_pwms(slave_id, level) {
        const ret = wasm.starksdk_factory_get_finger_pwms(slave_id, level);
        return takeObject(ret);
    }
}
module.exports.StarkSDK = StarkSDK;

const TouchSensorStatusFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_touchsensorstatus_free(ptr >>> 0, 1));

class TouchSensorStatus {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TouchSensorStatusFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_touchsensorstatus_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get normal_force1() {
        const ret = wasm.__wbg_get_touchsensorstatus_normal_force1(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set normal_force1(arg0) {
        wasm.__wbg_set_touchsensorstatus_normal_force1(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get normal_force2() {
        const ret = wasm.__wbg_get_touchsensorstatus_normal_force2(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set normal_force2(arg0) {
        wasm.__wbg_set_touchsensorstatus_normal_force2(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get normal_force3() {
        const ret = wasm.__wbg_get_touchsensorstatus_normal_force3(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set normal_force3(arg0) {
        wasm.__wbg_set_touchsensorstatus_normal_force3(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get tangential_force1() {
        const ret = wasm.__wbg_get_touchsensorstatus_tangential_force1(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set tangential_force1(arg0) {
        wasm.__wbg_set_touchsensorstatus_tangential_force1(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get tangential_force2() {
        const ret = wasm.__wbg_get_touchsensorstatus_tangential_force2(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set tangential_force2(arg0) {
        wasm.__wbg_set_touchsensorstatus_tangential_force2(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get tangential_force3() {
        const ret = wasm.__wbg_get_touchsensorstatus_tangential_force3(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set tangential_force3(arg0) {
        wasm.__wbg_set_touchsensorstatus_tangential_force3(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get tangential_direction1() {
        const ret = wasm.__wbg_get_touchsensorstatus_tangential_direction1(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set tangential_direction1(arg0) {
        wasm.__wbg_set_touchsensorstatus_tangential_direction1(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get tangential_direction2() {
        const ret = wasm.__wbg_get_touchsensorstatus_tangential_direction2(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set tangential_direction2(arg0) {
        wasm.__wbg_set_touchsensorstatus_tangential_direction2(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get tangential_direction3() {
        const ret = wasm.__wbg_get_touchsensorstatus_tangential_direction3(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set tangential_direction3(arg0) {
        wasm.__wbg_set_touchsensorstatus_tangential_direction3(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get self_close1() {
        const ret = wasm.__wbg_get_buttonpressevent_timestamp(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set self_close1(arg0) {
        wasm.__wbg_set_buttonpressevent_timestamp(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get self_close2() {
        const ret = wasm.__wbg_get_buttonpressevent_button_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set self_close2(arg0) {
        wasm.__wbg_set_buttonpressevent_button_id(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get mutual_close() {
        const ret = wasm.__wbg_get_touchsensorstatus_mutual_close(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set mutual_close(arg0) {
        wasm.__wbg_set_touchsensorstatus_mutual_close(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get status() {
        const ret = wasm.__wbg_get_touchsensorstatus_status(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set status(arg0) {
        wasm.__wbg_set_touchsensorstatus_status(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} normal_force1
     * @param {number} normal_force2
     * @param {number} normal_force3
     * @param {number} tangential_force1
     * @param {number} tangential_force2
     * @param {number} tangential_force3
     * @param {number} tangential_direction1
     * @param {number} tangential_direction2
     * @param {number} tangential_direction3
     * @param {number} self_close1
     * @param {number} self_close2
     * @param {number} mutual_close
     * @param {number} status
     */
    constructor(normal_force1, normal_force2, normal_force3, tangential_force1, tangential_force2, tangential_force3, tangential_direction1, tangential_direction2, tangential_direction3, self_close1, self_close2, mutual_close, status) {
        const ret = wasm.touchsensorstatus_new(normal_force1, normal_force2, normal_force3, tangential_force1, tangential_force2, tangential_force3, tangential_direction1, tangential_direction2, tangential_direction3, self_close1, self_close2, mutual_close, status);
        this.__wbg_ptr = ret >>> 0;
        TouchSensorStatusFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    normal_force1() {
        const ret = wasm.touchsensorstatus_normal_force1(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    normal_force2() {
        const ret = wasm.touchsensorstatus_normal_force2(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    normal_force3() {
        const ret = wasm.touchsensorstatus_normal_force3(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    tangential_force1() {
        const ret = wasm.touchsensorstatus_tangential_force1(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    tangential_force2() {
        const ret = wasm.touchsensorstatus_tangential_force2(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    tangential_force3() {
        const ret = wasm.touchsensorstatus_tangential_force3(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    tangential_direction1() {
        const ret = wasm.touchsensorstatus_tangential_direction1(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    tangential_direction2() {
        const ret = wasm.touchsensorstatus_tangential_direction2(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    tangential_direction3() {
        const ret = wasm.touchsensorstatus_tangential_direction3(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    self_close1() {
        const ret = wasm.touchsensorstatus_self_close1(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    self_close2() {
        const ret = wasm.touchsensorstatus_self_close2(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    mutual_close() {
        const ret = wasm.touchsensorstatus_mutual_close(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    status() {
        const ret = wasm.touchsensorstatus_status(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    is_normal() {
        const ret = wasm.touchsensorstatus_is_normal(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_abnormal() {
        const ret = wasm.touchsensorstatus_is_abnormal(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.touchsensorstatus_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.TouchSensorStatus = TouchSensorStatus;

const TurboConfigFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_turboconfig_free(ptr >>> 0, 1));

class TurboConfig {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TurboConfig.prototype);
        obj.__wbg_ptr = ptr;
        TurboConfigFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TurboConfigFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_turboconfig_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get interval() {
        const ret = wasm.__wbg_get_turboconfig_interval(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set interval(arg0) {
        wasm.__wbg_set_turboconfig_interval(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get duration() {
        const ret = wasm.__wbg_get_turboconfig_duration(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set duration(arg0) {
        wasm.__wbg_set_turboconfig_duration(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} interval
     * @param {number} duration
     */
    constructor(interval, duration) {
        const ret = wasm.turboconfig_new(interval, duration);
        this.__wbg_ptr = ret >>> 0;
        TurboConfigFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    interval() {
        const ret = wasm.turboconfig_interval(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    duration() {
        const ret = wasm.turboconfig_duration(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.turboconfig_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.TurboConfig = TurboConfig;

module.exports.__wbg_actionsequence_new = function(arg0) {
    const ret = ActionSequence.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_actionsequenceitem_new = function(arg0) {
    const ret = ActionSequenceItem.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_actionsequenceitem_unwrap = function(arg0) {
    const ret = ActionSequenceItem.__unwrap(takeObject(arg0));
    return ret;
};

module.exports.__wbg_buffer_6e1d53ff183194fc = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

module.exports.__wbg_buttonpressevent_new = function(arg0) {
    const ret = ButtonPressEvent.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_call_0411c0c3c424db9a = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_call_3114932863209ca6 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_deviceinfo_new = function(arg0) {
    const ret = DeviceInfo.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_done_adfd3f40364def50 = function(arg0) {
    const ret = getObject(arg0).done;
    return ret;
};

module.exports.__wbg_get_68aa371864aa301a = function(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

module.exports.__wbg_get_92a4780a3beb5fe9 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_globalThis_1e2ac1d6eee845b3 = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_global_f25a574ae080367c = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_instanceof_ArrayBuffer_435fcead703e2827 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Uint16Array_01c06284009c9dfc = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Uint16Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Uint8Array_9b67296cab48238f = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_isArray_fcd559a3bcfde1e9 = function(arg0) {
    const ret = Array.isArray(getObject(arg0));
    return ret;
};

module.exports.__wbg_isSafeInteger_4de146aa53f6e470 = function(arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    return ret;
};

module.exports.__wbg_iterator_7a20c20ce22add0f = function() {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
};

module.exports.__wbg_ledinfo_new = function(arg0) {
    const ret = LedInfo.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_length_2e63ba34c4121df5 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_length_333bb92b52407a26 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_length_e74df4881604f1d9 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_log_0cc1b7768397bcfe = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
    } finally {
        wasm.__wbindgen_export_1(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_log_cb9e190acc5753fb = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.log(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_export_1(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_mark_7438147ce31e9d4b = function(arg0, arg1) {
    performance.mark(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbg_measure_fb7825c11612c823 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    let deferred0_0;
    let deferred0_1;
    let deferred1_0;
    let deferred1_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        deferred1_0 = arg2;
        deferred1_1 = arg3;
        performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
    } finally {
        wasm.__wbindgen_export_1(deferred0_0, deferred0_1, 1);
        wasm.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
    }
}, arguments) };

module.exports.__wbg_modbusreadholdingregistervalues_86326bf5a877ad81 = function(arg0, arg1, arg2) {
    const ret = modbus_read_holding_register_values(arg0, arg1, arg2);
    return addHeapObject(ret);
};

module.exports.__wbg_modbusreadinputregistervalues_c9d93aebe18eb420 = function(arg0, arg1, arg2) {
    const ret = modbus_read_input_register_values(arg0, arg1, arg2);
    return addHeapObject(ret);
};

module.exports.__wbg_new_1e8ca58d170d6ad0 = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_305(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

module.exports.__wbg_new_23362fa370a0a372 = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_new_dd87c87f4f15c623 = function(arg0) {
    const ret = new Uint16Array(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_newnoargs_19a249f4eceaaac3 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_next_c591766a7286b02a = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_next_f387ecc56a94ba00 = function(arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
};

module.exports.__wbg_queueMicrotask_3d422e1ba49c2500 = function(arg0) {
    const ret = getObject(arg0).queueMicrotask;
    return addHeapObject(ret);
};

module.exports.__wbg_queueMicrotask_f301663ccadbb7d0 = function(arg0) {
    queueMicrotask(getObject(arg0));
};

module.exports.__wbg_resolve_6a311e8bb26423ab = function(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_self_ac4343e4047b83cc = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_serialportcfg_new = function(arg0) {
    const ret = SerialPortCfg.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_set_675f6403a9a44f14 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_set_7b70226104a82921 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_starkmodbuswrite_8d6370e44ff0266c = function(arg0, arg1, arg2, arg3) {
    const ret = stark_modbus_write(arg0, arg1, getArrayU16FromWasm0(arg2, arg3));
    return addHeapObject(ret);
};

module.exports.__wbg_then_5c6469c1e1da9e59 = function(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_then_faeb8aed8c1629b7 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

module.exports.__wbg_turboconfig_new = function(arg0) {
    const ret = TurboConfig.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_value_30db1d77772f3236 = function(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
};

module.exports.__wbg_window_1a23defd102c72f4 = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_as_number = function(arg0) {
    const ret = +getObject(arg0);
    return ret;
};

module.exports.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

module.exports.__wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

module.exports.__wbindgen_closure_wrapper2264 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 810, __wbg_adapter_43);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper707 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 395, __wbg_adapter_40);
    return addHeapObject(ret);
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
    const ret = getObject(arg0) == getObject(arg1);
    return ret;
};

module.exports.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

module.exports.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

module.exports.__wbindgen_number_new = function(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_3, wasm.__wbindgen_export_4);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_try_into_number = function(arg0) {
    let result;
    try { result = +getObject(arg0) } catch (e) { result = e }
    const ret = result;
    return addHeapObject(ret);
};

module.exports.__wbindgen_uint16_array_new = function(arg0, arg1) {
    var v0 = getArrayU16FromWasm0(arg0, arg1).slice();
    wasm.__wbindgen_export_1(arg0, arg1 * 2, 2);
    const ret = v0;
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'bc_proto_sdk_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

