
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

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

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_0.get(state.dtor)(state.a, state.b)
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
                wasm.__wbindgen_export_0.get(state.dtor)(a, state.b);
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
function __wbg_adapter_16(arg0, arg1, arg2) {
    wasm.__wbindgen_export_1(arg0, arg1, addHeapObject(arg2));
}

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
/**
 * @param {string} level
 */
module.exports.init_logging = function(level) {
    const ptr0 = passStringToWasm0(level, wasm.__wbindgen_export_2, wasm.__wbindgen_export_3);
    const len0 = WASM_VECTOR_LEN;
    wasm.init_logging(ptr0, len0);
};

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat64ArrayMemory0 = null;

function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}
/**
 * @param {Uint8Array} data
 * @param {number} gain
 * @returns {Float64Array}
 */
module.exports.parse_eeg_data = function(data, gain) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_2);
        const len0 = WASM_VECTOR_LEN;
        wasm.parse_eeg_data(retptr, ptr0, len0, gain);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_4(r0, r1 * 8, 8);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_5(addHeapObject(e));
    }
}
function __wbg_adapter_48(arg0, arg1, arg2, arg3) {
    wasm.__wbindgen_export_6(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

module.exports.EEGCapModuleId = Object.freeze({ MCU:0,"0":"MCU",BLE:1,"1":"BLE",APP:2,"2":"APP", });

module.exports.EegSampleRate = Object.freeze({ SR_None:0,"0":"SR_None",SR_250Hz:111,"111":"SR_250Hz",SR_500Hz:95,"95":"SR_500Hz",SR_1000Hz:79,"79":"SR_1000Hz",SR_2000Hz:63,"63":"SR_2000Hz",SR_4000Hz:47,"47":"SR_4000Hz",SR_8000Hz:31,"31":"SR_8000Hz",SR_16000Hz:15,"15":"SR_16000Hz", });

module.exports.EegSignalGain = Object.freeze({ GAIN_NONE:0,"0":"GAIN_NONE",GAIN_1:15,"15":"GAIN_1",GAIN_2:31,"31":"GAIN_2",GAIN_4:47,"47":"GAIN_4",GAIN_6:63,"63":"GAIN_6",GAIN_8:79,"79":"GAIN_8",GAIN_12:95,"95":"GAIN_12",GAIN_24:111,"111":"GAIN_24", });

module.exports.EegSignalSource = Object.freeze({ SIGNAL_NONE:0,"0":"SIGNAL_NONE",NORMAL:15,"15":"NORMAL",SHORTED:31,"31":"SHORTED",MVDD:63,"63":"MVDD",TEST_SIGNAL:95,"95":"TEST_SIGNAL", });

module.exports.ImuSampleRate = Object.freeze({ SR_NONE:0,"0":"SR_NONE",SR_50Hz:1,"1":"SR_50Hz",SR_100Hz:2,"2":"SR_100Hz", });

module.exports.MsgType = Object.freeze({ Crimson:0,"0":"Crimson",OxyZen:1,"1":"OxyZen",Mobius:3,"3":"Mobius",MobiusV1_5:4,"4":"MobiusV1_5",Almond:5,"5":"Almond",AlmondV2:6,"6":"AlmondV2",Morpheus:2,"2":"Morpheus",Luna:7,"7":"Luna",REN:8,"8":"REN",Breeze:9,"9":"Breeze",StarkUS:10,"10":"StarkUS",EEGCap:11,"11":"EEGCap",Edu:12,"12":"Edu",Clear:13,"13":"Clear",Melody:15,"15":"Melody",Aura:16,"16":"Aura", });

module.exports.WiFiSecurity = Object.freeze({ SECURITY_NONE:0,"0":"SECURITY_NONE",SECURITY_OPEN:1,"1":"SECURITY_OPEN",SECURITY_WPA2_AES_PSK:2,"2":"SECURITY_WPA2_AES_PSK",SECURITY_WPA2_TKIP_PSK:3,"3":"SECURITY_WPA2_TKIP_PSK",SECURITY_WPA2_MIXED_PSK:4,"4":"SECURITY_WPA2_MIXED_PSK",SECURITY_WPA_WPA2_TKIP_PSK:5,"5":"SECURITY_WPA_WPA2_TKIP_PSK",SECURITY_WPA_WPA2_AES_PSK:6,"6":"SECURITY_WPA_WPA2_AES_PSK",SECURITY_WPA_WPA2_MIXED_PSK:7,"7":"SECURITY_WPA_WPA2_MIXED_PSK",SECURITY_WPA3_AES_PSK:8,"8":"SECURITY_WPA3_AES_PSK",SECURITY_WPA2_WPA3_MIXED:9,"9":"SECURITY_WPA2_WPA3_MIXED", });

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
        const ptr0 = passStringToWasm0(device_id, wasm.__wbindgen_export_2, wasm.__wbindgen_export_3);
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
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_2);
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
}
module.exports.MessageParser = MessageParser;

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbg_mark_40e050a77cc39fea = function(arg0, arg1) {
    performance.mark(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbg_log_c9486ca5d8e2cbe8 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.log(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_export_4(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_log_aba5996d9bde071f = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
    } finally {
        wasm.__wbindgen_export_4(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_measure_aa7a73f17813f708 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
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
        wasm.__wbindgen_export_4(deferred0_0, deferred0_1, 1);
        wasm.__wbindgen_export_4(deferred1_0, deferred1_1, 1);
    }
}, arguments) };

module.exports.__wbg_queueMicrotask_848aa4969108a57e = function(arg0) {
    const ret = getObject(arg0).queueMicrotask;
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
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

module.exports.__wbg_queueMicrotask_c5419c06eab41e73 = function(arg0) {
    queueMicrotask(getObject(arg0));
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_newnoargs_1ede4bf2ebbaaf43 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_call_a9ef466721e824f2 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_self_bf91bf94d9e04084 = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_window_52dd9f07d03fd5f8 = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_globalThis_05c129bf37fcf1be = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_global_3eca19bb09e9c484 = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbg_call_3bfa248576352471 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_1073970097e5a420 = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_48(a, state0.b, arg0, arg1);
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

module.exports.__wbg_resolve_0aad7c1484731c99 = function(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_then_748f75edfb032440 = function(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_closure_wrapper616 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 237, __wbg_adapter_16);
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'bc_proto_sdk_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

