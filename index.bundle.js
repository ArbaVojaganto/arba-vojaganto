const HEX_CHARS = "0123456789abcdef".split("");
const EXTRA = [
    -2147483648,
    8388608,
    32768,
    128
];
const SHIFT = [
    24,
    16,
    8,
    0
];
const K = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298, 
];
const blocks = [];
class Sha256 {
    #block;
    #blocks;
    #bytes;
    #finalized;
    #first;
    #h0;
    #h1;
    #h2;
    #h3;
    #h4;
    #h5;
    #h6;
    #h7;
    #hashed;
    #hBytes;
    #is224;
    #lastByteIndex = 0;
    #start;
    constructor(is2241 = false, sharedMemory1 = false){
        this.init(is2241, sharedMemory1);
    }
    init(is224, sharedMemory) {
        if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this.#blocks = blocks;
        } else {
            this.#blocks = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ];
        }
        if (is224) {
            this.#h0 = 3238371032;
            this.#h1 = 914150663;
            this.#h2 = 812702999;
            this.#h3 = 4144912697;
            this.#h4 = 4290775857;
            this.#h5 = 1750603025;
            this.#h6 = 1694076839;
            this.#h7 = 3204075428;
        } else {
            this.#h0 = 1779033703;
            this.#h1 = 3144134277;
            this.#h2 = 1013904242;
            this.#h3 = 2773480762;
            this.#h4 = 1359893119;
            this.#h5 = 2600822924;
            this.#h6 = 528734635;
            this.#h7 = 1541459225;
        }
        this.#block = this.#start = this.#bytes = this.#hBytes = 0;
        this.#finalized = this.#hashed = false;
        this.#first = true;
        this.#is224 = is224;
    }
    update(message) {
        if (this.#finalized) {
            return this;
        }
        let msg;
        if (message instanceof ArrayBuffer) {
            msg = new Uint8Array(message);
        } else {
            msg = message;
        }
        let index = 0;
        const length = msg.length;
        const blocks1 = this.#blocks;
        while(index < length){
            let i;
            if (this.#hashed) {
                this.#hashed = false;
                blocks1[0] = this.#block;
                blocks1[16] = blocks1[1] = blocks1[2] = blocks1[3] = blocks1[4] = blocks1[5] = blocks1[6] = blocks1[7] = blocks1[8] = blocks1[9] = blocks1[10] = blocks1[11] = blocks1[12] = blocks1[13] = blocks1[14] = blocks1[15] = 0;
            }
            if (typeof msg !== "string") {
                for(i = this.#start; index < length && i < 64; ++index){
                    blocks1[i >> 2] |= msg[index] << SHIFT[(i++) & 3];
                }
            } else {
                for(i = this.#start; index < length && i < 64; ++index){
                    let code = msg.charCodeAt(index);
                    if (code < 128) {
                        blocks1[i >> 2] |= code << SHIFT[(i++) & 3];
                    } else if (code < 2048) {
                        blocks1[i >> 2] |= (192 | code >> 6) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
                    } else if (code < 55296 || code >= 57344) {
                        blocks1[i >> 2] |= (224 | code >> 12) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
                    } else {
                        code = 65536 + ((code & 1023) << 10 | msg.charCodeAt(++index) & 1023);
                        blocks1[i >> 2] |= (240 | code >> 18) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
                    }
                }
            }
            this.#lastByteIndex = i;
            this.#bytes += i - this.#start;
            if (i >= 64) {
                this.#block = blocks1[16];
                this.#start = i - 64;
                this.hash();
                this.#hashed = true;
            } else {
                this.#start = i;
            }
        }
        if (this.#bytes > 4294967295) {
            this.#hBytes += this.#bytes / 4294967296 << 0;
            this.#bytes = this.#bytes % 4294967296;
        }
        return this;
    }
    finalize() {
        if (this.#finalized) {
            return;
        }
        this.#finalized = true;
        const blocks1 = this.#blocks;
        const i = this.#lastByteIndex;
        blocks1[16] = this.#block;
        blocks1[i >> 2] |= EXTRA[i & 3];
        this.#block = blocks1[16];
        if (i >= 56) {
            if (!this.#hashed) {
                this.hash();
            }
            blocks1[0] = this.#block;
            blocks1[16] = blocks1[1] = blocks1[2] = blocks1[3] = blocks1[4] = blocks1[5] = blocks1[6] = blocks1[7] = blocks1[8] = blocks1[9] = blocks1[10] = blocks1[11] = blocks1[12] = blocks1[13] = blocks1[14] = blocks1[15] = 0;
        }
        blocks1[14] = this.#hBytes << 3 | this.#bytes >>> 29;
        blocks1[15] = this.#bytes << 3;
        this.hash();
    }
    hash() {
        let a = this.#h0;
        let b = this.#h1;
        let c = this.#h2;
        let d = this.#h3;
        let e = this.#h4;
        let f = this.#h5;
        let g = this.#h6;
        let h = this.#h7;
        const blocks1 = this.#blocks;
        let s0;
        let s1;
        let maj;
        let t1;
        let t2;
        let ch;
        let ab;
        let da;
        let cd;
        let bc;
        for(let j = 16; j < 64; ++j){
            t1 = blocks1[j - 15];
            s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
            t1 = blocks1[j - 2];
            s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
            blocks1[j] = blocks1[j - 16] + s0 + blocks1[j - 7] + s1 << 0;
        }
        bc = b & c;
        for(let j1 = 0; j1 < 64; j1 += 4){
            if (this.#first) {
                if (this.#is224) {
                    ab = 300032;
                    t1 = blocks1[0] - 1413257819;
                    h = t1 - 150054599 << 0;
                    d = t1 + 24177077 << 0;
                } else {
                    ab = 704751109;
                    t1 = blocks1[0] - 210244248;
                    h = t1 - 1521486534 << 0;
                    d = t1 + 143694565 << 0;
                }
                this.#first = false;
            } else {
                s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
                s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
                ab = a & b;
                maj = ab ^ a & c ^ bc;
                ch = e & f ^ ~e & g;
                t1 = h + s1 + ch + K[j1] + blocks1[j1];
                t2 = s0 + maj;
                h = d + t1 << 0;
                d = t1 + t2 << 0;
            }
            s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
            s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
            da = d & a;
            maj = da ^ d & b ^ ab;
            ch = h & e ^ ~h & f;
            t1 = g + s1 + ch + K[j1 + 1] + blocks1[j1 + 1];
            t2 = s0 + maj;
            g = c + t1 << 0;
            c = t1 + t2 << 0;
            s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
            s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
            cd = c & d;
            maj = cd ^ c & a ^ da;
            ch = g & h ^ ~g & e;
            t1 = f + s1 + ch + K[j1 + 2] + blocks1[j1 + 2];
            t2 = s0 + maj;
            f = b + t1 << 0;
            b = t1 + t2 << 0;
            s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
            s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
            bc = b & c;
            maj = bc ^ b & d ^ cd;
            ch = f & g ^ ~f & h;
            t1 = e + s1 + ch + K[j1 + 3] + blocks1[j1 + 3];
            t2 = s0 + maj;
            e = a + t1 << 0;
            a = t1 + t2 << 0;
        }
        this.#h0 = this.#h0 + a << 0;
        this.#h1 = this.#h1 + b << 0;
        this.#h2 = this.#h2 + c << 0;
        this.#h3 = this.#h3 + d << 0;
        this.#h4 = this.#h4 + e << 0;
        this.#h5 = this.#h5 + f << 0;
        this.#h6 = this.#h6 + g << 0;
        this.#h7 = this.#h7 + h << 0;
    }
    hex() {
        this.finalize();
        const h0 = this.#h0;
        const h1 = this.#h1;
        const h2 = this.#h2;
        const h3 = this.#h3;
        const h4 = this.#h4;
        const h5 = this.#h5;
        const h6 = this.#h6;
        const h7 = this.#h7;
        let hex = HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >> 28 & 15] + HEX_CHARS[h4 >> 24 & 15] + HEX_CHARS[h4 >> 20 & 15] + HEX_CHARS[h4 >> 16 & 15] + HEX_CHARS[h4 >> 12 & 15] + HEX_CHARS[h4 >> 8 & 15] + HEX_CHARS[h4 >> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >> 28 & 15] + HEX_CHARS[h5 >> 24 & 15] + HEX_CHARS[h5 >> 20 & 15] + HEX_CHARS[h5 >> 16 & 15] + HEX_CHARS[h5 >> 12 & 15] + HEX_CHARS[h5 >> 8 & 15] + HEX_CHARS[h5 >> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >> 28 & 15] + HEX_CHARS[h6 >> 24 & 15] + HEX_CHARS[h6 >> 20 & 15] + HEX_CHARS[h6 >> 16 & 15] + HEX_CHARS[h6 >> 12 & 15] + HEX_CHARS[h6 >> 8 & 15] + HEX_CHARS[h6 >> 4 & 15] + HEX_CHARS[h6 & 15];
        if (!this.#is224) {
            hex += HEX_CHARS[h7 >> 28 & 15] + HEX_CHARS[h7 >> 24 & 15] + HEX_CHARS[h7 >> 20 & 15] + HEX_CHARS[h7 >> 16 & 15] + HEX_CHARS[h7 >> 12 & 15] + HEX_CHARS[h7 >> 8 & 15] + HEX_CHARS[h7 >> 4 & 15] + HEX_CHARS[h7 & 15];
        }
        return hex;
    }
    toString() {
        return this.hex();
    }
    digest() {
        this.finalize();
        const h0 = this.#h0;
        const h1 = this.#h1;
        const h2 = this.#h2;
        const h3 = this.#h3;
        const h4 = this.#h4;
        const h5 = this.#h5;
        const h6 = this.#h6;
        const h7 = this.#h7;
        const arr = [
            h0 >> 24 & 255,
            h0 >> 16 & 255,
            h0 >> 8 & 255,
            h0 & 255,
            h1 >> 24 & 255,
            h1 >> 16 & 255,
            h1 >> 8 & 255,
            h1 & 255,
            h2 >> 24 & 255,
            h2 >> 16 & 255,
            h2 >> 8 & 255,
            h2 & 255,
            h3 >> 24 & 255,
            h3 >> 16 & 255,
            h3 >> 8 & 255,
            h3 & 255,
            h4 >> 24 & 255,
            h4 >> 16 & 255,
            h4 >> 8 & 255,
            h4 & 255,
            h5 >> 24 & 255,
            h5 >> 16 & 255,
            h5 >> 8 & 255,
            h5 & 255,
            h6 >> 24 & 255,
            h6 >> 16 & 255,
            h6 >> 8 & 255,
            h6 & 255, 
        ];
        if (!this.#is224) {
            arr.push(h7 >> 24 & 255, h7 >> 16 & 255, h7 >> 8 & 255, h7 & 255);
        }
        return arr;
    }
    array() {
        return this.digest();
    }
    arrayBuffer() {
        this.finalize();
        const buffer = new ArrayBuffer(this.#is224 ? 28 : 32);
        const dataView = new DataView(buffer);
        dataView.setUint32(0, this.#h0);
        dataView.setUint32(4, this.#h1);
        dataView.setUint32(8, this.#h2);
        dataView.setUint32(12, this.#h3);
        dataView.setUint32(16, this.#h4);
        dataView.setUint32(20, this.#h5);
        dataView.setUint32(24, this.#h6);
        if (!this.#is224) {
            dataView.setUint32(28, this.#h7);
        }
        return buffer;
    }
}
class HmacSha256 extends Sha256 {
    #inner;
    #is224;
    #oKeyPad;
    #sharedMemory;
    constructor(secretKey, is2242 = false, sharedMemory2 = false){
        super(is2242, sharedMemory2);
        let key;
        if (typeof secretKey === "string") {
            const bytes = [];
            const length = secretKey.length;
            let index = 0;
            for(let i = 0; i < length; ++i){
                let code = secretKey.charCodeAt(i);
                if (code < 128) {
                    bytes[index++] = code;
                } else if (code < 2048) {
                    bytes[index++] = 192 | code >> 6;
                    bytes[index++] = 128 | code & 63;
                } else if (code < 55296 || code >= 57344) {
                    bytes[index++] = 224 | code >> 12;
                    bytes[index++] = 128 | code >> 6 & 63;
                    bytes[index++] = 128 | code & 63;
                } else {
                    code = 65536 + ((code & 1023) << 10 | secretKey.charCodeAt(++i) & 1023);
                    bytes[index++] = 240 | code >> 18;
                    bytes[index++] = 128 | code >> 12 & 63;
                    bytes[index++] = 128 | code >> 6 & 63;
                    bytes[index++] = 128 | code & 63;
                }
            }
            key = bytes;
        } else {
            if (secretKey instanceof ArrayBuffer) {
                key = new Uint8Array(secretKey);
            } else {
                key = secretKey;
            }
        }
        if (key.length > 64) {
            key = new Sha256(is2242, true).update(key).array();
        }
        const oKeyPad = [];
        const iKeyPad = [];
        for(let i = 0; i < 64; ++i){
            const b = key[i] || 0;
            oKeyPad[i] = 92 ^ b;
            iKeyPad[i] = 54 ^ b;
        }
        this.update(iKeyPad);
        this.#oKeyPad = oKeyPad;
        this.#inner = true;
        this.#is224 = is2242;
        this.#sharedMemory = sharedMemory2;
    }
    finalize() {
        super.finalize();
        if (this.#inner) {
            this.#inner = false;
            const innerHash = this.array();
            super.init(this.#is224, this.#sharedMemory);
            this.update(this.#oKeyPad);
            this.update(innerHash);
            super.finalize();
        }
    }
}
const Range1 = (start, end)=>{
    return Array.from({
        length: end - start + 1
    }, (v, k)=>k + start
    );
};
const RangeRandom = (begin, end)=>{
    return Math.floor(Math.random() * (end - begin) + begin);
};
const isNull = (value)=>{
    return value == null || value == undefined;
};
const splitFileName = (filepath)=>((arr)=>{
        return {
            name: arr[0],
            extention: arr[1]
        };
    })(filepath.split(/(?=\.[^.]+$)/))
;
const bufferToHash = (hashable)=>{
    const message = hashable;
    const sha256 = new Sha256();
    sha256.update(message);
    return sha256.hex();
};
const relHashPath = (hash, num)=>{
    const A = Array.from(Array(num), (v, k)=>k
    );
    return A.map((i1)=>hash.substring(0, i1 + 1)
    ).join("/");
};
const UriToHash = (uri)=>{
    return uri.replace(/^[a-z]*:/, "");
};
const HashToUri = (hash)=>{
    return `ensorbi:${hash}`;
};
const getVectorTagMeta = ()=>{
    const hash = bufferToHash("tag");
    return {
        key: hash,
        value: {
            tag: 1
        }
    };
};
const hashToRemoteResourcePath = (hash)=>{
    return `${relHashPath(hash, 3)}/`;
};
const orgmodeResourcePath = (hash)=>{
    return {
        prefix: "storage/org/",
        hashDir: hashToRemoteResourcePath(hash),
        hash: hash,
        extention: ".org"
    };
};
const blobResourcePath = (hash)=>{
    return {
        prefix: "storage/blob/",
        hashDir: hashToRemoteResourcePath(hash),
        hash: hash
    };
};
const metaResourcePath = (hash)=>{
    return {
        prefix: "storage/meta/",
        hashDir: hashToRemoteResourcePath(hash),
        hash: hash,
        extention: ".json"
    };
};
const todayString = ()=>{
    return new RegExp("^[0-9]+-[0-9]+-[0-9]+").exec(new Date().toISOString())?.[0];
};
class Node1 {
    hash;
    title;
    createdAt;
    thumbnail;
    description;
    vector;
    remoteUri;
    type;
    referers = {
    };
    constructor(hash2, title, createdAt, thumbnail, description, vector, remoteUri){
        this.hash = hash2;
        this.title = title;
        this.createdAt = createdAt;
        this.thumbnail = thumbnail;
        this.description = description;
        this.vector = vector;
        this.remoteUri = remoteUri;
        console.log("create node instance:" + hash2);
        const allhash = bufferToHash("node");
        vector[allhash] = vector[allhash] ?? {
            tag: 1
        };
        const today = todayString();
        console.log(today);
        if (!isNull(today)) {
            const todayHash = bufferToHash(today);
            vector[todayHash] = vector[todayHash] ?? {
                tag: 1
            };
        }
    }
    static validation = (meta)=>{
        if (isNull(meta)) return false;
        if (isNull(meta.hash)) return false;
        if (isNull(meta.title)) return false;
        if (isNull(meta.createdAt)) return false;
        if (isNull(meta.thumbnail)) return false;
        if (isNull(meta.description)) return false;
        if (isNull(meta.vector)) return false;
        if (isNull(meta.referers)) return false;
        if (isNull(meta.remoteUri)) return false;
        return true;
    };
}
const GetNodeEdges = (target)=>{
    const ret = {
        ...target.vector,
        ...target.referers
    };
    delete ret[target.hash];
    return Object.entries(ret);
};
class EventDispatcher {
    ListnersMap = {
    };
    getListeners = (eventType)=>{
        if (!this.ListnersMap[eventType]) {
            this.ListnersMap[eventType] = [];
        }
        return this.ListnersMap[eventType];
    };
    addEventListner(eventType, callback, options = {
    }) {
        const listner = {
            oneShot: !!options.oneShot,
            callback: callback
        };
        this.getListeners(eventType).push(listner);
    }
    removeEventListner(eventType, callback) {
        const listnerList = this.getListeners(eventType);
        const index = listnerList.findIndex((listner)=>{
            listner === callback;
        });
        if (index >= 0) {
            listnerList.splice(index, 1);
        }
    }
    removeAllEventListner() {
        this.ListnersMap = {
        };
    }
    dispatchEvent(event) {
        const listnerList = this.getListeners(event.type);
        listnerList.forEach((e)=>{
            e.callback(event);
        });
        const filtered = listnerList.filter((listner)=>!listner.oneShot
        );
        this.ListnersMap[event.type] = filtered;
    }
}
const isMatrix = (o)=>{
    if (Array.isArray(o)) {
        return true;
    } else {
        return false;
    }
};
const multiplyVector = (m0, m1)=>{
    return {
        x: m0[0] * m1.x + m0[1] * m1.y + m0[2],
        y: m0[3] * m1.x + m0[4] * m1.y + m0[5]
    };
};
const multiplyMatrix = (m0, m1)=>{
    return [
        m0[0] * m1[0] + m0[1] * m1[3] + m0[2] * m1[6],
        m0[0] * m1[1] + m0[1] * m1[4] + m0[2] * m1[7],
        m0[0] * m1[2] + m0[1] * m1[5] + m0[2] * m1[8],
        m0[3] * m1[0] + m0[4] * m1[3] + m0[5] * m1[6],
        m0[3] * m1[1] + m0[4] * m1[4] + m0[5] * m1[7],
        m0[3] * m1[2] + m0[4] * m1[5] + m0[5] * m1[8],
        m0[6] * m1[0] + m0[7] * m1[3] + m0[8] * m1[6],
        m0[6] * m1[1] + m0[7] * m1[4] + m0[8] * m1[7],
        m0[6] * m1[2] + m0[7] * m1[5] + m0[8] * m1[8], 
    ];
};
const translateMatrix = (x, y)=>{
    return [
        1,
        0,
        x,
        0,
        1,
        y,
        0,
        0,
        1
    ];
};
const scaleMatrix = (x, y)=>{
    return [
        x,
        0,
        0,
        0,
        y,
        0,
        0,
        0,
        1
    ];
};
class CanvasManager extends EventDispatcher {
    document;
    rootNode;
    graphCanvas;
    _translating = false;
    _prePos = {
        x: 0,
        y: 0
    };
    _redrawFlag = true;
    _m = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    _inv = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    _vv = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    _vp = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    _resizeTimeoutId = -1;
    _resizeType = 'no scaleMatrix top left';
    width = ()=>{
        return this.graphCanvas ? this.graphCanvas.width : -1;
    };
    height = ()=>{
        return this.graphCanvas ? this.graphCanvas.height : -1;
    };
    id = ()=>{
        return this.graphCanvas ? this.graphCanvas.id : "";
    };
    constructor(document1, rootNode1){
        super();
        this.document = document1;
        this.rootNode = rootNode1;
        this.graphCanvas = document1.createElement("canvas");
        this.graphCanvas.style.width = window.innerWidth + 'px';
        this.graphCanvas.style.height = window.innerHeight + 'px';
        this.graphCanvas.width = Math.floor(window.innerWidth * window.devicePixelRatio);
        this.graphCanvas.height = Math.floor(window.innerHeight * window.devicePixelRatio);
        this.graphCanvas.id = "network-graph-canvas";
        rootNode1.appendChild(this.graphCanvas);
    }
    init = ()=>{
        this.initModel();
        this.updateDom();
        this.initController();
    };
    initModel = ()=>{
        this._translating = false;
        this._redrawFlag = true;
        this._resizeTimeoutId = -1;
        this._resizeType = 'no scaleMatrix top left';
        this.updateViewPort();
        this._vv = {
            x: 0,
            y: 0,
            w: this._vp.w,
            h: this._vp.h
        };
        this.updatePrjMatrix();
    };
    initController = ()=>{
        if (!this.graphCanvas) {
            return;
        }
        this.graphCanvas.addEventListener('dblclick', (e)=>{
            e.preventDefault();
            const event = {
                type: 'dblclick',
                which: e.which
            };
            super.dispatchEvent(event);
        });
        this.graphCanvas.addEventListener('mousedown', (e)=>{
            e.preventDefault();
            if (this._resizeTimeoutId !== -1) {
                return;
            }
            if (this._translating) {
                return;
            }
            if (e.shiftKey) {
                this._translating = true;
            }
            const cursorPos = {
                x: e.pageX,
                y: e.pageY
            };
            this._prePos = this.screenToWorld(cursorPos);
            const event = {
                type: 'mousedown',
                which: e.which
            };
            super.dispatchEvent(event);
        });
        this.graphCanvas.addEventListener('mousemove', (e)=>{
            const cursorPos = {
                x: e.pageX,
                y: e.pageY
            };
            const curPos = this.screenToWorld(cursorPos);
            if (this._translating) {
                this.translate({
                    x: this._prePos.x - curPos.x,
                    y: this._prePos.y - curPos.y
                });
                this._prePos = this.screenToWorld(cursorPos);
                this._redrawFlag = true;
            } else {
                const event = {
                    type: 'mousemove',
                    which: e.which,
                    x: curPos.x,
                    y: curPos.y
                };
                super.dispatchEvent(event);
            }
        });
        this.graphCanvas.addEventListener('mouseup', (e)=>{
            this._translating = false;
            const event = {
                type: 'mouseup',
                which: e.which
            };
            super.dispatchEvent(event);
        });
        this.graphCanvas.addEventListener('mousewheel', (e)=>{
            if (this._resizeTimeoutId !== -1) {
                return;
            }
            const cursorPos = {
                x: e.pageX,
                y: e.pageY
            };
            const curPos = this.screenToWorld(cursorPos);
            const rate = e.wheelDelta > 0 ? 1 / 1.2 : 1.2;
            this.scale(curPos, rate);
            this._redrawFlag = true;
        });
        this.graphCanvas.addEventListener('resize', (e)=>{
            if (this._resizeTimeoutId !== -1) {
                clearTimeout(this._resizeTimeoutId);
                this._resizeTimeoutId = -1;
            }
            this._resizeTimeoutId = setTimeout(()=>{
                if (this._resizeType === 'scaleMatrix center') {
                    this.resizeScaleCenter();
                } else if (this._resizeType === 'scaleMatrix top left') {
                    this.resizeScaleTopLeft();
                } else if (this._resizeType === 'no scaleMatrix center') {
                    this.resizeNoScaleCenter();
                } else if (this._resizeType === 'no scaleMatrix top left') {
                    this.resizeNoScaleTopLeft();
                }
                this.updateDom();
                this._redrawFlag = true;
                this._resizeTimeoutId = -1;
            }, 500);
        });
    };
    updateViewPort = ()=>{
        this._vp = {
            x: 0,
            y: 0,
            w: window.innerWidth * window.devicePixelRatio,
            h: window.innerHeight * window.devicePixelRatio
        };
    };
    updatePrjMatrix = ()=>{
        const trans = translateMatrix(-this._vv.x, -this._vv.y);
        const invTrans = translateMatrix(this._vv.x, this._vv.y);
        const scale = scaleMatrix(this._vp.w / this._vv.w, this._vp.h / this._vv.h);
        const invScale = scaleMatrix(this._vv.w / this._vp.w, this._vv.h / this._vp.h);
        this._m = multiplyMatrix(scale, trans);
        this._inv = multiplyMatrix(invTrans, invScale);
    };
    resizeScaleCenter = ()=>{
        const rate = {
            x: this._vv.w / this._vp.w,
            y: this._vv.h / this._vp.h
        };
        const vvsq = {
            x: 0,
            y: 0,
            size: 0
        };
        if (this._vv.w > this._vv.h) {
            vvsq.y = this._vv.y;
            vvsq.size = this._vv.h;
            vvsq.x = this._vv.x + (this._vv.w - vvsq.size) / 2;
        } else {
            vvsq.x = this._vv.x;
            vvsq.size = this._vv.w;
            vvsq.y = this._vv.y + (this._vv.h - vvsq.size) / 2;
        }
        this.updateViewPort();
        const aspect = this._vp.w / this._vp.h;
        if (aspect > 1) {
            this._vv.y = vvsq.y;
            this._vv.h = vvsq.size;
            this._vv.x = vvsq.x - vvsq.size * aspect / 2 + vvsq.size / 2;
            this._vv.w = vvsq.size * aspect;
        } else {
            this._vv.x = vvsq.x;
            this._vv.w = vvsq.size;
            this._vv.y = vvsq.y - vvsq.size / aspect / 2 + vvsq.size / 2;
            this._vv.h = vvsq.size / aspect;
        }
        this.updatePrjMatrix();
    };
    resizeScaleTopLeft = ()=>{
        const rate = {
            x: this._vv.w / this._vp.w,
            y: this._vv.h / this._vp.h
        };
        const vvsq = {
            x: 0,
            y: 0,
            size: 0
        };
        if (this._vv.w > this._vv.h) {
            vvsq.size = this._vv.h;
        } else {
            vvsq.size = this._vv.w;
        }
        this.updateViewPort();
        const aspect = this._vp.w / this._vp.h;
        if (aspect > 1) {
            this._vv.h = vvsq.size;
            this._vv.w = vvsq.size * aspect;
        } else {
            this._vv.w = vvsq.size;
            this._vv.h = vvsq.size / aspect;
        }
        this.updatePrjMatrix();
    };
    resizeNoScaleCenter = ()=>{
        const rate = {
            x: this._vv.w / this._vp.w,
            y: this._vv.h / this._vp.h
        };
        const oldCenter = {
            x: this._vv.x + this._vv.w / 2,
            y: this._vv.y + this._vv.h / 2
        };
        this.updateViewPort();
        this._vv.w = this._vp.w * rate.x;
        this._vv.h = this._vp.h * rate.y;
        this._vv.x = oldCenter.x - this._vv.w / 2;
        this._vv.y = oldCenter.y - this._vv.h / 2;
        this.updatePrjMatrix();
    };
    resizeNoScaleTopLeft = ()=>{
        const rate = {
            x: this._vv.w / this._vp.w,
            y: this._vv.h / this._vp.h
        };
        this.updateViewPort();
        this._vv.w = this._vp.w * rate.x;
        this._vv.h = this._vp.h * rate.y;
        this.updatePrjMatrix();
    };
    translate = (vec)=>{
        this._vv.x += vec.x;
        this._vv.y += vec.y;
        this.updatePrjMatrix();
    };
    scale = (center, rate)=>{
        let topLeft = {
            x: this._vv.x,
            y: this._vv.y
        };
        let mat;
        mat = translateMatrix(-center.x, -center.y);
        mat = multiplyMatrix(scaleMatrix(rate, rate), mat);
        mat = multiplyMatrix(translateMatrix(center.x, center.y), mat);
        topLeft = multiplyVector(mat, topLeft);
        this._vv.x = topLeft.x;
        this._vv.y = topLeft.y;
        this._vv.w *= rate;
        this._vv.h *= rate;
        this.updatePrjMatrix();
    };
    screenToWorld = (screenPos)=>{
        return multiplyVector(this._inv, screenPos);
    };
    updateDom = ()=>{
        if (!this.graphCanvas) {
            return;
        }
        this.graphCanvas.width = this._vp.w;
        this.graphCanvas.height = this._vp.h;
    };
    updateView = ()=>{
        if (!this.graphCanvas) return;
        const ctx = this.graphCanvas.getContext('2d');
        if (!ctx) return;
        ctx.save();
        ctx.clearRect(this._vv.x, this._vv.y, this._vv.w, this._vv.h);
        ctx.setTransform(this._m[0], this._m[3], this._m[1], this._m[4], this._m[2], this._m[5]);
    };
    update = ()=>{
        this.updateView();
        this._redrawFlag = false;
    };
    getGraphCanvas = ()=>{
        return this.graphCanvas;
    };
}
const GetRequest = async (uri, query = "")=>{
    console.log(`HTTP REQUEST GET:${uri}${query}`);
    return await fetch(uri + query).then((response)=>{
        return response;
    }).catch((e)=>{
        console.log(e);
        return undefined;
    });
};
const PostRequest = async (uri, body, files)=>{
    const file = files[0];
    const formData = new FormData();
    formData.set("meta", JSON.stringify(body));
    formData.set("file", files[0]);
    const param = {
        method: "POST",
        body: formData
    };
    return await fetch(uri, param).then((response)=>{
        return response.json();
    }).catch((e)=>{
        console.log(e);
    });
};
const DeleteRequest = async (uri)=>{
    return await fetch(uri, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then((response)=>{
        return response.json();
    }).catch((e)=>{
        console.log(e);
    });
};
const PutRequest = async (uri, formData)=>{
    console.log({
        ...formData.getAll
    });
    const param = {
        method: "PUT",
        body: formData
    };
    return await fetch(uri, param).then((response)=>{
        return response;
    }).catch((e)=>{
        console.log(e);
        return undefined;
    });
};
const PatchRequest = async (uri)=>{
    return await fetch(uri, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then((response)=>{
        return response.json();
    }).catch((e)=>{
        console.log(e);
    });
};
const CreateTextArea = (document1, value = '{"title": "", "content": ""}', rows = 10, cols = 10)=>{
    let area = document1.createElement("textarea");
    area.readOnly = false;
    area.value = value;
    area.rows = rows;
    area.cols = cols;
    return area;
};
const CreateInputText = (document1, value = "")=>{
    let input = document1.createElement("input");
    input.type = "text";
    input.value = "tag";
    return input;
};
const CreateInputButton = (document1, value = "", callback = (e)=>{
})=>{
    let button = document1.createElement("button");
    button.innerText = value;
    button.value = value;
    button.onclick = callback;
    return button;
};
const CreateImg = (document1, src, width = 0, height = 0, alt = "")=>{
    let img = document1.createElement("img");
    img.src = src;
    if (width != 0) img.width = width;
    if (height != 0) img.height = height;
    img.alt = alt;
    return img;
};
const CreateAutocompleteInput = (document1, dataListId, dataList = [], value = "")=>{
    const input = document1.createElement("input");
    input.type = "text";
    input.value = value;
    input.setAttribute('list', dataListId);
    input.autocomplete = "true";
    let dl = document1.createElement('datalist');
    dl.id = dataListId;
    dataList.forEach((e)=>{
        let option = document1.createElement('option');
        option.value = e;
        dl.appendChild(option);
    });
    input.appendChild(dl);
    return input;
};
class StoredNodes {
    dict = {
    };
    onRegister = ()=>{
    };
    constructor(){
    }
    tagHashDict = ()=>{
        return Object.fromEntries(Object.entries(this.dict).filter(([key1, value])=>value.type == "TagMeta"
        ).map(([key1, value])=>[
                value.title,
                value
            ]
        ));
    };
    blobHashDict = ()=>{
        return Object.fromEntries(Object.entries(this.dict).filter(([key1, value])=>value.type == "BlobMeta"
        ));
    };
    fetch = async (hash1)=>{
        if (!this.dict[hash1]) {
            const updateNodes = await this.remoteGet(hash1);
            updateNodes.forEach((e)=>this.cache(e)
            );
        }
        return this.dict[hash1];
    };
    update = async (node, optionFormData)=>{
        if (JSON.stringify(node) != JSON.stringify(this.dict[node.hash])) {
            const updateNodes = await this.remotePut(node, optionFormData);
            updateNodes.forEach((e)=>this.cache(e)
            );
            return updateNodes;
        } else {
            return [];
        }
    };
    remotePut = async (node, optionFormData)=>{
        optionFormData.set("meta", JSON.stringify(node));
        console.log({
            ...optionFormData
        });
        const response = await PutRequest("/posts/" + node.hash, optionFormData);
        if (isNull(response)) return [];
        const json = await response.json();
        console.log(json);
        const nodes = Object.values(json).filter((node1)=>{
            const result = Node1.validation(node1);
            if (!result) throw new Error('??????????????????????????????json????????????????????????');
            return result;
        });
        return nodes;
    };
    cache = (e)=>{
        this.dict[e.hash] = e;
        this.onRegister();
    };
    setRemoteGetMethod = (method)=>{
        this.remoteGet = method;
    };
    remoteGet = async (hash1, force = false)=>{
        const pathStruct = metaResourcePath(hash1);
        const path = pathStruct.prefix + pathStruct.hashDir + pathStruct.hash + pathStruct.extention;
        const response = await GetRequest(path);
        if (isNull(response)) return [];
        const json = await response.json();
        console.log(json);
        if (Node1.validation(json)) {
            console.log(`remoteGet: ${json}`);
            const nodeArray = [
                json
            ];
            return nodeArray;
        } else {
            console.warn("Node??????????????????????????????????????????????????????");
            return [];
        }
    };
}
class BlobMeta extends Node1 {
    extention;
    mimeType;
    type = "BlobMeta";
    constructor(hash1, title1, extention, createdAt1, thumbnail1, description1, vector1, mimeType, remoteUri1){
        super(hash1, title1, createdAt1, thumbnail1, description1, vector1, remoteUri1);
        this.extention = extention;
        this.mimeType = mimeType;
        const allhash1 = bufferToHash("blob");
        vector1[allhash1] = vector1[allhash1] ?? {
            tag: 1
        };
    }
    static validation = (meta)=>{
        if (meta.type != "BlobMeta") return false;
        if (isNull(meta.extention)) return false;
        if (isNull(meta.mimeType)) return false;
        if (!Node1.validation(meta)) return false;
        return true;
    };
}
class PriorityQueue {
    items = {
    };
    queue = [];
    length = 0;
    constructor(){
    }
    insert = (item, value, lookupid = null)=>{
        if (lookupid !== null) {
            this.items[lookupid] = {
                item: item,
                value: value
            };
        }
        if (value == Infinity) {
            this.queue.push({
                value: value,
                item: item,
                lookupid: lookupid
            });
            return;
        }
        if (value == -Infinity) {
            this.queue.unshift({
                value: value,
                item: item,
                lookupid: lookupid
            });
        }
        if (this.queue.length === 0) {
            this.queue.push({
                value: value,
                item: item,
                lookupid: lookupid
            });
            return;
        }
        let index = this._binarySearch(value);
        this.queue.splice(index, 0, {
            value: value,
            item: item,
            lookupid: lookupid
        });
        this.length += 1;
    };
    _binarySearch = (ranking)=>{
        let start = 0;
        let end = this.queue.length;
        while(end - start > 1){
            let checkIndex = Math.floor((start + end) / 2);
            if (ranking === this.queue[checkIndex].value) {
                if (checkIndex === 0) {
                    return checkIndex;
                }
                while(checkIndex > 0 && this.queue[checkIndex - 1].value == ranking){
                    checkIndex -= 1;
                }
                return checkIndex;
            }
            if (this.queue[checkIndex].value > ranking) {
                end = checkIndex;
                continue;
            }
            if (this.queue[checkIndex].value < ranking) {
                start = checkIndex;
            }
        }
        if (ranking > this.queue[start].value) {
            return end;
        } else {
            return start;
        }
    };
    hasItem = (lookupid)=>{
        if (this.items[lookupid] != undefined) {
            return true;
        }
        return false;
    };
    getItemByKey = (lookupid)=>{
        return this.items[lookupid];
    };
    getItemByIndex = (index)=>{
        return this.queue[index];
    };
    getIndex = (lookupid)=>{
        let ranking = this.items[lookupid].value;
        let index = this._binarySearch(ranking);
        while(this.queue[index].value == ranking && index + 1 < this.queue.length){
            if (this.queue[index].lookupid === lookupid) {
                return index;
            }
            index += 1;
        }
        return -1;
    };
    replace = (newItem, newValue, lookupid)=>{
        this.delete(lookupid);
        this.insert(newItem, newValue, lookupid);
    };
    delete = (lookupid)=>{
        if (this.hasItem(lookupid)) {
            let index = this.getIndex(lookupid);
            this.queue.splice(index, 1);
            delete this.items[lookupid];
            this.length -= 1;
        }
    };
    dequeue = ()=>{
        let output = this.queue.shift();
        if (this.items[output.lookupid]) {
            delete this.items[output.lookupid];
        }
        return output;
    };
}
class Graph {
    static contexts = {
    };
    static getContext(id) {
        return Graph.contexts[id];
    }
    static Clear(contextid) {
        let o = Object.values(Graph.getContext(contextid).objs);
        o.map((obj)=>{
            obj.delete();
        });
    }
    static load(jsonString, canvasid) {
        function functionfy(key1, value) {
            if (typeof value === 'string') {
                if (value.indexOf('function') === 0 || value.indexOf(")=>") !== -1) {
                    let functionTemplate = `(${value})`;
                    return eval(functionTemplate);
                }
            }
            return value;
        }
        let context = JSON.parse(jsonString, functionfy);
        context.canvas = document.getElementById(canvasid);
        context.ctx = context.canvas.getContext('2d');
        let id_time = new Date().getTime().toString();
        let id_random = Math.round(Math.random() * 9999999).toString();
        context.id = Number(id_time + id_random);
        let edgeKeys = Object.keys(context.edges);
        for(let i1 = 0; i1 < edgeKeys.length; i1++){
            context.edges[edgeKeys[i1]].contextid = context.id;
        }
        let objKeys = Object.keys(context.objs);
        for(let i2 = 0; i2 < objKeys.length; i2++){
            context.objs[objKeys[i2]].contextid = context.id;
        }
        return new Graph(canvasid, context.fps, context.editable, context.buildable, context);
    }
    constructor(canvasid, fps1 = 60, editable = true, buildable = true, loadContext = null, activateNodeCallback1 = (deActivateNode, activateNode)=>{
    }, deActivateNodeCallback1 = (deActivateNode)=>{
    }, doubleClickedNodeCallback1 = (doubleClickedNode)=>{
    }){
        this.canvas = document.getElementById(canvasid);
        this.ctx = this.canvas.getContext('2d');
        this.objs = {
        };
        this.edges = {
        };
        this.vars = {
        };
        let id_time = new Date().getTime().toString();
        let id_random = Math.round(Math.random() * 9999999).toString();
        this.id = Number(id_time + id_random);
        this.nodeCreatedCallback = ()=>{
        };
        this.connectionCreatedCallback = ()=>{
        };
        this.connectionSetupCallback = ()=>{
        };
        this.nodeSetupCallback = ()=>{
        };
        this.tickCallback = ()=>{
        };
        this.activateNodeCallback = activateNodeCallback1;
        this.deActivateNodeCallback = deActivateNodeCallback1;
        this.doubleClickedNodeCallback = doubleClickedNodeCallback1;
        this.editable = editable;
        this.fps = fps1;
        this.buildable = buildable;
        if (loadContext !== null) {
            this.edges = loadContext.edges;
            this.vars = loadContext.vars;
            this.objs = loadContext.objs;
            this.id = loadContext.id;
            this.tickCallback = loadContext.tickCallback;
            this.nodeSetupCallback = loadContext.nodeSetupCallback;
            this.connectionCreatedCallback = loadContext.connectionCreatedCallback;
            this.connectionSetupCallback = loadContext.connectionSetupCallback;
            this.nodeCreatedCallback = loadContext.nodeCreatedCallback;
        }
        Graph.contexts[this.id] = this;
        if (this.fps == null) {
            this.fps = 60;
        }
        if (this.editable == true) {
            this.check_mouse();
            this.activate_editing(this.fps);
        }
        if (this.buildable == true) {
            this.activate_building();
        }
        if (loadContext !== null) {
            for(let edgeid in this.edges){
                this.connectionSetupCallback(this.edges[edgeid]);
            }
            for(let nodeid in this.objs){
                this.nodeSetupCallback(this.objs[nodeid]);
            }
        }
    }
    setNodeCreatedCallback(func) {
        this.nodeCreatedCallback = func;
    }
    setConnectionCreatedCallback(func) {
        this.connectionCreatedCallback = func;
    }
    setTickCallback(func) {
        this.tickCallback = func;
    }
    setNodeSetupCallback(func) {
        this.nodeSetupCallback = func;
    }
    setConnectionSetupCallback(func) {
        this.connectionCreatedCallback = func;
    }
    save() {
        let methodCathcer = function(key1, value) {
            if (typeof value === "function") {
                return value.toString();
            }
            return value;
        };
        return JSON.stringify(this, methodCathcer);
    }
    getChildrenByText(text) {
        return Object.values(this.objs).filter((node)=>node.text === text
        );
    }
    getEdge(parentid, childid) {
        for (let edge of Object.values(this.edges)){
            if (edge.startNodeid === parentid && edge.endNodeid === childid) {
                return this.edges[edge.id];
            }
            if (edge.isBiDirectional()) {
                if (edge.endNodeid === parentid && edge.startNodeid === childid) {
                    return this.edges[edge.id];
                }
            }
        }
        return false;
    }
    drawLoop(bezierControlPointsX, bezierControlPointsY, text = "", directional = false) {
        this.ctx.beginPath();
        this.addBezierCurveToPath(bezierControlPointsX, bezierControlPointsY);
        this.ctx.closePath();
        this.ctx.stroke();
        if (text !== null && text !== "") {
            let midPointX = Graph.calculateMidPointOfBezierCurve(bezierControlPointsX);
            let midPointY = Graph.calculateMidPointOfBezierCurve(bezierControlPointsY);
            this.addTextOverClearBox(midPointX, midPointY, text);
        }
    }
    addTextOverClearBox(centerX, centerY, text) {
        let textLength = this.ctx.measureText(text).width;
        let textHeight = this.ctx.measureText("M").width;
        this.ctx.clearRect(centerX - textLength / 2 - 4, centerY - textHeight / 2 - 8, textLength + 4, textHeight + 8);
        this.ctx.fillText(text, centerX - 2, centerY + 4);
    }
    static calculateMidPointOfBezierCurve(controlPoints) {
        return controlPoints[0] * 1 / 8 + controlPoints[1] * 3 / 8 + controlPoints[2] * 3 / 8 + controlPoints[3] * 1 / 8;
    }
    addBezierCurveToPath(xs, ys) {
        this.ctx.moveTo(xs[0], ys[0]);
        this.ctx.bezierCurveTo(xs[1], ys[1], xs[2], ys[2], xs[3], ys[3]);
    }
    drawArrow(x1, y1, x2, y2, text = "", directional = false) {
        let headlen = 0;
        if (directional) {
            headlen = 10;
        }
        let angle = Math.atan2(y2 - y1, x2 - x1);
        if (text === null || text === "") {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
            this.ctx.moveTo(x2, y2);
            this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
            this.ctx.closePath();
            this.ctx.stroke();
        } else {
            let midPointX = (x1 + x2) / 2;
            let midPointY = (y1 + y2) / 2;
            let slope = (y2 - y1) / (x2 - x1);
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(midPointX, midPointY);
            this.ctx.moveTo(midPointX, midPointY);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
            this.ctx.moveTo(x2, y2);
            this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
            this.ctx.closePath();
            this.ctx.stroke();
            this.addTextOverClearBox(midPointX, midPointY, text);
        }
    }
    getConnectionMode() {
        return this.connectionMode;
    }
    setDirectional() {
        this.connectionMode = "directional";
    }
    setBiDirectional() {
        this.connectionMode = "biDirectional";
    }
    activate_building() {
        this.connectionMode = "biDirectional";
        this.canvas.addEventListener("contextmenu", (e)=>e.preventDefault()
        );
        this.building = false;
        this.canvas.addEventListener("mousedown", click_down.bind(this));
        document.addEventListener("keydown", capture.bind(this));
        this.canvas.addEventListener("mouseup", release_click.bind(this));
        this.start = {
            "x": null,
            "y": null
        };
        let action = null;
        function release_click(e) {
            if (e.which == 2) {
                return "";
            }
            if (e.which == 1) {
                if (this.building) {
                    let x_dist = Math.pow(this.mousex - this.building_start[0], 2);
                    let y_dist = Math.pow(this.mousey - this.building_start[1], 2);
                    let dist = Math.sqrt(x_dist + y_dist);
                    let newNode = this.node(this.building_start[0], this.building_start[1], dist, "");
                    this.nodeCreatedCallback(newNode);
                    this.building = false;
                }
            }
            if (e.which == 3) {
                if (this.active != null && this.start["start_node"]) {
                    let existingEdge = this.getEdge(this.start["start_node"].id, this.active.id);
                    if (!existingEdge) {
                        let newEdge = null;
                        if (this.connectionMode === "biDirectional") {
                            newEdge = this.start["start_node"].connect(this.active);
                        } else if (this.connectionMode === "directional") {
                            newEdge = this.start["start_node"].connect(this.active, "", true);
                        }
                        if (newEdge) {
                            this.connectionCreatedCallback(newEdge);
                        }
                    }
                }
                this.connecting = false;
                this.start = {
                    "x": null,
                    "y": null
                };
            }
        }
        function click_down(e) {
            if (e.which == 2) {
                return "";
            }
            if (e.which == 1) {
                if (this.active == null) {
                    this.building = true;
                    this.building_start = [
                        this.mousex,
                        this.mousey
                    ];
                }
            }
            if (e.which == 3) {
                this.start = {
                    "x": null,
                    "y": null
                };
                this.start = {
                    "x": this.mousex,
                    "y": this.mousey,
                    "active": this.active
                };
                if (this.active != null && this.active.type === "node") {
                    this.connecting = false;
                    this.start["action"] = "connect";
                    this.start["start_node"] = this.active;
                    this.connecting = true;
                } else {
                    this.connecting = false;
                }
            }
        }
        function capture(e) {
            let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+~\\/?<>'" + '".,;:~`[]{}|-= ';
            if (this.active != null) {
                if (letters.indexOf(e.key) > -1) {
                    e.output = e.key;
                }
                if (e.key == "Delete") {
                    this.active.delete();
                }
                if (e.key === " ") {
                    e.preventDefault();
                }
                if (e.key == "Backspace") {
                    e.preventDefault();
                    this.active.setText(this.active.text.substring(0, this.active.text.length - 1));
                    e.output = "";
                }
                if (e.output) {
                    this.active.text += e.output;
                }
            }
        }
    }
    check_mouse() {
        let rect = this.canvas.getBoundingClientRect();
        this.offsetx = rect.left;
        this.offsety = rect.top;
        this.active = null;
        this.mouse_activated = true;
        function check(e) {
            this.mousex = e.x - rect.left;
            this.mousey = e.y - rect.top + this.px_down;
            for (let node of Object.values(this.objs)){
                if (node.inside(this.mousex, this.mousey)) {
                    document.body.style.cursor = "pointer";
                    this.active = node;
                    return;
                }
            }
            for (let edge of Object.values(this.edges)){
                if (edge.inside(this.mousex, this.mousey)) {
                    document.body.style.cursor = "pointer";
                    this.active = edge;
                    edge.selected = true;
                    return;
                } else {
                    if (edge.selected) {
                        edge.selected = false;
                    }
                }
            }
            document.body.style.cursor = "default";
            this.active = null;
        }
        function adjust_scoll(e) {
            this.px_down = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        }
        this.px_down = 0;
        this.pointing_check = check.bind(this);
    }
    depthFirstSearch(startid, endid, draw_path, delay = 0) {
        console.log("inside function");
        let discovered_stack = [
            {
                "nodeid": startid,
                "parentid": startid
            }
        ];
        let visited = {
        };
        function getPath(nodeobj, draw_path = true) {
            let path = [];
            while(nodeobj.nodeid !== nodeobj.parentid){
                if (draw_path) {
                    this.getEdge(nodeobj.parentid, nodeobj.nodeid).setColor("red");
                }
                path.unshift(nodeobj.nodeid);
                nodeobj = visited[nodeobj.parentid];
            }
            return path;
        }
        getPath = getPath.bind(this);
        let evaulateNode = function(nodeobject) {
            console.log("here");
            if (visited.hasOwnProperty(nodeobject.nodeid)) {
                return evaulateNode(discovered_stack.shift());
            }
            if (nodeobject.nodeid === endid) {
                return getPath(nodeobject);
            }
            visited[nodeobject.nodeid] = nodeobject;
            let currentNode = this.getNodeById(nodeobject.nodeid);
            let childrenObjs = currentNode.children.map((nodeid)=>{
                return {
                    nodeid: nodeid,
                    parentid: currentNode.id
                };
            });
            discovered_stack.unshift(...childrenObjs);
            evaulateNode(discovered_stack.shift());
        };
        evaulateNode = evaulateNode.bind(this);
        return evaulateNode(discovered_stack.shift());
    }
    breadthFirstSearch(startid, endid, draw_path, delay = 0) {
        console.log("inside function");
        let start = this.getNodeById(startid);
        let end = this.getNodeById(endid);
        let discovered = [
            {
                node: startid,
                parent: startid
            }
        ];
        let visited = {
        };
        function getPath(nodeobj, draw_path = true) {
            let path = [];
            while(nodeobj.node !== nodeobj.parent){
                if (draw_path) {
                    this.getEdge(nodeobj.parent, nodeobj.node).setColor("red");
                }
                path.unshift(nodeobj.node);
                nodeobj = visited[nodeobj.parent];
            }
            return path;
        }
        getPath = getPath.bind(this);
        console.log(discovered);
        for(let i1 = 0; i1 < discovered.length; i1++){
            if (visited.hasOwnProperty(discovered[i1].node)) {
                continue;
            }
            if (discovered[i1].node === endid) {
                return getPath(discovered[i1], draw_path = draw_path);
            } else {
                let currentNode = this.getNodeById(discovered[i1].node);
                let childrenObjs = currentNode.children.map((nodeid)=>{
                    return {
                        node: nodeid,
                        parent: discovered[i1].node
                    };
                });
                discovered.push(...childrenObjs);
                visited[discovered[i1].node] = discovered[i1];
            }
        }
    }
    Astar(startid, endid, draw_path = true, delay = 0) {
        let start = this.getNodeById(startid);
        let end = this.getNodeById(endid);
        let visited = {
        };
        let data = {
        };
        let discovered = new PriorityQueue();
        function dataCard(nodeid, viaid, cost, distance) {
            this.nodeid = nodeid;
            this.cost = cost;
            this.viaid = viaid;
            this.distance = distance;
        }
        function evaluateNode(nodeid, cost) {
            if (visited[nodeid] !== undefined) {
                return;
            }
            let root = this.getNodeById(nodeid);
            for(let i1 = 0; i1 < root.children.length; i1++){
                let node = this.getNodeById(root.children[i1]);
                if (visited[node.id] !== undefined) {
                    continue;
                }
                let edge = this.getEdge(root.id, node.id);
                let weight = edge.weight;
                let card = new dataCard(node.id, root.id, cost + weight, Math.floor(this.getDistance(root.id, end.id)) - 1);
                let key1 = node.id;
                if (discovered.hasItem(key1)) {
                    let oldItem = discovered.getItemByKey(key1);
                    if (oldItem.item.cost > card.cost) {
                        discovered.replace(card, card.cost, key1);
                    }
                } else {
                    discovered.insert(card, card.cost + card.distance, key1);
                }
            }
        }
        evaluateNode = evaluateNode.bind(this);
        discovered.insert(new dataCard(startid, startid, 0), 0);
        while(discovered.queue.length > 0){
            let current_node = discovered.dequeue();
            if (current_node.item.nodeid === endid) {
                let output = {
                    cost: current_node.item.cost,
                    path: []
                };
                output.path.unshift(current_node.item.nodeid);
                while(current_node.item.nodeid !== startid){
                    current_node = visited[current_node.item.viaid];
                    output.path.unshift(current_node.item.nodeid);
                }
                if (draw_path) {
                    for(let i1 = 0; i1 < output.path.length - 1; i1++){
                        this.getEdge(output.path[i1], output.path[i1 + 1]).setColor("red");
                    }
                }
                return output;
            }
            let nodeid = current_node.item.nodeid;
            evaluateNode(current_node.item.nodeid, current_node.item.cost);
            visited[nodeid] = current_node;
        }
    }
    diijkstra(startid, endid, draw_path = true) {
        let start = this.getNodeById(startid);
        let end = this.getNodeById(endid);
        let visited = {
        };
        let data = {
        };
        let discovered = new Graph.priorityQueue();
        function dataCard(nodeid, viaid, cost) {
            this.nodeid = nodeid;
            this.cost = cost;
            this.viaid = viaid;
        }
        function evaluateNode(nodeid, cost) {
            if (visited[nodeid] !== undefined) {
                return;
            }
            let root = this.getNodeById(nodeid);
            for(let i1 = 0; i1 < root.children.length; i1++){
                let node = this.getNodeById(root.children[i1]);
                if (visited[node.id] !== undefined) {
                    continue;
                }
                let edge = this.getEdge(root.id, node.id);
                let weight = edge.weight;
                let card = new dataCard(node.id, root.id, cost + weight);
                let key1 = node.id;
                if (discovered.hasItem(key1)) {
                    let oldItem = discovered.getItemByKey(key1);
                    if (oldItem.item.cost > card.cost) {
                        discovered.replace(card, card.cost, key1);
                    }
                } else {
                    discovered.insert(card, card.cost, key1);
                }
            }
        }
        evaluateNode = evaluateNode.bind(this);
        discovered.insert(new dataCard(startid, startid, 0), 0);
        while(discovered.queue.length > 0){
            let current_node = discovered.dequeue();
            if (current_node.item.nodeid === endid) {
                let output = {
                    cost: current_node.item.cost,
                    path: []
                };
                output.path.unshift(current_node.item.nodeid);
                while(current_node.item.nodeid !== startid){
                    current_node = visited[current_node.item.viaid];
                    output.path.unshift(current_node.item.nodeid);
                }
                if (draw_path) {
                    for(let i1 = 0; i1 < output.path.length - 1; i1++){
                        this.getEdge(output.path[i1], output.path[i1 + 1]).setColor("red");
                    }
                }
                return output;
            }
            let nodeid = current_node.item.nodeid;
            evaluateNode(current_node.item.nodeid, current_node.item.cost);
            visited[nodeid] = current_node;
        }
    }
    update() {
        let nodes = Object.values(this.objs);
        nodes.map((node)=>node.update()
        );
        this.drawEdges();
        if (this.connecting) {
            let yflipper = 1;
            let xflipper = 1;
            let slope = (this.mousey - this.start.active.y) / (this.mousex - this.start.active.x);
            if (this.mousex <= this.start.active.x) {
                xflipper = -1;
                yflipper = -1;
            }
            this.start.start_node.arrow(this.mousex, this.mousey);
        }
        if (this.building) {
            this.ctx.strokeStyle = "#000";
            this.ctx.beginPath();
            let x_dist = Math.pow(this.mousex - this.building_start[0], 2);
            let y_dist = Math.pow(this.mousey - this.building_start[1], 2);
            let dist = Math.sqrt(x_dist + y_dist);
            this.ctx.arc(this.building_start[0], this.building_start[1], dist, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        this.tickCallback(this);
    }
    getNodeById(id) {
        return this.objs[id];
    }
    getEdgeById(id) {
        return this.edges[id];
    }
    drawEdges() {
        for (let edge of Object.values(this.edges)){
            this.ctx.strokeStyle = this.color;
            edge.draw();
        }
    }
    getDistance(startNodeId, endNodeId) {
        let start = this.getNodeById(startNodeId);
        let end = this.getNodeById(endNodeId);
        return Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
    }
    activate_editing(fps) {
        let dragging = false;
        let xdist = null;
        let ydist = null;
        let main_node = null;
        if (this.mouse_activated !== true) {
            throw "mouse must be first initilized";
        }
        function start_dragging(e) {
            if (e.which == 2 || e.which == 3) {
                return "";
            }
            if (this.active) {
                xdist = this.active.x - this.mousex;
                ydist = this.active.y - this.mousey;
                const deactivateNode = main_node;
                main_node = this.active;
                main_node.color = this.activeColor;
                this.deActivateNodeCallback(deactivateNode);
                this.activateNodeCallback(deactivateNode, main_node);
                dragging = true;
            }
        }
        function end_dragging(e) {
            if (e.which == 2 || e.which == 3) {
                return "";
            }
            dragging = false;
        }
        function mainloop() {
            if (dragging) {
                main_node.x = this.mousex + xdist;
                main_node.y = this.mousey + ydist;
                let prevx = this.mousex;
                let prevy = this.mousey;
            }
            this.update();
        }
        this.drag_start = start_dragging.bind(this);
        this.drag_end = end_dragging.bind(this);
        this.draw = mainloop.bind(this);
    }
    doubleClick = (e)=>{
        if (e.which == 2 || e.which == 3) {
            return "";
        }
        if (this.active) {
            this.doubleClickedNodeCallback(this.active);
        }
    };
    draw = ()=>{
    };
    drag_start = (e)=>{
    };
    drag_end = (e)=>{
    };
    pointing_check = (e)=>{
    };
    edge(startNodeid, endNodeid, color = "#aaa", text = "", directional = false) {
        return Graph._edge(this.id, startNodeid, endNodeid, color, text, directional);
    }
    node(x, y, r, text = "", hash = "") {
        const node = Graph._node(this.id, x, y, r, text, hash);
        this.nodeSetupCallback(node);
        return node;
    }
}
class Edge {
    type = "edge";
    slope;
    color = "rgb(0,0,0)";
    altColor = "rgb(255,0,0)";
    selected = false;
    constructor(contextid, startNodeid, endNodeid, color, text, directional1){
        this.contextid = contextid;
        this.startNodeid = startNodeid;
        this.endNodeid = endNodeid;
        let id_time1 = new Date().getTime();
        this.id = Number(id_time1.toString() + Object.values(Graph.getContext(this.contextid).edges).length.toString() + Math.random().toString());
        this.text = text;
        this.weight = parseFloat(text);
        if (isNaN(this.weight)) {
            this.weight = 0;
        }
        this.directional = directional1;
        let start = Graph.getContext(this.contextid).getNodeById(startNodeid);
        start.edges[this.id] = this.endNodeid;
        if (!this.directional) {
            let end = Graph.getContext(this.contextid).getNodeById(endNodeid);
            end.edges[this.id] = this.startNodeid;
        }
    }
    isDirectional = ()=>{
        return this.directional === true;
    };
    setText = (text1)=>{
        this.text = text1;
        this.weight = parseFloat(text1) || 0;
    };
    toggleSelected = ()=>{
        if (this.selected) {
            this.selected = false;
        } else {
            this.selected = true;
        }
    };
    isBiDirectional = ()=>{
        if (this.directional === false) {
            return true;
        }
        return false;
    };
    setDirectional = ()=>{
        this.directional = true;
    };
    setUndirectional = ()=>{
        this.directional = false;
    };
    setWeight = (weight)=>{
        this.weight = weight;
    };
    delete = ()=>{
        let context = Graph.getContext(this.contextid);
        let start1 = context.getNodeById(this.startNodeid);
        let end = context.getNodeById(this.endNodeid);
        delete start1.edges[this.id];
        delete end.edges[this.id];
        for(let i1 = 0; i1 < start1.children.length; i1++){
            if (start1.children[i1] === this.endNodeid) {
                start1.children.splice(i1, 1);
                break;
            }
        }
        if (this.isBiDirectional()) {
            for(let i2 = 0; i2 < end.children.length; i2++){
                if (end.children[i2] === this.startNodeid) {
                    end.children.splice(i2, 1);
                    break;
                }
            }
        }
        delete context.edges[this.id];
        delete this;
    };
    setColor = (color1)=>{
        this.color = color1;
    };
    getStartid = ()=>{
        return this.startNodeid;
    };
    getEndid = ()=>{
        return this.endNodeid;
    };
    _updateValues = (slope = null)=>{
        let context = Graph.getContext(this.contextid);
        let start1 = context.getNodeById(this.startNodeid);
        let end = context.getNodeById(this.endNodeid);
        if (slope === null) {
            this.slope = (end.y - start1.y) / (end.x - start1.x);
        } else {
            this.slope = slope;
        }
        let xflip = 1;
        let yflip = 1;
        if (start1.x >= end.x) {
            yflip = -1;
            xflip = -1;
        }
        if (this.slope === Infinity) {
            yflip *= -1;
        }
        if (this.slope === -Infinity) {
            yflip *= -1;
        }
        let angleOffset = 0;
        let oppositeEdge = context.getEdge(this.endNodeid, this.startNodeid);
        if (this.isDirectional() && oppositeEdge) {
            angleOffset = 2 * Math.PI / 16;
        }
        this.xstart = start1.x + xflip * (Math.cos(angleOffset + Math.atan(this.slope)) * start1.r);
        this.ystart = start1.y + yflip * (Math.sin(angleOffset + Math.atan(this.slope)) * start1.r);
        this.xend = end.x - xflip * (Math.cos(-angleOffset + Math.atan(this.slope)) * end.r);
        this.yend = end.y - yflip * (Math.sin(-angleOffset + Math.atan(this.slope)) * end.r);
        if (isNaN(parseFloat(this.text))) {
            this.setWeight(0);
        } else {
            this.weight = parseFloat(this.text);
        }
    };
    getSelfLoopBezierControlPointsX = ()=>{
        let context = Graph.getContext(this.contextid);
        let node = context.getNodeById(this.startNodeid);
        let x = node.x + node.r / Math.sqrt(2);
        return [
            x,
            x + node.r * 2,
            x,
            x
        ];
    };
    getSelfLoopBezierControlPointsY = ()=>{
        let context = Graph.getContext(this.contextid);
        let node = context.getNodeById(this.startNodeid);
        let y = node.y - node.r / Math.sqrt(2);
        return [
            y,
            y,
            y - node.r * 2,
            y
        ];
    };
    draw = ()=>{
        this._updateValues();
        let context = Graph.getContext(this.contextid);
        let temp_color = context.ctx.strokeStyle;
        if (this.selected) {
            context.ctx.strokeStyle = this.altColor;
        } else {
            context.ctx.strokeStyle = this.color;
        }
        if (this.startNodeid == this.endNodeid) {
            let xs = this.getSelfLoopBezierControlPointsX();
            let ys = this.getSelfLoopBezierControlPointsY();
            context.drawLoop(xs, ys, this.text, this.directional);
        } else {
            context.drawArrow(this.xstart, this.ystart, this.xend, this.yend, this.text, this.directional);
        }
        context.ctx.strokeStyle = temp_color;
    };
    _pointDistance = (x, y)=>{
        function sqr(x1) {
            return x1 * x1;
        }
        function dist2(v, w) {
            return sqr(v.x - w.x) + sqr(v.y - w.y);
        }
        function distToSegmentSquared(p, v, w) {
            var l2 = dist2(v, w);
            if (l2 == 0) return dist2(p, v);
            var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            return dist2(p, {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y)
            });
        }
        function distToSegment(p, v, w) {
            return Math.sqrt(distToSegmentSquared(p, v, w));
        }
        let p = {
            x: x,
            y: y
        };
        let v = {
            x: this.xstart,
            y: this.ystart
        };
        let w = {
            x: this.xend,
            y: this.yend
        };
        return distToSegment(p, v, w);
    };
    isOnSelfLoop = (x, y)=>{
        function isBetween(x1, a, b) {
            return a <= x1 && x1 <= b || b <= x1 && x1 <= a;
        }
        let xs = this.getSelfLoopBezierControlPointsX();
        let ys = this.getSelfLoopBezierControlPointsY();
        let midPointX = Graph.calculateMidPointOfBezierCurve(xs);
        let midPointY = Graph.calculateMidPointOfBezierCurve(ys);
        return isBetween(x, xs[0], midPointX) && isBetween(y, ys[0], midPointY);
    };
    inside = (x, y, yoffset, xoffset, sensitivity = 3)=>{
        if (!yoffset) {
            yoffset = 0;
        }
        if (!xoffset) {
            xoffset = 0;
        }
        if (this.startNodeid == this.endNodeid) {
            if (this.isOnSelfLoop(x + xoffset, y + yoffset)) {
                return true;
            }
        } else {
            if (this._pointDistance(x + xoffset, y + yoffset) < sensitivity + 1) {
                return true;
            }
        }
        return false;
    };
}
Graph._edge = function(contextid1, startNodeid1, endNodeid1, color1 = "#000", text1 = "", directional1 = false) {
    return new Edge(contextid1, startNodeid1, endNodeid1, color1, text1, directional1);
};
Graph._node = (contextid1, x, y, r, text1 = "", hash3 = "")=>{
    return new Node2(contextid1, x, y, r, text1, hash3);
};
class Node2 {
    type = "node";
    children = [];
    edges = {
    };
    root = true;
    active = false;
    value = null;
    func = null;
    args = [];
    time = new Date().getTime().toString();
    image = null;
    hash = "";
    constructor(contextid1, x, y, r, text1 = "", hash3 = ""){
        this.contextid = contextid1;
        this.x = x;
        this.y = y;
        this.r = r;
        this.id = Number(this.time + Object.keys(Graph.getContext(this.contextid).objs).length + Math.floor(Math.random() * 9999));
        this.color = "rgb(0,0,0)";
        this.text_color = "rgb(0,0,0)";
        this.activeColor = "rgb(255,0,0)";
        this.text = text1;
        this.active = false;
        const context = Graph.getContext(this.contextid);
        this.hash = hash3;
        context.objs[this.id] = this;
        this.build();
        if (this.text in Graph.functions) {
            this.func = Graph.functions[this.text];
        }
    }
    delete = ()=>{
        let context1 = Graph.getContext(this.contextid);
        for (let edge of Object.values(context1.edges)){
            if (edge.startNodeid === this.id || edge.endNodeid === this.id) {
                delete context1.edges[edge.id];
            }
        }
        context1.active = null;
        let temp_id = this.id;
        delete context1.objs[this.id];
        for (let n of Object.values(context1.objs)){
            let position = n.children.indexOf(temp_id);
            if (position !== -1) {
                n.children.splice(position, 1);
            }
        }
    };
    getEdges = ()=>{
        return this.edges;
    };
    setColor = (newColor)=>{
        this.color = newColor;
    };
    setActiveColor = (newColor)=>{
        this.activeColor = newColor;
    };
    setText = (text2)=>{
        this.text = text2;
    };
    update = ()=>{
        this.build();
    };
    setImage = async (url)=>{
        function createImage(url1) {
            return new Promise(function(resolve, reject) {
                let img = new Image();
                img.onload = ()=>{
                    resolve(img);
                };
                img.onerror = ()=>{
                    console.log("image load error");
                    reject();
                };
                img.src = url1;
            });
        }
        this.image = await createImage(url);
    };
    build = ()=>{
        let context1 = Graph.getContext(this.contextid);
        if (this.active) {
            context1.ctx.lineWidth = 10;
        } else {
            context1.ctx.linewidth = 1;
        }
        context1.ctx.strokeStyle = this.color;
        if (context1.active == this) {
            context1.ctx.strokeStyle = this.activeColor;
        }
        if (this.func !== null) {
            this.text_color = "#FF0000";
        }
        const forcusR = this.r * 1.4;
        context1.ctx.textAlign = "center";
        context1.ctx.font = "15px Arial";
        context1.ctx.beginPath();
        if (context1.active == this) {
            context1.ctx.arc(this.x, this.y, forcusR, 0, 2 * Math.PI);
        } else {
            context1.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        }
        context1.ctx.closePath();
        context1.ctx.stroke();
        if (this.image) {
            context1.ctx.save();
            context1.ctx.beginPath();
            if (context1.active == this) {
                context1.ctx.arc(this.x, this.y, forcusR, 0, Math.PI * 2, true);
            } else {
                context1.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
            }
            context1.ctx.closePath();
            context1.ctx.clip();
            if (context1.active == this) {
                context1.ctx.drawImage(this.image, this.x - forcusR, this.y - forcusR, forcusR * 2, forcusR * 2);
            } else {
                context1.ctx.drawImage(this.image, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
            }
            context1.ctx.beginPath();
            if (context1.active == this) {
                context1.ctx.arc(this.x, this.y, forcusR, 0, Math.PI * 2, true);
            } else {
                context1.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
            }
            context1.ctx.clip();
            context1.ctx.closePath();
            context1.ctx.restore();
        }
        let temp = context1.ctx.fillStyle;
        context1.ctx.fillStyle = this.text_color;
        context1.ctx.fillText(this.text, this.x, this.y);
        context1.ctx.fillStyle = temp;
    };
    connect = (n, text2 = "", directional1 = false)=>{
        let context1 = Graph.getContext(this.contextid);
        if (n.type !== "node") {
            return false;
        }
        this.children.push(n.id);
        if (directional1 === false) {
            n.children.push(this.id);
        }
        let edge = context1.edge(this.id, n.id, "#000", text2, directional1);
        this.edges[edge.id];
        context1.edges[edge.id] = edge;
        n.kill_root();
        context1.drawEdges();
        return edge;
    };
    biDirectional = (n, text2 = "")=>{
        return this.connect(n, text2);
    };
    directional = (n, text2 = "")=>{
        return this.connect(n, text2, true);
    };
    kill_root = ()=>{
        this.root = false;
    };
    arrow = (x2, y2, text2)=>{
        let context1 = Graph.getContext(this.contextid);
        let xflip = 1;
        let yflip = 1;
        if (this.x >= x2) {
            yflip = -1;
            xflip = -1;
        }
        let slope = (y2 - this.y) / (x2 - this.x);
        if (slope === Infinity) {
            yflip *= -1;
        }
        if (slope === -Infinity) {
            yflip *= -1;
        }
        let xstart = this.x + xflip * Math.cos(Math.atan(slope)) * this.r;
        let ystart = this.y + yflip * Math.sin(Math.atan(slope)) * this.r;
        context1.drawArrow(xstart, ystart, x2, y2, text2 = text2);
    };
    inside = (x1, y1, yoffset, xoffset)=>{
        function distance(x11, x2, y11, y2) {
            return Math.sqrt(Math.pow(x2 - x11, 2) + Math.pow(y2 - y11, 2));
        }
        if (yoffset == null) {
            yoffset = 0;
        }
        if (xoffset == null) {
            xoffset = 0;
        }
        if (distance(this.x + xoffset, x1, this.y, y1 + yoffset) < this.r) {
            return true;
        } else {
            return false;
        }
    };
}
Graph.functions = {
};
const HEX_CHARS1 = "0123456789abcdef".split("");
const EXTRA1 = [
    -2147483648,
    8388608,
    32768,
    128
];
const SHIFT1 = [
    24,
    16,
    8,
    0
];
const blocks1 = [];
class Sha1 {
    #blocks;
    #block;
    #start;
    #bytes;
    #hBytes;
    #finalized;
    #hashed;
    #h0 = 1732584193;
    #h1 = 4023233417;
    #h2 = 2562383102;
    #h3 = 271733878;
    #h4 = 3285377520;
    #lastByteIndex = 0;
    constructor(sharedMemory3 = false){
        this.init(sharedMemory3);
    }
    init(sharedMemory) {
        if (sharedMemory) {
            blocks1[0] = blocks1[16] = blocks1[1] = blocks1[2] = blocks1[3] = blocks1[4] = blocks1[5] = blocks1[6] = blocks1[7] = blocks1[8] = blocks1[9] = blocks1[10] = blocks1[11] = blocks1[12] = blocks1[13] = blocks1[14] = blocks1[15] = 0;
            this.#blocks = blocks1;
        } else {
            this.#blocks = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ];
        }
        this.#h0 = 1732584193;
        this.#h1 = 4023233417;
        this.#h2 = 2562383102;
        this.#h3 = 271733878;
        this.#h4 = 3285377520;
        this.#block = this.#start = this.#bytes = this.#hBytes = 0;
        this.#finalized = this.#hashed = false;
    }
    update(message) {
        if (this.#finalized) {
            return this;
        }
        let msg;
        if (message instanceof ArrayBuffer) {
            msg = new Uint8Array(message);
        } else {
            msg = message;
        }
        let index = 0;
        const length = msg.length;
        const blocks2 = this.#blocks;
        while(index < length){
            let i1;
            if (this.#hashed) {
                this.#hashed = false;
                blocks2[0] = this.#block;
                blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
            }
            if (typeof msg !== "string") {
                for(i1 = this.#start; index < length && i1 < 64; ++index){
                    blocks2[i1 >> 2] |= msg[index] << SHIFT1[(i1++) & 3];
                }
            } else {
                for(i1 = this.#start; index < length && i1 < 64; ++index){
                    let code = msg.charCodeAt(index);
                    if (code < 128) {
                        blocks2[i1 >> 2] |= code << SHIFT1[(i1++) & 3];
                    } else if (code < 2048) {
                        blocks2[i1 >> 2] |= (192 | code >> 6) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code & 63) << SHIFT1[(i1++) & 3];
                    } else if (code < 55296 || code >= 57344) {
                        blocks2[i1 >> 2] |= (224 | code >> 12) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code >> 6 & 63) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code & 63) << SHIFT1[(i1++) & 3];
                    } else {
                        code = 65536 + ((code & 1023) << 10 | msg.charCodeAt(++index) & 1023);
                        blocks2[i1 >> 2] |= (240 | code >> 18) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code >> 12 & 63) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code >> 6 & 63) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code & 63) << SHIFT1[(i1++) & 3];
                    }
                }
            }
            this.#lastByteIndex = i1;
            this.#bytes += i1 - this.#start;
            if (i1 >= 64) {
                this.#block = blocks2[16];
                this.#start = i1 - 64;
                this.hash();
                this.#hashed = true;
            } else {
                this.#start = i1;
            }
        }
        if (this.#bytes > 4294967295) {
            this.#hBytes += this.#bytes / 4294967296 >>> 0;
            this.#bytes = this.#bytes >>> 0;
        }
        return this;
    }
    finalize() {
        if (this.#finalized) {
            return;
        }
        this.#finalized = true;
        const blocks2 = this.#blocks;
        const i1 = this.#lastByteIndex;
        blocks2[16] = this.#block;
        blocks2[i1 >> 2] |= EXTRA1[i1 & 3];
        this.#block = blocks2[16];
        if (i1 >= 56) {
            if (!this.#hashed) {
                this.hash();
            }
            blocks2[0] = this.#block;
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.#hBytes << 3 | this.#bytes >>> 29;
        blocks2[15] = this.#bytes << 3;
        this.hash();
    }
    hash() {
        let a = this.#h0;
        let b = this.#h1;
        let c = this.#h2;
        let d = this.#h3;
        let e = this.#h4;
        let f;
        let j;
        let t;
        const blocks2 = this.#blocks;
        for(j = 16; j < 80; ++j){
            t = blocks2[j - 3] ^ blocks2[j - 8] ^ blocks2[j - 14] ^ blocks2[j - 16];
            blocks2[j] = t << 1 | t >>> 31;
        }
        for(j = 0; j < 20; j += 5){
            f = b & c | ~b & d;
            t = a << 5 | a >>> 27;
            e = t + f + e + 1518500249 + blocks2[j] >>> 0;
            b = b << 30 | b >>> 2;
            f = a & b | ~a & c;
            t = e << 5 | e >>> 27;
            d = t + f + d + 1518500249 + blocks2[j + 1] >>> 0;
            a = a << 30 | a >>> 2;
            f = e & a | ~e & b;
            t = d << 5 | d >>> 27;
            c = t + f + c + 1518500249 + blocks2[j + 2] >>> 0;
            e = e << 30 | e >>> 2;
            f = d & e | ~d & a;
            t = c << 5 | c >>> 27;
            b = t + f + b + 1518500249 + blocks2[j + 3] >>> 0;
            d = d << 30 | d >>> 2;
            f = c & d | ~c & e;
            t = b << 5 | b >>> 27;
            a = t + f + a + 1518500249 + blocks2[j + 4] >>> 0;
            c = c << 30 | c >>> 2;
        }
        for(; j < 40; j += 5){
            f = b ^ c ^ d;
            t = a << 5 | a >>> 27;
            e = t + f + e + 1859775393 + blocks2[j] >>> 0;
            b = b << 30 | b >>> 2;
            f = a ^ b ^ c;
            t = e << 5 | e >>> 27;
            d = t + f + d + 1859775393 + blocks2[j + 1] >>> 0;
            a = a << 30 | a >>> 2;
            f = e ^ a ^ b;
            t = d << 5 | d >>> 27;
            c = t + f + c + 1859775393 + blocks2[j + 2] >>> 0;
            e = e << 30 | e >>> 2;
            f = d ^ e ^ a;
            t = c << 5 | c >>> 27;
            b = t + f + b + 1859775393 + blocks2[j + 3] >>> 0;
            d = d << 30 | d >>> 2;
            f = c ^ d ^ e;
            t = b << 5 | b >>> 27;
            a = t + f + a + 1859775393 + blocks2[j + 4] >>> 0;
            c = c << 30 | c >>> 2;
        }
        for(; j < 60; j += 5){
            f = b & c | b & d | c & d;
            t = a << 5 | a >>> 27;
            e = t + f + e - 1894007588 + blocks2[j] >>> 0;
            b = b << 30 | b >>> 2;
            f = a & b | a & c | b & c;
            t = e << 5 | e >>> 27;
            d = t + f + d - 1894007588 + blocks2[j + 1] >>> 0;
            a = a << 30 | a >>> 2;
            f = e & a | e & b | a & b;
            t = d << 5 | d >>> 27;
            c = t + f + c - 1894007588 + blocks2[j + 2] >>> 0;
            e = e << 30 | e >>> 2;
            f = d & e | d & a | e & a;
            t = c << 5 | c >>> 27;
            b = t + f + b - 1894007588 + blocks2[j + 3] >>> 0;
            d = d << 30 | d >>> 2;
            f = c & d | c & e | d & e;
            t = b << 5 | b >>> 27;
            a = t + f + a - 1894007588 + blocks2[j + 4] >>> 0;
            c = c << 30 | c >>> 2;
        }
        for(; j < 80; j += 5){
            f = b ^ c ^ d;
            t = a << 5 | a >>> 27;
            e = t + f + e - 899497514 + blocks2[j] >>> 0;
            b = b << 30 | b >>> 2;
            f = a ^ b ^ c;
            t = e << 5 | e >>> 27;
            d = t + f + d - 899497514 + blocks2[j + 1] >>> 0;
            a = a << 30 | a >>> 2;
            f = e ^ a ^ b;
            t = d << 5 | d >>> 27;
            c = t + f + c - 899497514 + blocks2[j + 2] >>> 0;
            e = e << 30 | e >>> 2;
            f = d ^ e ^ a;
            t = c << 5 | c >>> 27;
            b = t + f + b - 899497514 + blocks2[j + 3] >>> 0;
            d = d << 30 | d >>> 2;
            f = c ^ d ^ e;
            t = b << 5 | b >>> 27;
            a = t + f + a - 899497514 + blocks2[j + 4] >>> 0;
            c = c << 30 | c >>> 2;
        }
        this.#h0 = this.#h0 + a >>> 0;
        this.#h1 = this.#h1 + b >>> 0;
        this.#h2 = this.#h2 + c >>> 0;
        this.#h3 = this.#h3 + d >>> 0;
        this.#h4 = this.#h4 + e >>> 0;
    }
    hex() {
        this.finalize();
        const h0 = this.#h0;
        const h1 = this.#h1;
        const h2 = this.#h2;
        const h3 = this.#h3;
        const h4 = this.#h4;
        return HEX_CHARS1[h0 >> 28 & 15] + HEX_CHARS1[h0 >> 24 & 15] + HEX_CHARS1[h0 >> 20 & 15] + HEX_CHARS1[h0 >> 16 & 15] + HEX_CHARS1[h0 >> 12 & 15] + HEX_CHARS1[h0 >> 8 & 15] + HEX_CHARS1[h0 >> 4 & 15] + HEX_CHARS1[h0 & 15] + HEX_CHARS1[h1 >> 28 & 15] + HEX_CHARS1[h1 >> 24 & 15] + HEX_CHARS1[h1 >> 20 & 15] + HEX_CHARS1[h1 >> 16 & 15] + HEX_CHARS1[h1 >> 12 & 15] + HEX_CHARS1[h1 >> 8 & 15] + HEX_CHARS1[h1 >> 4 & 15] + HEX_CHARS1[h1 & 15] + HEX_CHARS1[h2 >> 28 & 15] + HEX_CHARS1[h2 >> 24 & 15] + HEX_CHARS1[h2 >> 20 & 15] + HEX_CHARS1[h2 >> 16 & 15] + HEX_CHARS1[h2 >> 12 & 15] + HEX_CHARS1[h2 >> 8 & 15] + HEX_CHARS1[h2 >> 4 & 15] + HEX_CHARS1[h2 & 15] + HEX_CHARS1[h3 >> 28 & 15] + HEX_CHARS1[h3 >> 24 & 15] + HEX_CHARS1[h3 >> 20 & 15] + HEX_CHARS1[h3 >> 16 & 15] + HEX_CHARS1[h3 >> 12 & 15] + HEX_CHARS1[h3 >> 8 & 15] + HEX_CHARS1[h3 >> 4 & 15] + HEX_CHARS1[h3 & 15] + HEX_CHARS1[h4 >> 28 & 15] + HEX_CHARS1[h4 >> 24 & 15] + HEX_CHARS1[h4 >> 20 & 15] + HEX_CHARS1[h4 >> 16 & 15] + HEX_CHARS1[h4 >> 12 & 15] + HEX_CHARS1[h4 >> 8 & 15] + HEX_CHARS1[h4 >> 4 & 15] + HEX_CHARS1[h4 & 15];
    }
    toString() {
        return this.hex();
    }
    digest() {
        this.finalize();
        const h0 = this.#h0;
        const h1 = this.#h1;
        const h2 = this.#h2;
        const h3 = this.#h3;
        const h4 = this.#h4;
        return [
            h0 >> 24 & 255,
            h0 >> 16 & 255,
            h0 >> 8 & 255,
            h0 & 255,
            h1 >> 24 & 255,
            h1 >> 16 & 255,
            h1 >> 8 & 255,
            h1 & 255,
            h2 >> 24 & 255,
            h2 >> 16 & 255,
            h2 >> 8 & 255,
            h2 & 255,
            h3 >> 24 & 255,
            h3 >> 16 & 255,
            h3 >> 8 & 255,
            h3 & 255,
            h4 >> 24 & 255,
            h4 >> 16 & 255,
            h4 >> 8 & 255,
            h4 & 255, 
        ];
    }
    array() {
        return this.digest();
    }
    arrayBuffer() {
        this.finalize();
        const buffer = new ArrayBuffer(20);
        const dataView = new DataView(buffer);
        dataView.setUint32(0, this.#h0);
        dataView.setUint32(4, this.#h1);
        dataView.setUint32(8, this.#h2);
        dataView.setUint32(12, this.#h3);
        dataView.setUint32(16, this.#h4);
        return buffer;
    }
}
class HmacSha1 extends Sha1 {
    #sharedMemory;
    #inner;
    #oKeyPad;
    constructor(secretKey1, sharedMemory4 = false){
        super(sharedMemory4);
        let key1;
        if (typeof secretKey1 === "string") {
            const bytes = [];
            const length = secretKey1.length;
            let index = 0;
            for(let i1 = 0; i1 < length; i1++){
                let code = secretKey1.charCodeAt(i1);
                if (code < 128) {
                    bytes[index++] = code;
                } else if (code < 2048) {
                    bytes[index++] = 192 | code >> 6;
                    bytes[index++] = 128 | code & 63;
                } else if (code < 55296 || code >= 57344) {
                    bytes[index++] = 224 | code >> 12;
                    bytes[index++] = 128 | code >> 6 & 63;
                    bytes[index++] = 128 | code & 63;
                } else {
                    code = 65536 + ((code & 1023) << 10 | secretKey1.charCodeAt(++i1) & 1023);
                    bytes[index++] = 240 | code >> 18;
                    bytes[index++] = 128 | code >> 12 & 63;
                    bytes[index++] = 128 | code >> 6 & 63;
                    bytes[index++] = 128 | code & 63;
                }
            }
            key1 = bytes;
        } else {
            if (secretKey1 instanceof ArrayBuffer) {
                key1 = new Uint8Array(secretKey1);
            } else {
                key1 = secretKey1;
            }
        }
        if (key1.length > 64) {
            key1 = new Sha1(true).update(key1).array();
        }
        const oKeyPad1 = [];
        const iKeyPad1 = [];
        for(let i1 = 0; i1 < 64; i1++){
            const b = key1[i1] || 0;
            oKeyPad1[i1] = 92 ^ b;
            iKeyPad1[i1] = 54 ^ b;
        }
        this.update(iKeyPad1);
        this.#oKeyPad = oKeyPad1;
        this.#inner = true;
        this.#sharedMemory = sharedMemory4;
    }
    finalize() {
        super.finalize();
        if (this.#inner) {
            this.#inner = false;
            const innerHash = this.array();
            super.init(this.#sharedMemory);
            this.update(this.#oKeyPad);
            this.update(innerHash);
            super.finalize();
        }
    }
}
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
var Q = Object.create, E = Object.defineProperty, X = Object.getPrototypeOf, G = Object.prototype.hasOwnProperty, J = Object.getOwnPropertyNames, K1 = Object.getOwnPropertyDescriptor;
var W = (e)=>E(e, "__esModule", {
        value: !0
    })
;
var g = (e, t)=>()=>(t || e((t = {
            exports: {
            }
        }).exports, t), t.exports)
;
var Y = (e, t, r1)=>{
    if (t && typeof t == "object" || typeof t == "function") for (let n of J(t))!G.call(e, n) && n !== "default" && E(e, n, {
        get: ()=>t[n]
        ,
        enumerable: !(r1 = K1(t, n)) || r1.enumerable
    });
    return e;
}, B = (e)=>Y(W(E(e != null ? Q(X(e)) : {
    }, "default", e && e.__esModule && "default" in e ? {
        get: ()=>e.default
        ,
        enumerable: !0
    } : {
        value: e,
        enumerable: !0
    })), e)
;
var w = g((L)=>{
    function T(e) {
        this.sequences = e.split(/\r?\n/), this.totalLines = this.sequences.length, this.lineNumber = 0;
    }
    T.prototype.peekNextLine = function() {
        return this.hasNext() ? this.sequences[this.lineNumber] : null;
    };
    T.prototype.getNextLine = function() {
        return this.hasNext() ? this.sequences[this.lineNumber++] : null;
    };
    T.prototype.hasNext = function() {
        return this.lineNumber < this.totalLines;
    };
    typeof L != "undefined" && (L.Stream = T);
});
var S = g((R)=>{
    var u = {
        rules: {
        },
        define: function(e, t) {
            this.rules[e] = t;
            var r1 = "is" + e.substring(0, 1).toUpperCase() + e.substring(1);
            this[r1] = function(n) {
                return this.rules[e].exec(n);
            };
        }
    };
    u.define("header", /^(\*+)\s+(.*)$/);
    u.define("preformatted", /^(\s*):(?: (.*)$|$)/);
    u.define("unorderedListElement", /^(\s*)(?:-|\+|\s+\*)\s+(.*)$/);
    u.define("orderedListElement", /^(\s*)(\d+)(?:\.|\))\s+(.*)$/);
    u.define("tableSeparator", /^(\s*)\|((?:\+|-)*?)\|?$/);
    u.define("tableRow", /^(\s*)\|(.*?)\|?$/);
    u.define("blank", /^$/);
    u.define("horizontalRule", /^(\s*)-{5,}$/);
    u.define("directive", /^(\s*)#\+(?:(begin|end)_)?(.*)$/i);
    u.define("comment", /^(\s*)#(.*)$/);
    u.define("line", /^(\s*)(.*)$/);
    function D() {
    }
    D.prototype = {
        isListElement: function() {
            return this.type === f.tokens.orderedListElement || this.type === f.tokens.unorderedListElement;
        },
        isTableElement: function() {
            return this.type === f.tokens.tableSeparator || this.type === f.tokens.tableRow;
        }
    };
    function f(e) {
        this.stream = e, this.tokenStack = [];
    }
    f.prototype = {
        tokenize: function(e) {
            var t = new D;
            if (t.fromLineNumber = this.stream.lineNumber, u.isHeader(e)) t.type = f.tokens.header, t.indentation = 0, t.content = RegExp.$2, t.level = RegExp.$1.length;
            else if (u.isPreformatted(e)) t.type = f.tokens.preformatted, t.indentation = RegExp.$1.length, t.content = RegExp.$2;
            else if (u.isUnorderedListElement(e)) t.type = f.tokens.unorderedListElement, t.indentation = RegExp.$1.length, t.content = RegExp.$2;
            else if (u.isOrderedListElement(e)) t.type = f.tokens.orderedListElement, t.indentation = RegExp.$1.length, t.content = RegExp.$3, t.number = RegExp.$2;
            else if (u.isTableSeparator(e)) t.type = f.tokens.tableSeparator, t.indentation = RegExp.$1.length, t.content = RegExp.$2;
            else if (u.isTableRow(e)) t.type = f.tokens.tableRow, t.indentation = RegExp.$1.length, t.content = RegExp.$2;
            else if (u.isBlank(e)) t.type = f.tokens.blank, t.indentation = 0, t.content = null;
            else if (u.isHorizontalRule(e)) t.type = f.tokens.horizontalRule, t.indentation = RegExp.$1.length, t.content = null;
            else if (u.isDirective(e)) {
                t.type = f.tokens.directive, t.indentation = RegExp.$1.length, t.content = RegExp.$3;
                var r1 = RegExp.$2;
                /^begin/i.test(r1) ? t.beginDirective = !0 : /^end/i.test(r1) ? t.endDirective = !0 : t.oneshotDirective = !0;
            } else if (u.isComment(e)) t.type = f.tokens.comment, t.indentation = RegExp.$1.length, t.content = RegExp.$2;
            else if (u.isLine(e)) t.type = f.tokens.line, t.indentation = RegExp.$1.length, t.content = RegExp.$2;
            else throw new Error("SyntaxError: Unknown line: " + e);
            return t;
        },
        pushToken: function(e) {
            this.tokenStack.push(e);
        },
        pushDummyTokenByType: function(e) {
            var t = new D;
            t.type = e, this.tokenStack.push(t);
        },
        peekStackedToken: function() {
            return this.tokenStack.length > 0 ? this.tokenStack[this.tokenStack.length - 1] : null;
        },
        getStackedToken: function() {
            return this.tokenStack.length > 0 ? this.tokenStack.pop() : null;
        },
        peekNextToken: function() {
            return this.peekStackedToken() || this.tokenize(this.stream.peekNextLine());
        },
        getNextToken: function() {
            return this.getStackedToken() || this.tokenize(this.stream.getNextLine());
        },
        hasNext: function() {
            return this.stream.hasNext();
        },
        getLineNumber: function() {
            return this.stream.lineNumber;
        }
    };
    f.tokens = {
    };
    [
        "header",
        "orderedListElement",
        "unorderedListElement",
        "tableRow",
        "tableSeparator",
        "preformatted",
        "line",
        "horizontalRule",
        "blank",
        "directive",
        "comment"
    ].forEach(function(e, t) {
        f.tokens[e] = t;
    });
    typeof R != "undefined" && (R.Lexer = f);
});
var b = g((C)=>{
    function j(e, t) {
        if (this.type = e, this.children = [], t) for(var r2 = 0, n = t.length; r2 < n; ++r2)this.appendChild(t[r2]);
    }
    j.prototype = {
        previousSibling: null,
        parent: null,
        get firstChild () {
            return this.children.length < 1 ? null : this.children[0];
        },
        get lastChild () {
            return this.children.length < 1 ? null : this.children[this.children.length - 1];
        },
        appendChild: function(e) {
            var t = this.children.length < 1 ? null : this.lastChild;
            this.children.push(e), e.previousSibling = t, e.parent = this;
        },
        toString: function() {
            var e = "<" + this.type + ">";
            return typeof this.value != "undefined" ? e += " " + this.value : this.children && (e += `\n` + this.children.map(function(t, r2) {
                return "#" + r2 + " " + t.toString();
            }).join(`\n`).split(`\n`).map(function(t) {
                return "  " + t;
            }).join(`\n`)), e;
        }
    };
    var p = {
        types: {
        },
        define: function(e, t) {
            this.types[e] = e;
            var r2 = "create" + e.substring(0, 1).toUpperCase() + e.substring(1), n = typeof t == "function";
            this[r2] = function(i2, s) {
                var a = new j(e, i2);
                return n && t(a, s || {
                }), a;
            };
        }
    };
    p.define("text", function(e, t) {
        e.value = t.value;
    });
    p.define("header", function(e, t) {
        e.level = t.level;
    });
    p.define("orderedList");
    p.define("unorderedList");
    p.define("definitionList");
    p.define("listElement");
    p.define("paragraph");
    p.define("preformatted");
    p.define("table");
    p.define("tableRow");
    p.define("tableCell");
    p.define("horizontalRule");
    p.define("directive");
    p.define("inlineContainer");
    p.define("bold");
    p.define("italic");
    p.define("underline");
    p.define("code");
    p.define("verbatim");
    p.define("dashed");
    p.define("link", function(e, t) {
        e.src = t.src;
    });
    typeof C != "undefined" && (C.Node = p);
});
var P = g((N)=>{
    var Z = w().Stream, o = S().Lexer, c = b().Node;
    function x1() {
        this.inlineParser = new O;
    }
    x1.parseStream = function(e, t) {
        var r2 = new x1;
        return r2.initStatus(e, t), r2.parseNodes(), r2.nodes;
    };
    x1.prototype = {
        initStatus: function(e, t) {
            if (typeof e == "string" && (e = new Z(e)), this.lexer = new o(e), this.nodes = [], this.options = {
                toc: !0,
                num: !0,
                "^": "{}",
                multilineCell: !1
            }, t && typeof t == "object") for(var r2 in t)this.options[r2] = t[r2];
            this.document = {
                options: this.options,
                directiveValues: {
                },
                convert: function(n, i2) {
                    var s = new n(this, i2);
                    return s.result;
                }
            };
        },
        parse: function(e, t) {
            return this.initStatus(e, t), this.parseDocument(), this.document.nodes = this.nodes, this.document;
        },
        createErrorReport: function(e) {
            return new Error(e + " at line " + this.lexer.getLineNumber());
        },
        skipBlank: function() {
            for(var e = null; this.lexer.peekNextToken().type === o.tokens.blank;)e = this.lexer.getNextToken();
            return e;
        },
        setNodeOriginFromToken: function(e, t) {
            return e.fromLineNumber = t.fromLineNumber, e;
        },
        appendNode: function(e) {
            var t = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : null;
            this.nodes.push(e), e.previousSibling = t;
        },
        parseDocument: function() {
            this.parseTitle(), this.parseNodes();
        },
        parseNodes: function() {
            for(; this.lexer.hasNext();){
                var e = this.parseElement();
                e && this.appendNode(e);
            }
        },
        parseTitle: function() {
            this.skipBlank(), this.lexer.hasNext() && this.lexer.peekNextToken().type === o.tokens.line ? this.document.title = this.createTextNode(this.lexer.getNextToken().content) : this.document.title = null, this.lexer.pushDummyTokenByType(o.tokens.blank);
        },
        parseElement: function() {
            var e = null;
            switch(this.lexer.peekNextToken().type){
                case o.tokens.header:
                    e = this.parseHeader();
                    break;
                case o.tokens.preformatted:
                    e = this.parsePreformatted();
                    break;
                case o.tokens.orderedListElement:
                case o.tokens.unorderedListElement:
                    e = this.parseList();
                    break;
                case o.tokens.line:
                    e = this.parseText();
                    break;
                case o.tokens.tableRow:
                case o.tokens.tableSeparator:
                    e = this.parseTable();
                    break;
                case o.tokens.blank:
                    this.skipBlank(), this.lexer.hasNext() && (this.lexer.peekNextToken().type === o.tokens.line ? e = this.parseParagraph() : e = this.parseElement());
                    break;
                case o.tokens.horizontalRule:
                    this.lexer.getNextToken(), e = c.createHorizontalRule();
                    break;
                case o.tokens.directive:
                    e = this.parseDirective();
                    break;
                case o.tokens.comment:
                    this.lexer.getNextToken();
                    break;
                default:
                    throw this.createErrorReport("Unhandled token: " + this.lexer.peekNextToken().type);
            }
            return e;
        },
        parseElementBesidesDirectiveEnd: function() {
            try {
                return this.parseElement = this.parseElementBesidesDirectiveEndBody, this.parseElement();
            } finally{
                this.parseElement = this.originalParseElement;
            }
        },
        parseElementBesidesDirectiveEndBody: function() {
            return this.lexer.peekNextToken().type === o.tokens.directive && this.lexer.peekNextToken().endDirective ? null : this.originalParseElement();
        },
        parseHeader: function() {
            var e = this.lexer.getNextToken(), t = c.createHeader([
                this.createTextNode(e.content)
            ], {
                level: e.level
            });
            return this.setNodeOriginFromToken(t, e), t;
        },
        parsePreformatted: function() {
            var e = this.lexer.peekNextToken(), t = c.createPreformatted([]);
            this.setNodeOriginFromToken(t, e);
            for(var r2 = []; this.lexer.hasNext();){
                var n = this.lexer.peekNextToken();
                if (n.type !== o.tokens.preformatted || n.indentation < e.indentation) break;
                this.lexer.getNextToken(), r2.push(n.content);
            }
            return t.appendChild(this.createTextNode(r2.join(`\n`), !0)), t;
        },
        definitionPattern: /^(.*?) :: *(.*)$/,
        parseList: function() {
            var e = this.lexer.peekNextToken(), t, r2 = !1;
            for(this.definitionPattern.test(e.content) ? (t = c.createDefinitionList([]), r2 = !0) : t = e.type === o.tokens.unorderedListElement ? c.createUnorderedList([]) : c.createOrderedList([]), this.setNodeOriginFromToken(t, e); this.lexer.hasNext();){
                var n = this.lexer.peekNextToken();
                if (!n.isListElement() || n.indentation !== e.indentation) break;
                t.appendChild(this.parseListElement(e.indentation, r2));
            }
            return t;
        },
        unknownDefinitionTerm: "???",
        parseListElement: function(e, t) {
            var r2 = this.lexer.getNextToken(), n = c.createListElement([]);
            if (this.setNodeOriginFromToken(n, r2), n.isDefinitionList = t, t) {
                var i2 = this.definitionPattern.exec(r2.content);
                n.term = [
                    this.createTextNode(i2 && i2[1] ? i2[1] : this.unknownDefinitionTerm)
                ], n.appendChild(this.createTextNode(i2 ? i2[2] : r2.content));
            } else n.appendChild(this.createTextNode(r2.content));
            for(; this.lexer.hasNext();){
                var s = this.skipBlank();
                if (!this.lexer.hasNext()) break;
                var a = this.lexer.peekNextToken();
                if (s && !a.isListElement() && this.lexer.pushToken(s), a.indentation <= e) break;
                var h = this.parseElement();
                h && n.appendChild(h);
            }
            return n;
        },
        parseTable: function() {
            var e = this.lexer.peekNextToken(), t = c.createTable([]);
            this.setNodeOriginFromToken(t, e);
            for(var r2 = !1, n = e.type === o.tokens.tableSeparator && this.options.multilineCell; this.lexer.hasNext() && (e = this.lexer.peekNextToken()).isTableElement();)if (e.type === o.tokens.tableRow) {
                var i3 = this.parseTableRow(n);
                t.appendChild(i3);
            } else r2 = !0, this.lexer.getNextToken();
            return r2 && t.children.length && t.children[0].children.forEach(function(s) {
                s.isHeader = !0;
            }), t;
        },
        parseTableRow: function(e) {
            for(var t = []; this.lexer.peekNextToken().type === o.tokens.tableRow && (t.push(this.lexer.getNextToken()), !!e););
            if (!t.length) throw this.createErrorReport("Expected table row");
            var r2 = t.shift(), n = r2.content.split("|");
            t.forEach(function(s) {
                s.content.split("|").forEach(function(a, h) {
                    n[h] = (n[h] || "") + `\n` + a;
                });
            });
            var i4 = n.map(function(s) {
                return c.createTableCell(x1.parseStream(s));
            }, this);
            return this.setNodeOriginFromToken(c.createTableRow(i4), r2);
        },
        parseDirective: function() {
            var e = this.lexer.getNextToken(), t = this.createDirectiveNodeFromToken(e);
            if (e.endDirective) throw this.createErrorReport("Unmatched 'end' directive for " + t.directiveName);
            if (e.oneshotDirective) return this.interpretDirective(t), t;
            if (!e.beginDirective) throw this.createErrorReport("Invalid directive " + t.directiveName);
            return t.children = [], this.isVerbatimDirective(t) ? this.parseDirectiveBlockVerbatim(t) : this.parseDirectiveBlock(t);
        },
        createDirectiveNodeFromToken: function(e) {
            var t = /^[ ]*([^ ]*)[ ]*(.*)[ ]*$/.exec(e.content), r2 = c.createDirective(null);
            return this.setNodeOriginFromToken(r2, e), r2.directiveName = t[1].toLowerCase(), r2.directiveArguments = this.parseDirectiveArguments(t[2]), r2.directiveOptions = this.parseDirectiveOptions(t[2]), r2.directiveRawValue = t[2], r2;
        },
        isVerbatimDirective: function(e) {
            var t = e.directiveName;
            return t === "src" || t === "example" || t === "html";
        },
        parseDirectiveBlock: function(e, t) {
            for(this.lexer.pushDummyTokenByType(o.tokens.blank); this.lexer.hasNext();){
                var r2 = this.lexer.peekNextToken();
                if (r2.type === o.tokens.directive && r2.endDirective && this.createDirectiveNodeFromToken(r2).directiveName === e.directiveName) return this.lexer.getNextToken(), e;
                var n = this.parseElementBesidesDirectiveEnd();
                n && e.appendChild(n);
            }
            throw this.createErrorReport("Unclosed directive " + e.directiveName);
        },
        parseDirectiveBlockVerbatim: function(e) {
            for(var t = []; this.lexer.hasNext();){
                var r3 = this.lexer.peekNextToken();
                if (r3.type === o.tokens.directive && r3.endDirective && this.createDirectiveNodeFromToken(r3).directiveName === e.directiveName) return this.lexer.getNextToken(), e.appendChild(this.createTextNode(t.join(`\n`), !0)), e;
                t.push(this.lexer.stream.getNextLine());
            }
            throw this.createErrorReport("Unclosed directive " + e.directiveName);
        },
        parseDirectiveArguments: function(e) {
            return e.split(/[ ]+/).filter(function(t) {
                return t.length && t[0] !== "-";
            });
        },
        parseDirectiveOptions: function(e) {
            return e.split(/[ ]+/).filter(function(t) {
                return t.length && t[0] === "-";
            });
        },
        interpretDirective: function(e) {
            switch(e.directiveName){
                case "options:":
                    this.interpretOptionDirective(e);
                    break;
                case "title:":
                    this.document.title = e.directiveRawValue;
                    break;
                case "author:":
                    this.document.author = e.directiveRawValue;
                    break;
                case "email:":
                    this.document.email = e.directiveRawValue;
                    break;
                default:
                    this.document.directiveValues[e.directiveName] = e.directiveRawValue;
                    break;
            }
        },
        interpretOptionDirective: function(e) {
            e.directiveArguments.forEach(function(t) {
                var r4 = t.split(":");
                this.options[r4[0]] = this.convertLispyValue(r4[1]);
            }, this);
        },
        convertLispyValue: function(e) {
            switch(e){
                case "t":
                    return !0;
                case "nil":
                    return !1;
                default:
                    return /^[0-9]+$/.test(e) ? parseInt(e) : e;
            }
        },
        parseParagraph: function() {
            var e = this.lexer.peekNextToken(), t = c.createParagraph([]);
            this.setNodeOriginFromToken(t, e);
            for(var r4 = []; this.lexer.hasNext();){
                var n = this.lexer.peekNextToken();
                if (n.type !== o.tokens.line || n.indentation < e.indentation) break;
                this.lexer.getNextToken(), r4.push(n.content);
            }
            return t.appendChild(this.createTextNode(r4.join(`\n`))), t;
        },
        parseText: function(e) {
            var t = this.lexer.getNextToken();
            return this.createTextNode(t.content, e);
        },
        createTextNode: function(e, t) {
            return t ? c.createText(null, {
                value: e
            }) : this.inlineParser.parseEmphasis(e);
        }
    };
    x1.prototype.originalParseElement = x1.prototype.parseElement;
    function O() {
        this.preEmphasis = ` 	\\('"`, this.postEmphasis = `- 	.,:!?;'"\\)`, this.borderForbidden = ` 	\r\n,"'`, this.bodyRegexp = "[\\s\\S]*?", this.markers = "*/_=~+", this.emphasisPattern = this.buildEmphasisPattern(), this.linkPattern = /\[\[([^\]]*)\](?:\[([^\]]*)\])?\]/g;
    }
    O.prototype = {
        parseEmphasis: function(e) {
            var t = this.emphasisPattern;
            t.lastIndex = 0;
            for(var r4 = [], n, i4 = 0, s; n = t.exec(e);){
                var a = n[0], h = n[1], d = n[2], v = n[3], m = n[4];
                {
                    var k = t.lastIndex - a.length, y1 = e.substring(i4, k + h.length);
                    s = t.lastIndex, r4.push(this.parseLink(y1)), t.lastIndex = s;
                }
                var A = [
                    c.createText(null, {
                        value: v
                    })
                ], V = this.emphasizeElementByMarker(A, d);
                r4.push(V), i4 = t.lastIndex - m.length;
            }
            return (t.lastIndex === 0 || t.lastIndex !== e.length - 1) && r4.push(this.parseLink(e.substring(i4))), r4.length === 1 ? r4[0] : c.createInlineContainer(r4);
        },
        depth: 0,
        parseLink: function(e) {
            var t = this.linkPattern;
            t.lastIndex = 0;
            for(var r4, n = [], i4 = 0, s; r4 = t.exec(e);){
                var a = r4[0], h = r4[1], d = r4[2], v = t.lastIndex - a.length, m = e.substring(i4, v);
                n.push(c.createText(null, {
                    value: m
                }));
                var k = c.createLink([]);
                k.src = h, d ? (s = t.lastIndex, k.appendChild(this.parseEmphasis(d)), t.lastIndex = s) : k.appendChild(c.createText(null, {
                    value: h
                })), n.push(k), i4 = t.lastIndex;
            }
            return (t.lastIndex === 0 || t.lastIndex !== e.length - 1) && n.push(c.createText(null, {
                value: e.substring(i4)
            })), c.createInlineContainer(n);
        },
        emphasizeElementByMarker: function(e, t) {
            switch(t){
                case "*":
                    return c.createBold(e);
                case "/":
                    return c.createItalic(e);
                case "_":
                    return c.createUnderline(e);
                case "=":
                case "~":
                    return c.createCode(e);
                case "+":
                    return c.createDashed(e);
            }
        },
        buildEmphasisPattern: function() {
            return new RegExp("([" + this.preEmphasis + `]|^|\r?\n)([` + this.markers + "])([^" + this.borderForbidden + "]|[^" + this.borderForbidden + "]" + this.bodyRegexp + "[^" + this.borderForbidden + "])\\2([" + this.postEmphasis + `]|$|\r?\n)`, "g");
        }
    };
    typeof N != "undefined" && (N.Parser = x1, N.InlineParser = O);
});
var U = g((I)=>{
    var l = b().Node;
    function M() {
    }
    M.prototype = {
        exportOptions: {
            headerOffset: 1,
            exportFromLineNumber: !1,
            suppressSubScriptHandling: !1,
            suppressAutoLink: !1,
            translateSymbolArrow: !1,
            suppressCheckboxHandling: !1,
            customDirectiveHandler: null,
            htmlClassPrefix: null,
            htmlIdPrefix: null
        },
        untitled: "Untitled",
        result: null,
        initialize: function(e, t) {
            this.orgDocument = e, this.documentOptions = e.options || {
            }, this.exportOptions = t || {
            }, this.headers = [], this.headerOffset = typeof this.exportOptions.headerOffset == "number" ? this.exportOptions.headerOffset : 1, this.sectionNumbers = [
                0
            ];
        },
        createTocItem: function(e, t) {
            var r4 = [];
            r4.parent = t;
            var n = {
                headerNode: e,
                childTocs: r4
            };
            return n;
        },
        computeToc: function(e) {
            typeof e != "number" && (e = Infinity);
            var t = [];
            t.parent = null;
            for(var r4 = 1, n = t, i4 = 0; i4 < this.headers.length; ++i4){
                var s = this.headers[i4];
                if (!(s.level > e)) {
                    var a = s.level - r4;
                    if (a > 0) for(var h = 0; h < a; ++h){
                        if (n.length === 0) {
                            var d = l.createHeader([], {
                                level: r4 + h
                            });
                            d.sectionNumberText = "", n.push(this.createTocItem(d, n));
                        }
                        n = n[n.length - 1].childTocs;
                    }
                    else if (a < 0) {
                        a = -a;
                        for(var v = 0; v < a; ++v)n = n.parent;
                    }
                    n.push(this.createTocItem(s, n)), r4 = s.level;
                }
            }
            return t;
        },
        convertNode: function(e, t, r4) {
            r4 || (e.type === l.types.directive ? (e.directiveName === "example" || e.directiveName === "src") && (r4 = !0) : e.type === l.types.preformatted && (r4 = !0)), typeof e == "string" && (e = l.createText(null, {
                value: e
            }));
            var n = e.children ? this.convertNodesInternal(e.children, t, r4) : "", i4, s = this.computeAuxDataForNode(e);
            switch(e.type){
                case l.types.header:
                    var a = null;
                    n.indexOf("TODO ") === 0 ? a = "todo" : n.indexOf("DONE ") === 0 && (a = "done");
                    var h = null;
                    if (t) {
                        var d = e.level, v = this.sectionNumbers.length;
                        if (d > v) for(var m = d - v, k = 0; k < m; ++k)this.sectionNumbers[d - 1 - k] = 0;
                        else d < v && (this.sectionNumbers.length = d);
                        this.sectionNumbers[d - 1]++, h = this.sectionNumbers.join("."), e.sectionNumberText = h;
                    }
                    i4 = this.convertHeader(e, n, s, a, h), t && this.headers.push(e);
                    break;
                case l.types.orderedList:
                    i4 = this.convertOrderedList(e, n, s);
                    break;
                case l.types.unorderedList:
                    i4 = this.convertUnorderedList(e, n, s);
                    break;
                case l.types.definitionList:
                    i4 = this.convertDefinitionList(e, n, s);
                    break;
                case l.types.listElement:
                    if (e.isDefinitionList) {
                        var y2 = this.convertNodesInternal(e.term, t, r4);
                        i4 = this.convertDefinitionItem(e, n, s, y2, n);
                    } else i4 = this.convertListItem(e, n, s);
                    break;
                case l.types.paragraph:
                    i4 = this.convertParagraph(e, n, s);
                    break;
                case l.types.preformatted:
                    i4 = this.convertPreformatted(e, n, s);
                    break;
                case l.types.table:
                    i4 = this.convertTable(e, n, s);
                    break;
                case l.types.tableRow:
                    i4 = this.convertTableRow(e, n, s);
                    break;
                case l.types.tableCell:
                    e.isHeader ? i4 = this.convertTableHeader(e, n, s) : i4 = this.convertTableCell(e, n, s);
                    break;
                case l.types.horizontalRule:
                    i4 = this.convertHorizontalRule(e, n, s);
                    break;
                case l.types.inlineContainer:
                    i4 = this.convertInlineContainer(e, n, s);
                    break;
                case l.types.bold:
                    i4 = this.convertBold(e, n, s);
                    break;
                case l.types.italic:
                    i4 = this.convertItalic(e, n, s);
                    break;
                case l.types.underline:
                    i4 = this.convertUnderline(e, n, s);
                    break;
                case l.types.code:
                    i4 = this.convertCode(e, n, s);
                    break;
                case l.types.dashed:
                    i4 = this.convertDashed(e, n, s);
                    break;
                case l.types.link:
                    i4 = this.convertLink(e, n, s);
                    break;
                case l.types.directive:
                    switch(e.directiveName){
                        case "quote":
                            i4 = this.convertQuote(e, n, s);
                            break;
                        case "example":
                            i4 = this.convertExample(e, n, s);
                            break;
                        case "src":
                            i4 = this.convertSrc(e, n, s);
                            break;
                        case "html":
                        case "html:":
                            i4 = this.convertHTML(e, n, s);
                            break;
                        default:
                            this.exportOptions.customDirectiveHandler && this.exportOptions.customDirectiveHandler[e.directiveName] ? i4 = this.exportOptions.customDirectiveHandler[e.directiveName](e, n, s) : i4 = n;
                    }
                    break;
                case l.types.text:
                    i4 = this.convertText(e.value, r4);
                    break;
                default:
                    throw Error("Unknown node type: " + e.type);
            }
            return typeof this.postProcess == "function" && (i4 = this.postProcess(e, i4, r4)), i4;
        },
        convertText: function(e, t) {
            var r4 = this.escapeSpecialChars(e, t);
            return !this.exportOptions.suppressSubScriptHandling && !t && (r4 = this.makeSubscripts(r4, t)), this.exportOptions.suppressAutoLink || (r4 = this.linkURL(r4)), r4;
        },
        convertHTML: function(e, t, r4) {
            return t;
        },
        convertNodesInternal: function(e, t, r4) {
            for(var n = [], i4 = 0; i4 < e.length; ++i4){
                var s = e[i4], a = this.convertNode(s, t, r4);
                n.push(a);
            }
            return this.combineNodesTexts(n);
        },
        convertHeaderBlock: function(e, t) {
            throw Error("convertHeaderBlock is not implemented");
        },
        convertHeaderTree: function(e, t) {
            return this.convertHeaderBlock(e, t);
        },
        convertNodesToHeaderTree: function(e, t, r4) {
            var n = [], i4 = [];
            typeof t == "undefined" && (t = 0), typeof r4 == "undefined" && (r4 = null);
            for(var s = t; s < e.length;){
                var a = e[s], h = a.type === l.types.header;
                if (!h) {
                    i4.push(a), s = s + 1;
                    continue;
                }
                if (r4 && a.level <= r4.level) break;
                var d = this.convertNodesToHeaderTree(e, s + 1, a);
                n.push(d), s = d.nextIndex;
            }
            return {
                header: r4,
                childNodes: i4,
                nextIndex: s,
                childBlocks: n
            };
        },
        convertNodes: function(e, t, r4) {
            return this.convertNodesInternal(e, t, r4);
        },
        combineNodesTexts: function(e) {
            return e.join("");
        },
        getNodeTextContent: function(e) {
            return e.type === l.types.text ? this.escapeSpecialChars(e.value) : e.children ? e.children.map(this.getNodeTextContent, this).join("") : "";
        },
        escapeSpecialChars: function(e) {
            throw Error("Implement escapeSpecialChars");
        },
        urlPattern: /\b(?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?????????????????])/ig,
        linkURL: function(e) {
            var t = this;
            return e.replace(this.urlPattern, function(r4) {
                return (r4.indexOf("://") < 0 && (r4 = "http://" + r4), t.makeLink(r4));
            });
        },
        makeLink: function(e) {
            throw Error("Implement makeLink");
        },
        makeSubscripts: function(e) {
            return this.documentOptions["^"] === "{}" ? e.replace(/\b([^_ \t]*)_{([^}]*)}/g, this.makeSubscript) : this.documentOptions["^"] ? e.replace(/\b([^_ \t]*)_([^_]*)\b/g, this.makeSubscript) : e;
        },
        makeSubscript: function(e, t, r4) {
            throw Error("Implement makeSubscript");
        },
        stripParametersFromURL: function(e) {
            return e.replace(/\?.*$/, "");
        },
        imageExtensionPattern: new RegExp("(" + [
            "bmp",
            "png",
            "jpeg",
            "jpg",
            "gif",
            "tiff",
            "tif",
            "xbm",
            "xpm",
            "pbm",
            "pgm",
            "ppm",
            "svg"
        ].join("|") + ")$", "i")
    };
    typeof I != "undefined" && (I.Converter = M);
});
var _ = g(($)=>{
    var ee = U().Converter, z = b().Node;
    function q(e, t) {
        this.initialize(e, t), this.result = this.convert();
    }
    q.prototype = {
        __proto__: ee.prototype,
        convert: function() {
            var e = this.orgDocument.title ? this.convertNode(this.orgDocument.title) : this.untitled, t = this.tag("h" + Math.max(Number(this.headerOffset), 1), e), r4 = this.convertNodes(this.orgDocument.nodes, !0), n = this.computeToc(this.documentOptions.toc), i4 = this.tocToHTML(n);
            return {
                title: e,
                titleHTML: t,
                contentHTML: r4,
                tocHTML: i4,
                toc: n,
                toString: function() {
                    return t + i4 + `\n` + r4;
                }
            };
        },
        tocToHTML: function(e) {
            function t(r4) {
                for(var n = "", i4 = 0; i4 < r4.length; ++i4){
                    var s = r4[i4], a = s.headerNode.sectionNumberText, h = this.documentOptions.num ? this.inlineTag("span", a, {
                        class: "section-number"
                    }) : "", d = this.getNodeTextContent(s.headerNode), v = this.inlineTag("a", h + d, {
                        href: "#header-" + a.replace(/\./g, "-")
                    }), m = s.childTocs.length ? t.call(this, s.childTocs) : "";
                    n += this.tag("li", v + m);
                }
                return this.tag("ul", n);
            }
            return t.call(this, e);
        },
        computeAuxDataForNode: function(e) {
            for(; e.parent && e.parent.type === z.types.inlineContainer;)e = e.parent;
            for(var t = e.previousSibling, r4 = ""; t && t.type === z.types.directive && t.directiveName === "attr_html:";)r4 += t.directiveRawValue + " ", t = t.previousSibling;
            return r4;
        },
        orgClassName: function(e) {
            return this.exportOptions.htmlClassPrefix ? this.exportOptions.htmlClassPrefix + e : e;
        },
        orgId: function(e) {
            return this.exportOptions.htmlIdPrefix ? this.exportOptions.htmlIdPrefix + e : e;
        },
        convertHeader: function(e, t, r4, n, i4) {
            var s = {
            };
            return n && (t = this.inlineTag("span", t.substring(0, 4), {
                class: "task-status " + n
            }) + t.substring(5)), i4 && (t = this.inlineTag("span", i4, {
                class: "section-number"
            }) + t, s.id = "header-" + i4.replace(/\./g, "-")), n && (s.class = "task-status " + n), this.tag("h" + (this.headerOffset + e.level), t, s, r4);
        },
        convertOrderedList: function(e, t, r4) {
            return this.tag("ol", t, null, r4);
        },
        convertUnorderedList: function(e, t, r4) {
            return this.tag("ul", t, null, r4);
        },
        convertDefinitionList: function(e, t, r4) {
            return this.tag("dl", t, null, r4);
        },
        convertDefinitionItem: function(e, t, r4, n, i4) {
            return this.tag("dt", n) + this.tag("dd", i4);
        },
        convertListItem: function(e, t, r4) {
            if (this.exportOptions.suppressCheckboxHandling) return this.tag("li", t, null, r4);
            var n = {
            }, i4 = t;
            if (/^\s*\[(X| |-)\]([\s\S]*)/.exec(i4)) {
                i4 = RegExp.$2;
                var s = RegExp.$1, a = {
                    type: "checkbox"
                };
                switch(s){
                    case "X":
                        a.checked = "true", n["data-checkbox-status"] = "done";
                        break;
                    case "-":
                        n["data-checkbox-status"] = "intermediate";
                        break;
                    default:
                        n["data-checkbox-status"] = "undone";
                        break;
                }
                i4 = this.inlineTag("input", null, a) + i4;
            }
            return this.tag("li", i4, n, r4);
        },
        convertParagraph: function(e, t, r4) {
            return this.tag("p", t, null, r4);
        },
        convertPreformatted: function(e, t, r4) {
            return this.tag("pre", t, null, r4);
        },
        convertTable: function(e, t, r4) {
            return this.tag("table", this.tag("tbody", t), null, r4);
        },
        convertTableRow: function(e, t, r4) {
            return this.tag("tr", t);
        },
        convertTableHeader: function(e, t, r4) {
            return this.tag("th", t);
        },
        convertTableCell: function(e, t, r4) {
            return this.tag("td", t);
        },
        convertHorizontalRule: function(e, t, r4) {
            return this.tag("hr", null, null, r4);
        },
        convertInlineContainer: function(e, t, r4) {
            return t;
        },
        convertBold: function(e, t, r4) {
            return this.inlineTag("b", t);
        },
        convertItalic: function(e, t, r4) {
            return this.inlineTag("i", t);
        },
        convertUnderline: function(e, t, r4) {
            return this.inlineTag("span", t, {
                style: "text-decoration:underline;"
            });
        },
        convertCode: function(e, t, r4) {
            return this.inlineTag("code", t);
        },
        convertDashed: function(e, t, r4) {
            return this.inlineTag("del", t);
        },
        convertLink: function(e, t, r4) {
            var n = this.stripParametersFromURL(e.src);
            if (this.imageExtensionPattern.exec(n)) {
                var i4 = this.getNodeTextContent(e);
                return this.inlineTag("img", null, {
                    src: e.src,
                    alt: i4,
                    title: i4
                }, r4);
            } else return this.inlineTag("a", t, {
                href: e.src
            });
        },
        convertQuote: function(e, t, r4) {
            return this.tag("blockquote", t, null, r4);
        },
        convertExample: function(e, t, r4) {
            return this.tag("pre", t, null, r4);
        },
        convertSrc: function(e, t, r4) {
            var n = e.directiveArguments.length ? e.directiveArguments[0] : "unknown";
            return t = this.tag("code", t, {
                class: "language-" + n
            }, r4), this.tag("pre", t, {
                class: "prettyprint"
            });
        },
        convertHTML: function(e, t, r4) {
            return e.directiveName === "html:" ? e.directiveRawValue : e.directiveName === "html" ? e.children.map(function(n) {
                return n.value;
            }).join(`\n`) : t;
        },
        convertHeaderBlock: function(e, t, r4) {
            t = t || 0, r4 = r4 || 0;
            var n = [], i5 = e.header;
            i5 && n.push(this.convertNode(i5));
            var s = this.convertNodes(e.childNodes);
            n.push(s);
            var a = e.childBlocks.map(function(d, v) {
                return this.convertHeaderBlock(d, t + 1, v);
            }, this).join(`\n`);
            n.push(a);
            var h = n.join(`\n`);
            return i5 ? this.tag("section", `\n` + n.join(`\n`), {
                class: "block block-level-" + t
            }) : h;
        },
        replaceMap: {
            "&": [
                "&#38;",
                null
            ],
            "<": [
                "&#60;",
                null
            ],
            ">": [
                "&#62;",
                null
            ],
            '"': [
                "&#34;",
                null
            ],
            "'": [
                "&#39;",
                null
            ],
            "->": [
                "&#10132;",
                function(e, t) {
                    return this.exportOptions.translateSymbolArrow && !t;
                }
            ]
        },
        replaceRegexp: null,
        escapeSpecialChars: function(e, t) {
            this.replaceRegexp || (this.replaceRegexp = new RegExp(Object.keys(this.replaceMap).join("|"), "g"));
            var r4 = this.replaceMap, n = this;
            return e.replace(this.replaceRegexp, function(i5) {
                if (!r4[i5]) throw Error("escapeSpecialChars: Invalid match");
                var s = r4[i5][1];
                return typeof s == "function" && !s.call(n, e, t) ? i5 : r4[i5][0];
            });
        },
        postProcess: function(e, t, r4) {
            return this.exportOptions.exportFromLineNumber && typeof e.fromLineNumber == "number" && (t = this.inlineTag("div", t, {
                "data-line-number": e.fromLineNumber
            })), t;
        },
        makeLink: function(e) {
            return '<a href="' + e + '">' + decodeURIComponent(e) + "</a>";
        },
        makeSubscript: function(e, t, r4) {
            return '<span class="org-subscript-parent">' + t + '</span><span class="org-subscript-child">' + r4 + "</span>";
        },
        attributesObjectToString: function(e) {
            var t = "";
            for(var r4 in e)if (e.hasOwnProperty(r4)) {
                var n = e[r4];
                r4 === "class" ? n = this.orgClassName(n) : r4 === "id" && (n = this.orgId(n)), t += " " + r4 + '="' + n + '"';
            }
            return t;
        },
        inlineTag: function(e, t, r4, n) {
            r4 = r4 || {
            };
            var i5 = "<" + e;
            return n && (i5 += " " + n), i5 += this.attributesObjectToString(r4), t === null ? i5 + "/>" : (i5 += ">" + t + "</" + e + ">", i5);
        },
        tag: function(e, t, r4, n) {
            return this.inlineTag(e, t, r4, n) + `\n`;
        }
    };
    typeof $ != "undefined" && ($.ConverterHTML = q);
});
var F = g((H)=>{
    if (typeof H != "undefined") {
        let e = function(t) {
            for(var r4 in t)t.hasOwnProperty(r4) && (H[r4] = t[r4]);
        };
        he = e, e(P()), e(S()), e(b()), e(P()), e(w()), e(_());
    }
    var he;
});
var te = B(F()), re = B(F()), { Parser: de , InlineParser: fe , Lexer: ve , Node: ke , Stream: me , ConverterHTML: ge  } = te;
var export_default = re.default;
const mod = function() {
    return {
        default: export_default,
        ConverterHTML: ge,
        InlineParser: fe,
        Lexer: ve,
        Node: ke,
        Parser: de,
        Stream: me
    };
}();
class NodeDetail extends HTMLDivElement {
    fetchNode;
    modalOpenElement;
    modalWindowElement;
    currentNode;
    titleElement;
    descriptionElement;
    thumbnailElement;
    properties;
    tags;
    constructor(fetchNode2){
        super();
        this.fetchNode = fetchNode2;
        this.classList.add("node-detail");
        this.thumbnailElement = document.createElement('img');
        this.thumbnailElement.classList.add("thumbnail");
        this.thumbnailElement.hidden = true;
        this.appendChild(this.thumbnailElement);
        this.titleElement = document.createElement('p');
        this.titleElement.innerText = "title";
        this.appendChild(this.titleElement);
        this.descriptionElement = document.createElement('p');
        this.descriptionElement.innerText = "description";
        this.appendChild(this.descriptionElement);
        const modal = document.getElementById('modal');
        const mask = document.getElementById('mask');
        this.modalOpenElement = document.createElement("div");
        if (modal != null && mask != null && !isNull(this.modalOpenElement)) {
            this.modalOpenElement.id = "open";
            this.modalOpenElement.innerText = "click to open content";
            this.modalOpenElement.onclick = ()=>{
                modal.classList.remove('hidden');
                mask.classList.remove('hidden');
            };
            mask.onclick = ()=>{
                modal.classList.add('hidden');
                mask.classList.add('hidden');
            };
            this.appendChild(this.modalOpenElement);
            this.modalWindowElement = modal;
        }
    }
    reloadDetail = async ()=>{
        if (this.currentNode) {
            const remoteLatestNode = await this.fetchNode(this.currentNode.hash);
            if (!isNull(remoteLatestNode)) {
                this.setDetail(remoteLatestNode);
            }
        }
    };
    async setDetail(node) {
        if (isNull(this.titleElement) || isNull(this.thumbnailElement) || isNull(this.descriptionElement)) return;
        this.titleElement.innerText = node.title.substring(0, 25);
        this.descriptionElement.innerText = node.description;
        const orgPathData = orgmodeResourcePath(node.hash);
        if (BlobMeta.validation(node) && (node.extention == ".jpeg" || node.extention == ".png" || node.extention == ".jpg" || node.extention == ".gif")) {
            const blobPathData = blobResourcePath(node.hash);
            this.thumbnailElement.src = remoteStorageURL + blobPathData.prefix + blobPathData.hashDir + blobPathData.hash + node.extention;
            this.thumbnailElement.hidden = false;
        } else {
            if (node.thumbnail == "") {
                this.thumbnailElement.hidden = true;
            } else {
                this.thumbnailElement.src = node.thumbnail;
                this.thumbnailElement.hidden = false;
            }
        }
        if (this.modalWindowElement) {
            while(this.modalWindowElement.firstChild){
                this.modalWindowElement.removeChild(this.modalWindowElement.firstChild);
            }
            const orgText = await remoteOrgGet(node.hash);
            const html = org2Html(orgText);
            if (html != "") {
                const blob = new Blob([
                    html.contentHTML
                ], {
                    type: 'text/html'
                });
                const iframe = document.createElement("iframe");
                iframe.src = URL.createObjectURL(blob);
                this.modalWindowElement.appendChild(iframe);
            }
        }
        const props = objToRecurisveAccordionMenu(document, node);
        if (isNull(this.properties)) {
            this.appendChild(document.createTextNode("props: "));
            this.properties = props;
            this.appendChild(this.properties);
        } else {
            this.replaceChild(props, this.properties);
            this.properties = props;
        }
        const tagsRoot = document.createElement('ul');
        if (isNull(this.tags)) {
            this.tags = tagsRoot;
            this.appendChild(this.tags);
        } else {
            this.replaceChild(tagsRoot, this.tags);
            this.tags = tagsRoot;
        }
        Object.entries(node.vector).forEach(async ([target, label])=>{
            const node = await this.fetchNode(target);
            if (node) {
                const li = document.createElement('li');
                li.innerText = node.title;
                tagsRoot.appendChild(li);
            }
        });
        this.currentNode = node;
    }
}
class EditableNodeDetail extends NodeDetail {
    tagHashDict;
    updateNode;
    reload;
    remoteOpenOrgElement = document.createElement('div');
    remoteOpenBlobElement = document.createElement('div');
    remoteOpenMetaElement = document.createElement('div');
    jsonTextAreaElement = document.createElement('textarea');
    tagSelectorElement = document.createElement('input');
    tagInserterButtonElement = document.createElement('button');
    tagListElement = document.createElement('ul');
    constructor(fetchNode1, tagHashDict, updateNode1, reload1){
        super(fetchNode1);
        this.tagHashDict = tagHashDict;
        this.updateNode = updateNode1;
        this.reload = reload1;
        this.remoteOpenOrgElement.innerText = "xdgOpenOrg";
        this.appendChild(this.remoteOpenOrgElement);
        this.remoteOpenBlobElement.innerText = "xdgOpenBlob";
        this.appendChild(this.remoteOpenBlobElement);
        this.remoteOpenMetaElement.innerText = "xdgOpenMeta";
        this.appendChild(this.remoteOpenMetaElement);
        this.appendChild(this.tagListElement);
        const tagDict = tagHashDict();
        const datalist = Object.values(tagDict).map((e)=>e.title
        );
        this.tagSelectorElement = CreateAutocompleteInput(document, "li-tag-datalist", datalist);
        this.appendChild(this.tagSelectorElement);
        this.tagInserterButtonElement.textContent = 'tag insert';
        this.tagInserterButtonElement.onclick = this.insertTag;
        this.appendChild(this.tagInserterButtonElement);
        this.jsonTextAreaElement.value = "text";
        this.appendChild(this.jsonTextAreaElement);
    }
    insertTag = async ()=>{
        const node = JSON.parse(this.jsonTextAreaElement.value);
        const tag = this.tagHashDict()[this.tagSelectorElement.value];
        if (Node1.validation(node)) {
            const index = tag.hash;
            node.vector[index] = node.vector[index] ?? {
            };
            node.vector[index]["tag"] = 1;
            this.jsonTextAreaElement.value = JSON.stringify(node);
            await this.updateNode(node, new FormData);
            this.reload();
        }
    };
    async setDetail(node) {
        await super.setDetail(node);
        const orgPathData = orgmodeResourcePath(node.hash);
        this.jsonTextAreaElement.value = JSON.stringify(node);
        if (this.remoteOpenOrgElement) {
            removeAllChild(this.remoteOpenOrgElement);
            const xdgOpenOrgPath = remoteStorageURL + "remote-xdg-like-open/" + orgPathData.prefix + orgPathData.hashDir + orgPathData.hash + orgPathData.extention;
            const elems = PathElement("org", "/" + orgPathData.prefix + orgPathData.hashDir + orgPathData.hash + orgPathData.extention, xdgOpenOrgPath);
            elems.forEach((e)=>{
                if (this.remoteOpenOrgElement) {
                    this.remoteOpenOrgElement.appendChild(e);
                }
            });
        }
        if (this.remoteOpenBlobElement) {
            if (BlobMeta.validation(node)) {
                removeAllChild(this.remoteOpenBlobElement);
                const blobPathData = blobResourcePath(node.hash);
                const xdgOpenBlobPath = remoteStorageURL + "remote-xdg-like-open/" + blobPathData.prefix + blobPathData.hashDir + blobPathData.hash + node.extention;
                const elems = PathElement("blob", "/" + blobPathData.prefix + blobPathData.hashDir + blobPathData.hash + node.extention, xdgOpenBlobPath);
                elems.forEach((e)=>{
                    if (this.remoteOpenBlobElement) {
                        this.remoteOpenBlobElement.appendChild(e);
                    }
                });
                this.remoteOpenBlobElement.hidden = false;
            } else {
                this.remoteOpenBlobElement.hidden = true;
            }
        }
        if (this.remoteOpenMetaElement) {
            removeAllChild(this.remoteOpenMetaElement);
            const metaPathData = metaResourcePath(node.hash);
            const xdgOpenMetaPath = remoteStorageURL + "remote-xdg-like-open/" + metaPathData.prefix + metaPathData.hashDir + metaPathData.hash + metaPathData.extention;
            const elems = PathElement("json", "/" + metaPathData.prefix + metaPathData.hashDir + metaPathData.hash + metaPathData.extention, xdgOpenMetaPath);
            elems.forEach((e)=>{
                if (this.remoteOpenMetaElement) {
                    this.remoteOpenMetaElement.appendChild(e);
                }
            });
        }
        this.reloadTagSelectorDataList();
    }
    reloadTagSelectorDataList = ()=>{
        const tagDict1 = this.tagHashDict();
        const datalist1 = Object.values(tagDict1).map((e)=>e.title
        );
        const dl = document.getElementById("li-tag-datalist");
        if (!isNull(dl)) {
            while(dl.firstChild){
                dl.removeChild(dl.firstChild);
            }
            datalist1.forEach((e)=>{
                let option = document.createElement('option');
                option.value = e;
                dl.appendChild(option);
            });
        }
    };
}
const objToRecurisveAccordionMenu = (document2, obj)=>{
    const root = document2.createElement('ul');
    root.classList.add('accordion-child');
    Object.entries(obj).forEach(([key2, value])=>{
        const li = document2.createElement('li');
        const label = document2.createElement('label');
        label.innerText = `${key2.substring(0, 10)}: `;
        li.appendChild(label);
        if (typeof value == 'object') {
            const accordion = document2.createElement('input');
            accordion.type = 'checkbox';
            accordion.classList.add('toggle');
            li.appendChild(accordion);
            const ul = objToRecurisveAccordionMenu(document2, value);
            li.appendChild(ul);
        } else if (typeof value == 'string' || typeof value == 'number') {
            const child = document2.createElement('input');
            child.value = value.toString();
            li.appendChild(child);
        }
        root.appendChild(li);
    });
    return root;
};
const removeAllChild = (target)=>{
    while(target.firstChild){
        target.removeChild(target.firstChild);
    }
};
const textToClipBoard = (document2, text2)=>{
    const tempElement = document2.createElement("textarea");
    tempElement.textContent = text2;
    document2.body.appendChild(tempElement);
    document2.getSelection()?.selectAllChildren(tempElement);
    tempElement.select();
    var success = document2.execCommand('copy');
    document2.body.removeChild(tempElement);
    return success;
};
const PathElement = (name, copyString, onClickRequestPath)=>{
    const elems = [];
    const copy = document.createElement("button");
    copy.onclick = ()=>{
        textToClipBoard(document, copyString);
    };
    copy.innerText = `${name}: pathToClipboard`;
    elems.push(copy);
    const request = document.createElement("button");
    request.onclick = ()=>{
        GetRequest(onClickRequestPath);
    };
    request.innerText = `${name}: remoteXdgOpen`;
    elems.push(request);
    return elems;
};
const remoteOrgGet = async (hash4, force = false)=>{
    const pathStruct = orgmodeResourcePath(hash4);
    const path = remoteStorageURL + pathStruct.prefix + pathStruct.hashDir + pathStruct.hash + pathStruct.extention;
    const response = await GetRequest(path);
    if (isNull(response)) return "";
    const text2 = await response.text();
    if (isNull(text2)) {
        console.warn("Text??????????????????????????????????????????????????????");
        return "";
    } else {
        console.log(`remoteOrgGet: ${text2}`);
        return text2;
    }
};
const org2Html = (orgText)=>{
    const orgDocument = new mod.Parser().parse(orgText);
    const html = orgDocument.convert(mod.ConverterHTML, {
    });
    return html;
};
const ForceGraphUpdate = (nodes, height, width)=>{
    const BOUNCE = 0.05;
    const COULOMB = 600;
    const ATTENUATION = 0.7;
    const ret = Object.entries(nodes).map(([key2, target])=>{
        let vx = 0;
        let vy = 0;
        if (target.movable) {
            let fx = 0;
            let fy = 0;
            Object.entries(nodes).forEach(([edgeTargetUri, n])=>{
                if (key2 != edgeTargetUri) {
                    const distX = target.x - n.x;
                    const distY = target.y - n.y;
                    const rsq = distX * distX + distY * distY;
                    fx += COULOMB * distX / rsq;
                    fy += COULOMB * distY / rsq;
                }
            });
            const merged = {
                ...target.links,
                ...target.referers
            };
            Object.entries(merged).forEach(([targetUri, edgeInfo])=>{
                if (target.nodeHash != targetUri) {
                    const n = nodes[targetUri];
                    if (n) {
                        Object.entries(edgeInfo).forEach(([hash4, weight])=>{
                            const distX = n.x - target.x;
                            const distY = n.y - target.y;
                            fx += BOUNCE * distX;
                            fy += BOUNCE * distY;
                        });
                    }
                }
            });
            vx = (target.vx + fx) * ATTENUATION;
            vy = (target.vy + fy) * ATTENUATION;
        }
        return [
            key2,
            {
                movable: target.movable,
                nodeHash: target.nodeHash,
                title: target.title,
                thumbnail: target.thumbnail,
                vx: vx,
                vy: vy,
                x: target.x + vx,
                y: target.y + vy,
                links: target.links,
                referers: target.referers
            }
        ];
    });
    return Object.fromEntries(ret);
};
const NodeToForceNode = (node)=>{
    const ret = {
        movable: true,
        nodeHash: node.hash,
        title: node.title,
        thumbnail: node.thumbnail,
        vx: 0,
        vy: 0,
        x: 0,
        y: 0,
        links: node.vector,
        referers: node.referers
    };
    return ret;
};
class NoScopeGraph {
    init = ()=>{
    };
    update = ()=>{
    };
    reload = async ()=>{
    };
    draw = ()=>{
    };
    removeDependancy = ()=>{
    };
}
class ScopeGraphManager {
    bufferSize = 10;
    history = Array();
    historyIndex = -1;
    currentScopeGraph = new NoScopeGraph();
    fetchNode = async (hash4)=>{
        return undefined;
    };
    canvasManager;
    store;
    onNodeSelectedOfView = ()=>{
    };
    constructor(){
    }
    dependancyModuleInjection(canvas, store, onNodeSelectedOfView) {
        this.canvasManager = canvas;
        this.store = store;
        this.onNodeSelectedOfView = onNodeSelectedOfView;
    }
    restart = async (hash4)=>{
        const node = await this.store?.fetch(hash4);
        if (isNull(node)) {
            console.warn(`??????????????????: ${hash4} ???????????????????????????????????????????????????`);
            return false;
        }
        if (isNull(this.canvasManager) || isNull(this.store) || isNull(this.onNodeSelectedOfView)) {
            console.warn("?????????????????????????????????????????????");
            return false;
        }
        this.canvasManager.removeAllEventListner();
        const scope = new SingleNodeTargetScopeGraph(node, this.store.fetch, this.canvasManager, this.onNodeSelectedOfView, this.restart);
        if (scope) {
            await scope.reset();
            this.pushScope(scope);
        }
        return true;
    };
    pushScope(scope) {
        this.currentScopeGraph.removeDependancy();
        this.currentScopeGraph = scope;
    }
    update = ()=>{
        this.currentScopeGraph.update();
    };
    draw = ()=>{
        this.currentScopeGraph.draw();
    };
    currentScopeReload = async ()=>{
        await this.currentScopeGraph.reload();
    };
}
class SingleNodeTargetScopeGraph {
    target;
    fetchNode;
    canvasManager;
    onNodeSelectedOfView;
    nextGraphRender;
    graphNodes = {
    };
    nodes = {
    };
    graph;
    graphId = -1;
    isRebuilding = false;
    updataing = false;
    constructor(target, fetchNode3 = async (uri)=>{
        return undefined;
    }, canvasManager1, onNodeSelectedOfView, nextGraphRender){
        this.target = target;
        this.fetchNode = fetchNode3;
        this.canvasManager = canvasManager1;
        this.onNodeSelectedOfView = onNodeSelectedOfView;
        this.nextGraphRender = nextGraphRender;
        if (target.hash != "545ea538461003efdc8c81c244531b003f6f26cfccf6c0073b3239fdedf49446") {
            this.nodes[target.hash] = NodeToForceNode(target);
            if (canvasManager1.graphCanvas) {
                this.nodes[target.hash].x = canvasManager1.graphCanvas.width / 2;
                this.nodes[target.hash].y = canvasManager1.graphCanvas.height / 2;
            }
        }
    }
    removeDependancy = ()=>{
        if (isNull(this.graph)) {
            return;
        }
        this.canvasManager.removeEventListner('mousemove', this.graph.pointing_check);
        this.canvasManager.removeEventListner('mousedown', this.graph.drag_start);
        this.canvasManager.removeEventListner('mouseup', this.graph.drag_end);
        this.canvasManager.removeEventListner('dblclick', this.graph.doubleClick);
    };
    reset = async ()=>{
        const tempNodeDict = {
        };
        if (this.target.hash != "545ea538461003efdc8c81c244531b003f6f26cfccf6c0073b3239fdedf49446") {
            const criteria = NodeToForceNode(this.target);
            criteria.movable = false;
            tempNodeDict[this.target.hash] = criteria;
        }
        const links = GetNodeEdges(this.target);
        for await (const [hash4, edge] of links){
            const a = await this.fetchNode(hash4);
            if (a) {
                if (a.hash != "545ea538461003efdc8c81c244531b003f6f26cfccf6c0073b3239fdedf49446") {
                    tempNodeDict[a.hash] = NodeToForceNode(a);
                }
            }
        }
        if (this.canvasManager) {
            if (this.graph) {
            } else {
                this.graph = new Graph(this.canvasManager.id(), 30, true, false, null, this.activateNodeCallback, this.deActivateNodeCallback, this.doubleClickedNodeCallback);
                this.graphId = this.graph.id;
                this.canvasManager.addEventListner('mousemove', this.graph.pointing_check);
                this.canvasManager.addEventListner('mousedown', this.graph.drag_start);
                this.canvasManager.addEventListner('mouseup', this.graph.drag_end);
                this.canvasManager.addEventListner('dblclick', this.graph.doubleClick);
            }
            this.rebuildGraph(this.nodes, tempNodeDict);
        }
    };
    activateNodeCallback = async (deactivateNode, activateNode)=>{
        const node = await this.fetchNode(activateNode.hash);
        if (node) {
            this.onNodeSelectedOfView(node);
        }
    };
    deActivateNodeCallback = (deactivateNode)=>{
    };
    doubleClickedNodeCallback = (node)=>{
        this.nextGraphRender(node.hash);
    };
    reload = async ()=>{
        const relaodedTarget = await this.fetchNode(this.target.hash);
        if (relaodedTarget) this.target = relaodedTarget;
        await this.reset();
    };
    graphUpdateTimer = 0;
    update = ()=>{
        if (this.isRebuilding) return;
        if (this.updataing) {
            console.warn("???????????????????????????????????????????????????????????????????????????????????????");
            return;
        }
        this.updataing = true;
        this.ToStableGraph();
        this.updataing = false;
    };
    draw = ()=>{
        if (this.graph) {
            this.graph.draw();
        }
    };
    ToStableGraph = ()=>{
        Object.entries(this.graphNodes).forEach(([hash4, graphNode])=>{
            this.nodes[hash4].x = graphNode.x;
            this.nodes[hash4].y = graphNode.y;
        });
        this.nodes = ForceGraphUpdate(this.nodes, this.canvasManager.height(), this.canvasManager.width());
        Object.entries(this.nodes).forEach(([hash4, node])=>{
            this.graphNodes[hash4].x = node.x;
            this.graphNodes[hash4].y = node.y;
        });
    };
    rebuildGraph = (beforeNodeDict, nodes)=>{
        if (isNull(this.graph)) return;
        this.isRebuilding = true;
        Graph.Clear(this.graphId);
        this.graphNodes = {
        };
        const graph = this.graph;
        Object.values(nodes).forEach((forceNode)=>{
            if (beforeNodeDict[forceNode.nodeHash]) {
                forceNode.x = beforeNodeDict[forceNode.nodeHash].x;
                forceNode.y = beforeNodeDict[forceNode.nodeHash].y;
            } else {
                forceNode.x = RangeRandom(0, this.canvasManager.width());
                forceNode.y = RangeRandom(0, this.canvasManager.height());
            }
            const graphNode = graph.node(forceNode.x, forceNode.y, 40, "", forceNode.nodeHash);
            console.log(`make node ${forceNode.title}`);
            if (isNull(graphNode)) return undefined;
            if (forceNode.thumbnail != "") {
                graphNode.setImage(forceNode.thumbnail);
            } else {
                graphNode.setText(forceNode.title);
            }
            this.graphNodes[forceNode.nodeHash] = graphNode;
        });
        Object.values(nodes).forEach((forceNode)=>{
            Object.entries(forceNode.links).forEach(([key2, edge])=>{
                const target1 = nodes[key2];
                if (!isNull(target1) && this.graphNodes[target1.nodeHash] && forceNode.nodeHash != target1.nodeHash) {
                    const t = target1;
                    console.log(`make edge ${forceNode.title} -> ${t.title}`);
                    Object.entries(edge).forEach(([label, weight])=>{
                        this.graphNodes[forceNode.nodeHash].biDirectional(this.graphNodes[t.nodeHash], "");
                    });
                }
            });
        });
        this.nodes = nodes;
        this.isRebuilding = false;
    };
}
const viewerRequestOfRemoteGet = async (hash4, force = false)=>{
    const pathStruct = metaResourcePath(hash4);
    if (remoteStorageURL == "") {
        console.warn(`\r\n    ??????????????????????????????????????????????????????????????????\r\n    HTML??????????????????????????????????????????????????????????????????????????????????????????\r\n    ???:\r\n    var remoteStorageURL = "https://raw.githubusercontent.com/ArbaVojaganto/hogeRepository/main/"\r\n    `);
    }
    const path = remoteStorageURL + pathStruct.prefix + pathStruct.hashDir + pathStruct.hash + pathStruct.extention;
    const response = await GetRequest(path);
    if (isNull(response)) return [];
    const json = await response.json();
    console.log(json);
    if (Node1.validation(json)) {
        console.log(`remoteGet: ${json}`);
        const nodeArray = [
            json
        ];
        return nodeArray;
    } else {
        console.warn("Node??????????????????????????????????????????????????????");
        return [];
    }
};
class ViewerApplication {
    document;
    containerNode;
    store = new StoredNodes();
    scopeGraphHistory = new ScopeGraphManager();
    globalMenu;
    canvasManager;
    localMenu;
    updateFunctions = [];
    constructor(document2, containerNode){
        this.document = document2;
        this.containerNode = containerNode;
        this.store.setRemoteGetMethod(viewerRequestOfRemoteGet);
        this.scopeGraphHistory = new ScopeGraphManager();
        this.canvasManager = new CanvasManager(this.document, this.containerNode);
    }
    init = ()=>{
        if (isNull(this.canvasManager) || isNull(this.canvasManager.graphCanvas)) return;
        this.canvasManager.init();
        const entryPoint = bufferToHash("entryPoint");
        const n = entryPoint;
        this.scopeGraphHistory.dependancyModuleInjection(this.canvasManager, this.store, this.activateNode);
        this.scopeGraphHistory.restart(n);
        this.update();
        this.globalMenu = GlobalMenu.init(this.document, this.containerNode, this.reload, this.scopeGraphHistory);
        customElements.define('localmenu-div', LocalMenu, {
            extends: 'div'
        });
        customElements.define('node-detail-div', NodeDetail, {
            extends: 'div'
        });
    };
    reload = async ()=>{
        await this.scopeGraphHistory.currentScopeReload();
        if (!isNull(this.localMenu)) {
            this.localMenu.reloadDetail();
        }
    };
    activateNode = (node)=>{
        if (isNull(this.localMenu)) {
            this.localMenu = new LocalMenu(this.store.tagHashDict, this.store.fetch, this.store.update, this.reload);
            this.containerNode.appendChild(this.localMenu);
        }
        this.localMenu.setDetail(node);
    };
    setUpdateFunction = (fn)=>{
        this.updateFunctions.push(fn);
    };
    update = ()=>{
        this.canvasManager?.update();
        this.scopeGraphHistory.update();
        this.scopeGraphHistory.draw();
        this.updateFunctions.forEach((e)=>{
            e();
        });
        requestAnimationFrame(this.update);
    };
}
class LocalMenu extends HTMLDivElement {
    fetchNode;
    updateNode;
    reload;
    detail;
    constructor(tagHashDict1, fetchNode4, updateNode2, reload2){
        super();
        this.fetchNode = fetchNode4;
        this.updateNode = updateNode2;
        this.reload = reload2;
        this.id = "network-graph-local-menu";
        this.detail = new NodeDetail(this.fetchNode);
        this.appendChild(this.detail);
    }
    setDetail(node) {
        if (isNull(this.detail)) return;
        this.detail.setDetail(node);
    }
    reloadDetail() {
        if (!isNull(this.detail)) {
            this.detail.reloadDetail();
        }
    }
}
class GlobalMenu {
    document;
    rootNode;
    reload;
    scopeManager;
    constructor(document3, rootNode2, reload3, scopeManager){
        this.document = document3;
        this.rootNode = rootNode2;
        this.reload = reload3;
        this.scopeManager = scopeManager;
        const toAllScope = document3.createElement("button");
        toAllScope.onclick = ()=>{
            this.scopeManager?.restart(bufferToHash("node"));
        };
        toAllScope.innerText = `toAllScope`;
        rootNode2.appendChild(toAllScope);
        const toTagScope = document3.createElement('button');
        toTagScope.onclick = ()=>{
            this.scopeManager?.restart(bufferToHash("tag"));
        };
        toTagScope.innerText = `toTagScope`;
        rootNode2.appendChild(toTagScope);
        const toBlobScope = document3.createElement('button');
        toBlobScope.onclick = ()=>{
            this.scopeManager?.restart(bufferToHash("blob"));
        };
        toBlobScope.innerText = `toBlobScope`;
        rootNode2.appendChild(toBlobScope);
        const toTodayScope = document3.createElement('button');
        toTodayScope.onclick = ()=>{
            const s = todayString();
            if (s) {
                this.scopeManager?.restart(bufferToHash(s));
            }
        };
        toTodayScope.innerText = `toTodayScope`;
        rootNode2.appendChild(toTodayScope);
    }
    static init = (document4, rootElement, reload4, scopeManager1)=>{
        const globalMenu = document4.createElement("div");
        if (isNull(globalMenu)) return undefined;
        globalMenu.id = "network-graph-global-menu";
        rootElement.appendChild(globalMenu);
        const i5 = new GlobalMenu(document4, globalMenu, reload4, scopeManager1);
        return i5;
    };
}
window.onload = ()=>{
    const container = document.querySelector("#network-graph");
    if (container) {
        const app = new ViewerApplication(document, container);
        app.init();
    }
};
