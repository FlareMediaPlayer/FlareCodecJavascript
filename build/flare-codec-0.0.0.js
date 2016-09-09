(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


class VINT{
    
    constructor(raw, width, data){
        this.raw = raw; //used for easily getting id
        this.width = width;
        this.data = data;
    }
    
    static read(dataview, offset){
        
        var tempOctet = dataview.getUint8(offset);
        
        var leadingZeroes = 0;
        var zeroMask = 0x80;
        do{
            if(tempOctet & zeroMask)
                break;
            
            zeroMask = zeroMask >> 1;
            leadingZeroes++;    
            
        }while(leadingZeroes < 8);
        
        //Set the width of the octet
        var vint_width = leadingZeroes + 1;
        var vint_data;
        var vint_raw;


        switch(vint_width){
            case 1:
                vint_raw = tempOctet;
                vint_data = tempOctet & 0x7F;
                break;
            case 2:
                vint_raw = dataview.getUint16(offset);
                vint_data = vint_raw & 0x3FFF;
                break;
            case 3:
                vint_raw = dataview.getUint32(offset) >> 8;
                vint_data = vint_raw & 0x1FFFFF;
                break;
            case 4:
                vint_raw = dataview.getUint32(offset);
                vint_data = vint_raw & 0x0FFFFFFF;
                break;
            case 5:
                vint_raw = dataview.getUint32(offset);
                var secondInt = dataview.getUint8(offset + 4);
                vint_raw = (firstInt << 8) | secondInt;
                vint_data = vint_raw & 0x07FFFFFFFF;
                break;
            case 6:
                vint_raw = dataview.getUint32(offset);
                var secondInt = dataview.getUint16(offset + 4);
                vint_raw = (firstInt << 16) | secondInt;
                vint_data = vint_raw & 0x01FFFFFFFFFF;
                break;
            case 7:
                vint_raw = dataview.getUint32(offset);
                var secondInt = dataview.getUint32(offset + 4) & 0xFFFFFF;
                vint_raw = (firstInt << 24) | secondInt;
                vint_data = vint_raw & 0x01FFFFFFFFFFFF;
                break;
            case 8:
                //Largest allowable integer in javascript is 2^53-1 so gonna have to use one less bit for now
                vint_raw = dataview.getFloat64(offset);
                var firstInt = dataview.getUint32(offset) & 0x000FFFFF;
                var secondInt = dataview.getUint32(offset + 4);
                vint_data = (firstInt << 32) | secondInt;
                break;
        }
        
        return new VINT(vint_raw, vint_width, vint_data);
        
    }
    
}

module.exports = VINT;
},{}],2:[function(require,module,exports){
module.exports = Object.freeze({
    KEY_FRAME: 0,
    CS_RGB: 7,


    //typedef uint8_t TX_SIZE,
    TX_4X4: 0, // 4x4 transform
    TX_8X8: 1, // 8x8 transform
    TX_16X16: 2, // 16x16 transform
    TX_32X32: 3, // 32x32 transform


    //typedef TX_MODE
    ONLY_4X4: 0, // only 4x4 transform used
    ALLOW_8X8: 1, // allow block transform size up to 8x8
    ALLOW_16X16: 2, // allow block transform size up to 16x16
    ALLOW_32X32: 3, // allow block transform size up to 32x32
    TX_MODE_SELECT: 4, // transform specified for each block


    BLOCK_4X4: 0,
    BLOCK_4X8: 1,
    BLOCK_8X4: 2,
    BLOCK_8X8: 3,
    BLOCK_8X16: 4,
    BLOCK_16X8: 5,
    BLOCK_16X16: 6,
    BLOCK_16X32: 7,
    BLOCK_32X16: 8,
    BLOCK_32X32: 9,
    BLOCK_32X64: 10,
    BLOCK_64X32: 11,
    BLOCK_64X64: 12,
    BLOCK_SIZES: 13,

    //typedef PARTITION_TYPE,
    PARTITION_NONE: 0,
    PARTITION_HORZ: 1,
    PARTITION_VERT: 2,
    PARTITION_SPLIT: 3,


    REFS_PER_FRAME: 3,
    MV_FR_SIZE: 4,
    MVREF_NEIGHBOURS: 8,
    BLOCK_SIZE_GROUPS: 4,
    BLOCK_INVALID: 14,

    PARTITION_CONTEXTS: 16,

    MI_SIZE: 8,

    MIN_TILE_WIDTH_B64: 4,
    MAX_TILE_WIDTH_B64: 64,
    MAX_MV_REF_CANDIDATES: 2,
    NUM_REF_FRAMES: 8,
    MAX_REF_FRAMES: 4,
    IS_INTER_CONTEXTS: 4,
    COMP_MODE_CONTEXTS: 5,

    REF_CONTEXTS: 5,
    MAX_SEGMENTS: 8,
    SEG_LVL_ALT_Q: 0,
    SEG_LVL_ALT_L: 1,
    SEG_LVL_REF_FRAME: 2,
    SEG_LVL_SKIP: 3,
    SEG_LVL_MAX: 4,
    BLOCK_TYPES: 2,
    REF_TYPES: 2,
    COEF_BANDS: 6,
    PREV_COEF_CONTEXTS: 6,
    UNCONSTRAINED_NODES: 3,
    TX_SIZE_CONTEXTS: 2,
    SWITCHABLE_FILTERS: 3,

    INTERP_FILTER_CONTEXTS: 4,
    SKIP_CONTEXTS: 3,
    PARTITION_TYPES: 4,
    TX_SIZES: 4,
    TX_MODES: 5,
    DCT_DCT: 0,
    ADST_DCT: 1,
    DCT_ADST: 2,
    ADST_ADST: 3,

    MB_MODE_COUNT: 14,
    INTRA_MODES: 10,
    INTER_MODES: 4,
    INTER_MODE_CONTEXTS: 7,

    MV_JOINTS: 4,
    MV_CLASSES: 11,
    CLASS0_SIZE: 2,
    MV_OFFSET_BITS: 10,

    MAX_PROB: 255,
    MAX_MODE_LF_DELTAS: 2,
    COMPANDED_MVREF_THRESH: 8,
    MAX_LOOP_FILTER: 63,

    REF_SCALE_SHIFT: 14,
    SUBPEL_BITS: 4,
    SUBPEL_SHIFTS: 16,
    SUBPEL_MASK: 15,

    MV_BORDER: 128,
    INTERP_EXTEND: 4,
    BORDERINPIXELS: 160,
    MAX_UPDATE_FACTOR: 128,

    COUNT_SAT: 20,
    BOTH_ZERO: 0,
    ZERO_PLUS_PREDICTED: 1,
    BOTH_PREDICTED: 2,
    NEW_PLUS_NON_INTRA: 3,
    BOTH_NEW: 4,
    INTRA_PLUS_NON_INTRA: 5,
    BOTH_INTRA: 6,
    INVALID_CASE: 9,
    
    
    


});
},{}],3:[function(require,module,exports){
module.exports = Object.freeze({
    SEGMENTATION_FEATURE_BITS :  [ 8, 6, 2, 0 ],
    SEGMENTATION_FEATURE_SIGNED : [ 1, 1, 0, 0],
    
    
    
    INV_MAP_TABLE: [

        7, 20, 33, 46, 59, 72, 85, 98, 111, 124, 137, 150, 163, 176, 189,
        202, 215, 228, 241, 254, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11,

        12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27,
        28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,

        44, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76,

        77, 78, 79, 80, 81, 82, 83, 84, 86, 87, 88, 89, 90, 91, 92,
        93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,

        109, 110, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 125,
        126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 138, 139, 140, 141,

        142, 143, 144, 145, 146, 147, 148, 149, 151, 152, 153, 154, 155, 156, 157,
        158, 159, 160, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173,

        174, 175, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 190,
        191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 203, 204, 205, 206,

        207, 208, 209, 210, 211, 212, 213, 214, 216, 217, 218, 219, 220, 221, 222,
        223, 224, 225, 226, 227, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238,
        239, 240, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 253
    ]
    
    
    
    
});
},{}],4:[function(require,module,exports){
'use strict';

var CONSTANTS = require('./constants.js');
var TABLES = require('./Tables.js');
var ScanTables = require('./common/ScanTables');
var FixedProbabilityTables = require('./common/FixedProbabilityTables');
var CONVERSION_TABLES = require('./common/ConversionTables');
//var DefaultProbabilityTables;

class Bitstream {
    constructor(dataView) {
        this.dataView = dataView;
        //this.sizeInBytes = dataView.byteLength;
        //this.sizeInBits = this.sizeInBytes*8;
        this.offset = 0;
        this.bitPosition = 0;
    }
    readBit() {
        var bytePosition = Math.floor(this.bitPosition / 8);
        var totalOffset = this.offset + bytePosition;
        var tempByte = this.dataView.getUint8(totalOffset);
        var targetBit = 7 - (this.bitPosition % 8);
        var bit = tempByte >> targetBit;

        this.bitPosition++;
        return (bit & 1);
    }
    /**
     * reads n amount of bits from bitstream;
     * @param {number} n
     */
    f(n) {
        var x = 0;
        for (var i = 0; i < n; i++) {
            x = 2 * x + this.readBit();
        }
        return x;
    }

    s(n) {

        var value = this.f(n);
        var sign = this.f(1);
        return sign ? -value : value;
    }

    L(n) {
        var x = 0;
        for (var i = 0; i < n; i++) {
            x = 2 * x + this.readBool(128);
        }
        return x;
    }
    
    B(p){
       return this.readBool(p); 
    }

    initBool(sz) {
        if (sz < 1)
            console.warn("invalid bool size");
        //9.2.1
        this.boolValue = this.f(8);
        this.boolRange = 255;
        this.boolMaxBits = 8 * sz - 8;
        //this.readBool(0);
    }

    readBool(p) {
        //p range 0 to 255
        var bool;
        this.split = 1 + (((this.boolRange - 1) * p) >> 8);
        if (this.boolValue < this.split) {
            this.boolRange = this.split;
            bool = 0;
        } else {
            this.boolRange -= this.split;
            this.boolValue -= this.split;
            bool = 1;
        }
        while (this.boolRange < 128) {
            var newBit;
            if (this.boolMaxBits > 0) {
                var newBit = this.f(1);
                this.boolMaxBits--;
            } else {
                newBit = 0;

            }
            this.boolRange *= 2;
            this.boolValue = (this.boolValue << 1) + newBit;
        }
        
        return bool;

    }

    readLitteral(n) {
        var x = 0;
        for (var i = 0; i < n; i++) {
            x = 2 * x + this.readBool(128);
        }
        return x;
    }

    exitBool() {
        //var padding = f(this.boolMaxBits);
        console.log(padding);
    }

    
}


class VP9 {
    // DEcoding process = 8
    constructor() {

    }

    decode(dataView, offset, size) {
        //void vp9_decode_frame 2154
        var frame = new Frame(dataView, offset, size);
        frame.decode();
        if(frame.frameHeader.showFrame === 1){
            var w = frame.frameHeader.frameWidth;
            var h = frame.frameHeader.frameHeight;
            var subX = frame.frameHeader.subsamplingX;
            var subY= frame.frameHeader.subsamplingY;
            var decodedFrame;
            return decodedFrame;  
        }
        //Y is luma sample
        //chroma samples are U and V
        /*

− The Y plane is w samples across by h samples down and the sample at location x samples across and y
samples down is given by CurrFrame[ 0 ][ y ][ x ] with x = 0..w - 1 and y = 0..h - 1.
− The U plane is (w + subX) >> subX samples across by (h + subY) >> subY samples down and the sample at location x samples across and y samples down is given by CurrFrame[ 1 ][ y ][ x ] with x = 0..((w + subX) >> subX) - 1 and y = 0..((h + subY) >> subY) - 1.
− The V plane is (w + subX) >> subX samples across by (h + subY) >> subY samples down and the sample at location x samples across and y samples down is given by CurrFrame[ 2 ][ x ][ y ] with x = 0..((w + subX) >> subX) - 1 and y = 0..((h + subY) >> subY) - 1.
− The bit depth for each sample is BitDepth.
        */
       
    }
 
}

class Frame {
    //vp9_decode_frame
    constructor(dataView, offset, size) {
        this.bitstream = new Bitstream(dataView);
        this.bitstream.offset = offset;
        this.frameHeader;
        this.frameContextIdx;
        this.offset = offset;
        this.size = size;
    }

    decode() {
        var offset = this.offset;
        var startBitPos = 0;
        this.frameHeader = new FrameHeader(this.bitstream);
        this.frameHeader.offset = offset;
        this.frameHeader.parse();
        this.trailingBits();
        if (this.frameHeader.headerSizeInBytes === 0) {
            while (this.bitstream.bitPosition < (startBitPos + 8 * this.size))
                this.bitstream.f(1);
            return;
        }
        
        this.loadProbs(this.frameHeader.frameContextIdx);
        this.loadProbs2(this.frameContextIdx);
        this.clearCounts( );
        
        this.bitstream.initBool(this.frameHeader.headerSizeInBytes);
        console.log(this.bitstream);
        this.compressedHeader = new CompressedHeader(this.bitstream , this);
        this.compressedHeader.parse();
   
        
        //this.exitBool();
        /*
        this.endBitPos = this.bitstream.bitPosition;
        this.headerBytes = (this.endBitPos - this.offset);
        this.decodeTiles(this.size - this.headerBytes);
        */
        this.refreshProbs();


    }

    trailingBits() {
        while (this.bitstream.bitPosition & 7)
            this.bitstream.f(1);
    }
    
    loadProbs() {

    }
    
    loadProbs2() {

    }
    
    clearCounts() {

    }

    decodeTiles() {

    }
    refreshProbs() {

    }

}

class CompressedHeader{
    
    constructor(bitstream , frame) {
        this.bitstream = bitstream;
        this.frame = frame;
    }
    
    parse() {
        this.readTxMode();
        if (this.isTxMode === CONSTANTS.TX_MODE_SELECT) {
            this.txModeProbs();
        }
        this.readCoefProbs();
        this.readSkipProb();
        if (this.frame.frameIsIntra === 0) {
            this.readInterModeProbs();
            if (this.interpolationFilter === CONSTANTS.SWITCHABLE)
                this.readInterpFilterProbs();
            this.readIsInterProbs();
            this.frameReferenceMode();
            this.frameReferenceModeProbs();
            this.readYmodeProbs();
            this.readPartitionProbs();
            this.mvProbs();
        }
        
        
        console.log(this);
    }
    
    readInterpFilterProbs(){
        
    }
    
    readIsInterProbs(){
        
    }
    
    frameReferenceMode(){
        
    }
    
    frameReferenceModeProbs(){
        
    }
    
    readYmodeProbs(){
        
    }
    
    readPartitionProbs(){
        
    }
    
    mvProbs(){
        
    }

    readCoefProbs() {
        this.maxTxSize = CONVERSION_TABLES.TX_MODE_TO_BIGGEST_TX_SIZE[ this.txMode ];

        for (var txSz = CONSTANTS.TX_4X4; txSz <= this.maxTxSize; txSz++) {
            this.updateProbs = this.bitstream.L(1);
            if (this.updateProbs === 1) {
                for (var i = 0; i < 2; i++)
                    for (var j = 0; j < 2; j++)
                        for (var k = 0; k < 6; k++) {

                            this.maxL = (k === 0) ? 3 : 6;
                            for (var l = 0; l < maxL; l++)
                                for (var m = 0; m < 3; m++)
                                    this.coefProbs[ txSz ][ i ][ j ][ k ][ l ][ m ] = this.diffUpdateProb(this.coefProbs[ txSz ][ i ][ j ][ k ][ l ][ m ])
                        }
            }

        }
    }

    diffUpdateProb(prob) {
        
        var updateProb = this.bitstream.B(252);

        if (updateProb === 1) {
            deltaProb = this.decodeTermSubexp();

            prob = this.invRemapProb(deltaProb, prob);
        }

        return prob;
    }
    
    decodeTermSubexp() {
        var bit = this.bitstream.L(1);
        if (bit === 0) {
            var subExpVal = this.bitstream.L(4);
            return subExpVal;
        }
        bit = this.bitstream.L(1);
        if (bit === 0) {
            var subExpValMinus16 = this.bitstream.L(4);
            return subExpValMinus16 + 16;
        }
        bit = this.bitstream.L(1);
        if (bit === 0) {
            var subExpValMinus32 = this.bitstream.L(5);
            return subExpValMinus32 + 32
        }
        var v = this.bitstream.L(7);
        if (v < 65)
            return v + 64;
        bit = this.bitstream.L(1);
        return (v << 1) - 1 + bit;
    }
    
    invRemapProb(deltaProb, prob) {
        var m = prob;
        var v = deltaProb;
        v = TABLES.INV_MAP_TABLE[v];
        m--;
        if ((m << 1) <= 255)
            m = 1 + this.invRecenterNonneg(v, m);
        else
            m = 255 - this.invRecenterNonneg(v, 255 - 1 - m);
        return m;
    }
    
    invRecenterNonneg(v, m) {
        if (v > 2 * m)
            return v
        if (v & 1)
            return m - ((v + 1) >> 1);
        return m + (v >> 1);
    }
    
    readSkipProb(){
        
    }
    
    readInterModeProbs(){
        
    }
    
    txModeProbs() {

        for (var i = 0; i < CONSTANTS.TX_SIZE_CONTEXTS; i++)
            for (var j = 0; j < CONSTANTS.TX_SIZES - 3; j++)
                this.txProbs8x8[ i ][ j ] = this.diffUpdateProb(this.txProbs8x8[ i ][ j ]);
        for (var i = 0; i < CONSTANTS.TX_SIZE_CONTEXTS; i++)
            for (var j = 0; j < CONSTANTS.TX_SIZES - 2; j++)
                this.txProbs16x16[ i ][ j ] = this.diffUpdateProb(this.txProbs16x16[ i ][ j ]);

        for (var i = 0; i < CONSTANTS.TX_SIZE_CONTEXTS; i++)
            for (var j = 0; j < CONSTANTS.TX_SIZES - 1; j++)
                this.txProbs32x32[ i ][ j ] = this.diffUpdateProb(this.txProbs32x32[ i ][ j ]);

    }
    
    readTxMode() {
        if (this.frame.frameHeader.lossless === true) {
            this.txMode = CONSTANTS.ONLY_4X4;
        } else {
            
            this.txMode = this.bitstream.L(2);
            if (this.txMode === CONSTANTS.ALLOW_32X32) {
                this.txModeSelect = this.bitstream.L(1);

                this.txMode += this.txModeSelect;
            }
        } 
    }
    
    readSkipProb() {
        for (var i = 0; i < CONSTANTS.SKIP_CONTEXTS; i++)
            this.skipProb[ i ] = this.diffUpdateProb(this.skipProb[ i ]);
    }
    
}

class FrameHeader {

    constructor(bitstream) {
        this.bitstream = bitstream;
        //this.dataView = dataView;
        this.offset;
        this.frameMarker;
        this.profileLowBit;
        this.profileHighBit;
        this.profile;
        this.dataOffset;
    }

    parse() {
        //339
        
        this.frameMarker = this.bitstream.f(2); // tempByte >> 6;
        this.profileLowBit = this.bitstream.f(1);
        this.profileHighBit = this.bitstream.f(1);

        this.profile = (this.profileHighBit << 1) + this.profileLowBit;
        if (this.profile === 3) {
            this.bitstream.f(1);
        }

        this.showExistingFrame = this.bitstream.f(1);

        if (this.showExistingFrame === 1) {
            this.frameToShowMapIdx = this.bitstream.f(3);
            this.headerSizeInBytes = 0;
            this.refreshFrameFlags = 0;
            this.loopFilterLevel = 0;
            return;
        }


        this.lastFrameType = this.frameType;
        this.frameType = this.bitstream.f(1);
        this.showFrame = this.bitstream.f(1);
        this.errorResilientMode = this.bitstream.f(1);
        console.log("here");
        if (this.frameType === CONSTANTS.KEY_FRAME) {

            this.frameSyncCode();
            this.colorConfig();
            this.frameSize();
            this.renderSize();
            this.refreshFrameFlags = 0xFF;
            this.frameIsIntra = 1;

        }/* else {
         if (this.showFrame === 0) {
         this.intraOnly = -1;//1 bit f(1)
         } else {
         this.intraOnly = 0;
         }
         this.FrameIsIntra = this.intraOnly;
         if (this.errorResilientMode === 0) {
         resetFrameContext = -1;  // 2 bits f(2)
         } else {
         resetFrameContext = 0;
         }
         if (this.intraOnly === 1) {
         this.frameSyncCode();
         if (this.profile > 0) {
         this.color_config( );
         } else {
         this.colorSpace = -1;//CS_BT_601;
         this.subsamplingS = 1;
         this.subsamplingY = 1;
         this.bitDepth = 8;
         }
         this.refreshFrameFlags = -1;//8 bit f(8)
         this.frameSize();
         this.renderSize();
         } else {
         this.refreshFrameFlags = -1;//8 bitsf(8)
         for (i = 0; i < 3; i++) {
         this.refFrameIdx[ i ] = -1; //3 bits f(3)
         this.refFrameSignBias[ LAST_FRAME + i ] = -1; //1 bitf(1)
         }
         this.frameSizeWithRefs();
         this.allowHighPrecisionMv = -1; //1bit f(1)
         this.read_interpolation_filter( );
         }
         }
         */

        if (this.errorResilientMode === 0) {
            this.refreshFrameContext = this.bitstream.f(1); //f(1)
            this.frameParallelDecodingMode = this.bitstream.f(1); //f(1) 1 bit
        } else {
            this.refreshFrameContext = 0;
            this.frameParallelDecodingMode = 1;
        }

        this.frameContextIdx = this.bitstream.f(1);

        if (this.frameIsIntra || this.errorResilientMode) {
            this.setupPastIndependence();
            if (this.frameType === CONSTANTS.KEY_FRAME || this.errorResilientMode === 1
                    || this.resetFrameContext === 3) {
                for (var i = 0; i < 4; i++) {
                    this.saveProbs(i);
                }
            } else if (resetFrameContext === 2) {
                this.saveProbs(this.frameContextIdx);
            }
            this.frameContextIdx = 0;
        }
        this.loopFilterParams();
        this.quantizationParams();
        this.segmentationParams();
        this.tileInfo();
        this.headerSizeInBytes = this.bitstream.f(16);

        console.log(this);
    }

    setupPastIndependence() {

    }
    
    saveProbs(i){
        
    }

    tileInfo() {
        this.minLog2TileCols = this.calcMinLog2TileCols();
        this.maxLog2TileCols = this.calcMaxLog2TileCols();
        this.tileColsLog2 = this.minLog2TileCols;
        while (this.tileColsLog2 < this.maxLog2TileCols) {
            this.incrementTileColsLog2 = this.bitstream.f(1);
            if (this.incrementTileColsLog2 === 1)
                this.tileColsLog2++;
            else
                break;
        }
        this.tileRowsLog2 = this.bitstream.f(1);
        if (this.tileRowsLog2 == 1) {
            this.incrementTileRowsLog2 = this.bitstream.f(1);
            this.tileRowsLog2 += this.incrementTileRowsLog2;
        }
    }

    frameSyncCode() {
        this.frameSyncCode1 = this.bitstream.f(8);
        this.frameSyncCode2 = this.bitstream.f(8);
        this.frameSyncCode3 = this.bitstream.f(8);
    }

    frameSize() {
        this.frameWidth = this.bitstream.f(16) + 1;
        this.frameHeight = this.bitstream.f(16) + 1;
        this.computeImageSize();
    }

    computeImageSize() {
        //4.9.1
        this.miCols = (this.frameWidth + 7) >> 3;
        this.miRows = (this.frameHeight + 7) >> 3;
        this.sb64Cols = (this.miCols + 7) >> 3;
        this.sb64Rows = (this.miRows + 7) >> 3;
    }

    loopFilterParams() {
        this.loopFilterLevel = this.bitstream.f(6);
        this.loopFilterSharpness = this.bitstream.f(3);
        this.loopFilterDeltaEnabled = this.bitstream.f(1);
        if (this.loopFilterDeltaEnabled === 1) {
            this.loopFilterDeltaUpdate = this.bitstream.f(1);
            if (this.loopFilterDeltaUpdate === 1) {
                for (var i = 0; i < 4; i++) {
                    this.updateRefDelta = this.bitstream.f(1);
                    if (this.updateRefDelta === 1)
                        this.loopFilterRefDeltas[ i ] = this.bitstream.s(6);
                }
                for (var i = 0; i < 2; i++) {
                    this.updateModeDelta = this.bitstream.f(1);
                    if (this.updateModeDelta == 1)
                        this.loopFilterModeDeltas[ i ] = this.bitstream.s(6);
                }
            }
        }
    }

    quantizationParams() {
        this.base_q_idx = this.bitstream.f(8);
        this.delta_q_y_dc = this.readDeltaQ();
        this.delta_q_uv_dc = this.readDeltaQ();
        this.delta_q_uv_ac = this.readDeltaQ();
        this.lossless = this.base_q_idx === 0 && this.delta_q_y_dc === 0 && this.delta_q_uv_dc === 0 && this.delta_q_uv_ac === 0;
    }
    
    readDeltaQ() {
        this.deltaCoded = this.bitstream.f(1);
        if (this.deltaCoded) {
            this.deltaQ = this.bitstream.s(4);
        } else {
            this.deltaQ = 0;
        }
        return this.deltaQ;
    }

    segmentationParams() {
        this.segmentationEnabled = this.bitstream.f(1);
        if (this.segmentationEnabled === 1) {
            this.segmentationUpdateMap = this.bitstream.f(1);
            if (this.segmentationUpdateMap === 1) {
                for (var i = 0; i < 7; i++)
                    this.segmentationTreeProbs[ i ] = this.readProb( );
                this.segmentationTemporalUpdate = this.bitstream.f(1);
                for (var i = 0; i < 3; i++)
                    this.segmentationPredProb[ i ] = this.segmentationTemporalUpdate ? read_prob() : 255;
            }
            this.segmentationUpdateData = this.bitstream.f(1);
            if (this.segmentationUpdateData == 1) {
                this.segmentationAbsOrDeltaUpdate = this.bitstream.f(1);
                for (var i = 0; i < CONSTANTS.MAX_SEGMENTS; i++) {
                    for (var j = 0; j < CONSTANTS.SEG_LVL_MAX; j++) {
                        this.featureValue = 0;
                        this.featureEnabled = this.bitstream.f(1);
                        this.FeatureEnabled[ i ][ j ] = this.featureEnabled;
                        if (this.featureEnabled === 1) {
                            var bitsToRead = TABLES.SEGMENTATION_FEATURE_BITS[ j ];
                            this.featureValue = this.bitstream.f(bitsToRead);
                            if (TABLES.SEGMENTATION_FEATURE_SIGNED[ j ] === 1) {
                                this.featureSign = this.bitstream.f(1);
                                if (featureSign === 1)
                                    featureValue *= -1;
                            }
                        }
                        this.FeatureData[ i ][ j ] = this.featureValue;
                    }
                }
            }
        }
    }

    tileInfo() {
        this.minLog2TileCols = this.calcMinLog2TileCols();
        this.maxLog2TileCols = this.calcMaxLog2TileCols();
        this.tileColsLog2 = this.minLog2TileCols;
        while (this.tileColsLog2 < this.maxLog2TileCols) {
            this.incrementTileColsLog2 = this.bitstream.f(1);
            if (this.incrementTileColsLog2 == 1)
                this.tileColsLog2++
            else
                break;
        }
        this.tileRowsLog2 = this.bitstream.f(1);
        if (this.tileRowsLog2 == 1) {
            this.incrementTileRowsLog2 = this.bitstream.f(1);
            this.tileRowsLog2 += this.incrementTileRowsLog2;
        }
    }   
    
    calcMinLog2TileCols() {
        var minLog2 = 0;
        while ((CONSTANTS.MAX_TILE_WIDTH_B64 << minLog2) < this.sb64Cols)
            minLog2++;
        return minLog2;
    }

    calcMaxLog2TileCols() {
        var maxLog2 = 1;
        while ((this.sb64Cols >> maxLog2) >= CONSTANTS.MIN_TILE_WIDTH_B64)
            maxLog2++;
        return maxLog2 - 1;
    }
    
    readProb() {
        var probCoded = this.bitstream.f(1);
        if (probCoded) {
            prob = this.bitstream.f(8);
        } else {
            prob = 255;
        }
        return prob;
    }

    renderSize() {

        this.renderAndFrameSizeDifferent = this.bitstream.f(1);
        if (this.renderAndFrameSizeDifferent === 1) {
            this.renderWidth = this.bitstream.f(16) + 1;
            this.dataOffset++;
            this.renderHeight = this.bitstream.f(16) + 1;
            this.dataOffset++;
        } else {
            this.renderWidth = this.frameWidth;
            this.renderHeight = this.frameHeight;

        }
    }

    colorConfig() {

        this.dataOffset++;
        if (this.profile >= 2) {
            this.tenOrTwelveBit = this.bitstream.f(1);
            bitOffset = 1;
            this.bitDepth = this.tenOrTwelveBit ? 12 : 10
        } else {
            this.bitDepth = 8;
        }
        this.colorSpace = this.bitstream.f(3);
        if (this.colorSpace != CONSTANTS.CS_RGB) {
            this.colorRange = this.bitstream.f(1);
            if (this.profile == 1 || this.profile == 3) {
                this.subsamplingX = this.bitstream.f(1);
                this.subsamplingY = this.bitstream.f(1);
                this.bitstream.f(1);

            } else {
                this.subsamplingX = 1;
                this.subsamplingY = 1;
            }
        } else {
            this.colorRange = 1;
            if (this.profile == 1 || this.profile == 3) {
                this.subsamplingX = 0;
                this.subsamplingY = 0;
                this.bitstream.f(1);
            }
        }

    }
}
module.exports = VP9;
},{"./Tables.js":3,"./common/ConversionTables":5,"./common/FixedProbabilityTables":6,"./common/ScanTables":7,"./constants.js":8}],5:[function(require,module,exports){
var CONSTANTS = require('../Constants.js');

module.exports = Object.freeze({
    B_WIDTH_LOG2_LOOKUP: [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4],

    B_HEIGHT_LOG2_LOOKUP: [0, 1, 0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4],

    NUM_4x4_BLOCKS_WIDE_LOOKUP: [1, 1, 2, 2, 2, 4, 4, 4, 8, 8, 8, 16, 16],
    NUM_4x4_BLOCKS_HIGH_LOOKUP: [1, 2, 1, 2, 4, 2, 4, 8, 4, 8, 16, 8, 16],
    MI_WIDTH_LOG2_LOOKUP: [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3],
    NUM_8x8_BLOCKS_WIDE_LOOKUP: [1, 1, 1, 1, 1, 2, 2, 2, 4, 4, 4, 8, 8],
    MI_HEIGHT_LOG2_LOOKUP: [0, 0, 0, 0, 1, 0, 1, 2, 1, 2, 3, 2, 3],
    NUM_8x8_BLOCKS_HIGH_LOOKUP: [1, 1, 1, 1, 2, 1, 2, 4, 2, 4, 8, 4, 8],
    SIZE_GROUP_LOOKUP: [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3],

    TX_MODE_TO_BIGGEST_TX_SIZE: [
        CONSTANTS.TX_4X4,
        CONSTANTS.TX_8X8,
        CONSTANTS.TX_16X16,
        CONSTANTS.TX_32X32,
        CONSTANTS.TX_32X32
    ],

    SUBSIZE_LOOKUP: [
        [// PARTITION_NONE
            CONSTANTS.BLOCK_4X4, CONSTANTS.BLOCK_4X8, CONSTANTS.BLOCK_8X4,
            CONSTANTS.BLOCK_8X8, CONSTANTS.BLOCK_8X16, CONSTANTS.BLOCK_16X8,
            CONSTANTS.BLOCK_16X16, CONSTANTS.BLOCK_16X32, CONSTANTS.BLOCK_32X16,
            CONSTANTS.BLOCK_32X32, CONSTANTS.BLOCK_32X64, CONSTANTS.BLOCK_64X32,
            CONSTANTS.BLOCK_64X64
        ], [// PARTITION_HORZ
            CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_8X4, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_16X8, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_32X16, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_64X32
        ], [// PARTITION_VERT
            CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_4X8, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_8X16, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_16X32, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_32X64
        ], [// PARTITION_SPLIT
            CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_4X4, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_8X8, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_16X16, CONSTANTS.BLOCK_INVALID, CONSTANTS.BLOCK_INVALID,
            CONSTANTS.BLOCK_32X32
        ]
    ],

    COEFBAND_4x4: [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5],

    COEFBAND_8x8PLUS: [
        0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
    ],

    ENERGY_CLASS: [0, 1, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5],

    MODE2TXFM_MAP: [
        CONSTANTS.DCT_DCT, // DC
        CONSTANTS.ADST_DCT, // V
        CONSTANTS.DCT_ADST, // H
        CONSTANTS.DCT_DCT, // D45
        CONSTANTS.ADST_ADST, // D135
        CONSTANTS.ADST_DCT, // D117
        CONSTANTS.DCT_ADST, // D153
        CONSTANTS.DCT_ADST, // D207
        CONSTANTS.ADST_DCT, // D63
        CONSTANTS.ADST_ADST, // TM
        CONSTANTS.DCT_DCT, // NEARESTMV
        CONSTANTS.DCT_DCT, // NEARMV
        CONSTANTS.DCT_DCT, // ZEROMV
        CONSTANTS.DCT_DCT // NEWMV
    ]

});
},{"../Constants.js":2}],6:[function(require,module,exports){
'use strict';
module.exports = Object.freeze({
    KF_PARTITION_PROBS: [
// 8x8 -> 4x4

        [158, 97, 94], // a/l both not split
        [93, 24, 99], //asplit,lnotsplit

        [85, 119, 44], //lsplit,anotsplit
        [62, 59, 67], // a/l both split

// 16x16 -> 8x8
        [149, 53, 53], // a/l both not split

        [94, 20, 48], //asplit,lnotsplit
        [83, 53, 24], //lsplit,anotsplit
        [52, 18, 18], // a/l both split
// 32x32 -> 16x16
        [150, 40, 39], // a/l both not split
        [78, 12, 26], //asplit,lnotsplit
        [67, 33, 11], //lsplit,anotsplit
        [24, 7, 5], //a/lbothsplit
// 64x64 -> 32x32
        [174, 35, 49], // a/l both not split
        [68, 11, 27], //asplit,lnotsplit
        [57, 15, 9], //lsplit,anotsplit
        [12, 3, 3], //a/lbothsplit
    ],

    KF_Y_MODE_PROBS: [
        [//above=dc
            [137, 30, 42, 148, 151, 207, 70, 52, 91], //left=dc

            [92, 45, 102, 136, 116, 180, 74, 90, 100], //left=v
            [73, 32, 19, 187, 222, 215, 46, 34, 100], //left=h
            [91, 30, 32, 116, 121, 186, 93, 86, 94], //left=d45
            [72, 35, 36, 149, 68, 206, 68, 63, 105], // left = d135 [ 73, 31, 28, 138, 57, 124, 55, 122, 151 ], // left = d117 [ 67, 23, 21, 140, 126, 197, 40, 37, 171 ], // left = d153 [ 86, 27, 28, 128, 154, 212, 45, 43, 53 ], // left = d207 [ 74, 32, 27, 107, 86, 160, 63, 134, 102 ], // left = d63 [ 59, 67, 44,140,161,202, 78, 67,119] //left=tm
        ], [//above=v
            [63, 36, 126, 146, 123, 158, 60, 90, 96], //left=dc
            [43, 46, 168, 134, 107, 128, 69, 142, 92], //left=v
            [44, 29, 68, 159, 201, 177, 50, 57, 77], //left=h
            [58, 38, 76, 114, 97, 172, 78, 133, 92], //left=d45
            [46, 41, 76, 140, 63, 184, 69, 112, 57], // left = d135 [ 38, 32, 85, 140, 46, 112, 54, 151, 133 ], // left = d117 [ 39, 27, 61, 131, 110, 175, 44, 75, 136 ], // left = d153 [ 52, 30, 74, 113, 130, 175, 51, 64, 58 ], // left = d207 [ 47, 35, 80,100, 74,143, 64,163, 74], //left=d63
            [36, 61, 116, 114, 128, 162, 80, 125, 82] //left=tm
        ], [//above=h
            [82, 26, 26, 171, 208, 204, 44, 32, 105], //left=dc
            [55, 44, 68, 166, 179, 192, 57, 57, 108], //left=v
            [42, 26, 11, 199, 241, 228, 23, 15, 85], //left=h
            [68, 42, 19, 131, 160, 199, 55, 52, 83], //left=d45
            [58, 50, 25, 139, 115, 232, 39, 52, 118], // left = d135 [ 50, 35, 33, 153, 104, 162, 64, 59, 131 ], // left = d117 [ 44, 24, 16, 150, 177, 202, 33, 19, 156 ], // left = d153 [ 55, 27, 12, 153, 203, 218, 26, 27, 49 ], // left = d207 [ 53, 49, 21,110,116,168, 59, 80, 76], //left=d63
            [38, 72, 19, 168, 203, 212, 50, 50, 107] //left=tm
        ], [//above=d45
            [103, 26, 36, 129, 132, 201, 83, 80, 93], //left=dc
            [59, 38, 83, 112, 103, 162, 98, 136, 90], //left=v
            [62, 30, 23, 158, 200, 207, 59, 57, 50], //left=h
            [67, 30, 29, 84, 86, 191, 102, 91, 59], //left=d45
            [60, 32, 33, 112, 71, 220, 64, 89, 104], // left = d135 [ 53, 26, 34, 130, 56, 149, 84, 120, 103 ], // left = d117 [ 53, 21, 23, 133, 109, 210, 56, 77, 172 ], // left = d153 [ 77, 19, 29, 112, 142, 228, 55, 66, 36 ], // left = d207 [ 61, 29, 29, 93, 97,165, 83,175,162], //left=d63
            [47, 47, 43, 114, 137, 181, 100, 99, 95] //left=tm
        ], [//above=d135
            [69, 23, 29, 128, 83, 199, 46, 44, 101], //left=dc
            [53, 40, 55, 139, 69, 183, 61, 80, 110], //left=v
            [40, 29, 19, 161, 180, 207, 43, 24, 91], //left=h
            [60, 34, 19, 105, 61, 198, 53, 64, 89], //left=d45 [ 52, 31, 22,158, 40,209, 58, 62, 89], //left=d135
            [44, 31, 29, 147, 46, 158, 56, 102, 198], // left = d117 [ 35, 19, 12, 135, 87, 209, 41, 45, 167 ], // left = d153 [ 55, 25, 21,118, 95,215, 38, 39, 66], //left=d207 [ 51, 38, 25,113, 58,164, 70, 93, 97], //left=d63
            [47, 54, 34, 146, 108, 203, 72, 103, 151] //left=tm ],[ //above=d117
                    [ 64, 19, 37, 156, 66, 138, 49, 95, 133], //left=dc
            [46, 27, 80, 150, 55, 124, 55, 121, 135], //left=v
            [36, 23, 27, 165, 149, 166, 54, 64, 118], //left=h
            [53, 21, 36, 131, 63, 163, 60, 109, 81], //left=d45 [ 40, 26, 35, 154, 40, 185, 51, 97, 123 ], // left = d135 [ 35, 19, 34, 179, 19, 97, 48, 129, 124 ], // left = d117 [ 36, 20, 26, 136, 62, 164, 33, 77, 154 ], // left = d153 [ 45, 18, 32,130, 90,157, 40, 79, 91], //left=d207 [ 45, 26, 28, 129, 45, 129, 49, 147, 123 ], // left = d63 [ 38, 44, 51,136, 74,162, 57, 97,121] //left=tm
        ], [//above=d153
            [75, 17, 22, 136, 138, 185, 32, 34, 166], //left=dc
            [56, 39, 58, 133, 117, 173, 48, 53, 187], //left=v
            [35, 21, 12, 161, 212, 207, 20, 23, 145], //left=h
            [56, 29, 19, 117, 109, 181, 55, 68, 112], // left = d45 [ 47, 29, 17, 153, 64, 220, 59, 51, 114 ], // left = d135 [ 46, 16, 24, 136, 76, 147, 41, 64, 172 ], // left = d117 [ 34, 17, 11, 108, 152, 187, 13, 15, 209 ], // left = d153 [ 51, 24, 14, 115, 133, 209, 32, 26, 104 ], // left = d207 [ 55, 30, 18,122, 79,179, 44, 88,116], //left=d63
            [37, 49, 25, 129, 168, 164, 41, 54, 148] //left=tm
        ], [//above=d207
            [82, 22, 32, 127, 143, 213, 39, 41, 70], //left=dc
            [62, 44, 61, 123, 105, 189, 48, 57, 64], //left=v
            [47, 25, 17, 175, 222, 220, 24, 30, 86], //left=h
            [68, 36, 17, 106, 102, 206, 59, 74, 74], //left=d45
            [57, 39, 23, 151, 68, 216, 55, 63, 58], //left=d135 [ 49, 30, 35, 141, 70, 168, 82, 40, 115 ], // left = d117 [ 51, 25, 15, 136, 129, 202, 38, 35, 139 ], // left = d153 [ 68, 26, 16, 111, 141, 215, 29, 28, 28 ], // left = d207 [ 59, 39, 19,114, 75,180, 77,104, 42], //left=d63
            [40, 61, 26, 126, 152, 206, 61, 59, 93] //left=tm
        ], [//above=d63
            [78, 23, 39, 111, 117, 170, 74, 124, 94], //left=dc
            [48, 34, 86, 101, 92, 146, 78, 179, 134], //left=v
            [47, 22, 24, 138, 187, 178, 68, 69, 59], //left=h
            [56, 25, 33, 105, 112, 187, 95, 177, 129], // left = d45 [ 48, 31, 27, 114, 63, 183, 82, 116, 56 ], // left = d135 [ 43, 28, 37, 121, 63, 123, 61, 192, 169 ], // left = d117
            [42, 17, 24, 109, 97, 177, 56, 76, 122], // left = d153
            [58, 18, 28, 105, 139, 182, 70, 92, 63], // left = d207

            [46, 23, 32, 74, 86, 150, 67, 183, 88], //left=d63
            [36, 38, 48, 92, 122, 165, 88, 137, 91] //left=tm

        ], [//above=tm
            [65, 70, 60, 155, 159, 199, 61, 60, 81], //left=dc

            [44, 78, 115, 132, 119, 173, 71, 112, 93], //left=v
            [39, 38, 21, 184, 227, 206, 42, 32, 64], //left=h

            [58, 47, 36, 124, 137, 193, 80, 82, 78], //left=d45
            [49, 50, 35, 144, 95, 205, 63, 78, 59], //left=d135

            [41, 53, 52, 148, 71, 142, 65, 128, 51], // left = d117
            [40, 36, 28, 143, 143, 202, 40, 55, 137], // left = d153

            [52, 34, 29, 129, 183, 227, 42, 35, 43], // left = d207
            [42, 44, 44, 104, 105, 164, 64, 130, 80], // left = d63
            [43, 81, 53, 140, 169, 204, 68, 84, 72] //left=tm
        ]
    ],

    KF_UV_MODE_PROBS: [
        [144, 11, 54, 157, 195, 130, 46, 58, 108], //y=dc
        [118, 15, 123, 148, 131, 101, 44, 93, 131], //y=v
        [113, 12, 23, 188, 226, 142, 26, 32, 125], //y=h
        [120, 11, 50, 123, 163, 135, 64, 77, 103], //y=d45
        [113, 9, 36, 155, 111, 157, 32, 44, 161], //y=d135
        [116, 9, 55, 176, 76, 96, 37, 61, 149], //y=d117
        [115, 9, 28, 141, 161, 167, 21, 25, 193], //y=d153
        [120, 12, 32, 145, 195, 142, 32, 38, 86], //y=d207
        [116, 12, 64, 120, 140, 125, 49, 115, 121], //y=d63
        [102, 19, 66, 162, 182, 122, 35, 59, 128] //y=tm
    ]
});
},{}],7:[function(require,module,exports){
module.exports = Object.freeze({
    DEFAULT_SCAN_4x4: [
        0, 4, 1, 5,
        8, 2, 12, 9,
        3, 6, 13, 10,
        7, 14, 11, 15
    ],
    COL_SCAN_4x4: [
        0, 4, 8, 1,
        12, 5, 9, 2,
        13, 6, 10, 3,
        7, 14, 11, 15
    ],
    ROW_SCAN_4x4: [
        0, 1, 4, 2,
        5, 3, 6, 8,
        9, 7, 12, 10,
        13, 11, 14, 15
    ],

    DEFAULT_SCAN_8x8: [
        0, 8, 1, 16, 9, 2, 17, 24,
        10, 3, 18, 25, 32, 11, 4, 26,
        33, 19, 40, 12, 34, 27, 5, 41,
        20, 48, 13, 35, 42, 28, 21, 6,
        49, 56, 36, 43, 29, 7, 14, 50,
        57, 44, 22, 37, 15, 51, 58, 30,
        45, 23, 52, 59, 38, 31, 60, 53,
        46, 39, 61, 54, 47, 62, 55, 63
    ],

    COL_SCAN_8x8: [
        0, 8, 16, 1, 24, 9, 32, 17,
        2, 40, 25, 10, 33, 18, 48, 3,
        26, 41, 11, 56, 19, 34, 4, 49,
        27, 42, 12, 35, 20, 57, 50, 28,
        5, 43, 13, 36, 58, 51, 21, 44,
        6, 29, 59, 37, 14, 52, 22, 7,
        45, 60, 30, 15, 38, 53, 23, 46,
        31, 61, 39, 54, 47, 62, 55, 63
    ],

    ROW_SCAN_8x8: [
        0, 1, 2, 8, 9, 3, 16, 10,
        4, 17, 11, 24, 5, 18, 25, 12,
        19, 26, 32, 6, 13, 20, 33, 27,
        7, 34, 40, 21, 28, 41, 14, 35,
        48, 42, 29, 36, 49, 22, 43, 15,
        56, 37, 50, 44, 30, 57, 23, 51,
        58, 45, 38, 52, 31, 59, 53, 46,
        60, 39, 61, 47, 54, 55, 62, 63
    ],

    DEFAULT_SCAN_16x16: [
        0, 16, 1, 32, 17, 2, 48, 33, 18, 3, 64, 34, 49, 19, 65, 80,
        50, 4, 35, 66, 20, 81, 96, 51, 5, 36, 82, 97, 67, 112, 21, 52,
        98, 37, 83, 113, 6, 68, 128, 53, 22, 99, 114, 84, 7, 129, 38, 69,
        100, 115, 144, 130, 85, 54, 23, 8, 145, 39, 70, 116, 101, 131, 160, 146,
        55, 86, 24, 71, 132, 117, 161, 40, 9, 102, 147, 176, 162, 87, 56, 25,
        133, 118, 177, 148, 72, 103, 41, 163, 10, 192, 178, 88, 57, 134, 149, 119,
        26, 164, 73, 104, 193, 42, 179, 208, 11, 135, 89, 165, 120, 150, 58, 194,
        180, 27, 74, 209, 105, 151, 136, 43, 90, 224, 166, 195, 181, 121, 210, 59,
        12, 152, 106, 167, 196, 75, 137, 225, 211, 240, 182, 122, 91, 28, 197, 13,
        226, 168, 183, 153, 44, 212, 138, 107, 241, 60, 29, 123, 198, 184, 227, 169,
        242, 76, 213, 154, 45, 92, 14, 199, 139, 61, 228, 214, 170, 185, 243, 108,
        77, 155, 30, 15, 200, 229, 124, 215, 244, 93, 46, 186, 171, 201, 109, 140,
        230, 62, 216, 245, 31, 125, 78, 156, 231, 47, 187, 202, 217, 94, 246, 141,
        63, 232, 172, 110, 247, 157, 79, 218, 203, 126, 233, 188, 248, 95, 173, 142,
        219, 111, 249, 234, 158, 127, 189, 204, 250, 235, 143, 174, 220, 205, 159, 251,
        190, 221, 175, 236, 237, 191, 206, 252, 222, 253, 207, 238, 223, 254, 239, 255
    ],

    COL_SCAN_16x16: [
        0, 16, 32, 48, 1, 64, 17, 80, 33, 96, 49, 2, 65, 112, 18, 81,
        34, 128, 50, 97, 3, 66, 144, 19, 113, 35, 82, 160, 98, 51, 129, 4,
        67, 176, 20, 114, 145, 83, 36, 99, 130, 52, 192, 5, 161, 68, 115, 21,
        146, 84, 208, 177, 37, 131, 100, 53, 162, 224, 69, 6, 116, 193, 147, 85,
        22, 240, 132, 38, 178, 101, 163, 54, 209, 117, 70, 7, 148, 194, 86, 179,
        225, 23, 133, 39, 164, 8, 102, 210, 241, 55, 195, 118, 149, 71, 180, 24,
        87, 226, 134, 165, 211, 40, 103, 56, 72, 150, 196, 242, 119, 9, 181, 227,
        88, 166, 25, 135, 41, 104, 212, 57, 151, 197, 120, 73, 243, 182, 136, 167,
        213, 89, 10, 228, 105, 152, 198, 26, 42, 121, 183, 244, 168, 58, 137, 229,
        74, 214, 90, 153, 199, 184, 11, 106, 245, 27, 122, 230, 169, 43, 215, 59,
        200, 138, 185, 246, 75, 12, 91, 154, 216, 231, 107, 28, 44, 201, 123, 170,
        60, 247, 232, 76, 139, 13, 92, 217, 186, 248, 155, 108, 29, 124, 45, 202,
        233, 171, 61, 14, 77, 140, 15, 249, 93, 30, 187, 156, 218, 46, 109, 125,
        62, 172, 78, 203, 31, 141, 234, 94, 47, 188, 63, 157, 110, 250, 219, 79,
        126, 204, 173, 142, 95, 189, 111, 235, 158, 220, 251, 127, 174, 143, 205, 236,
        159, 190, 221, 252, 175, 206, 237, 191, 253, 222, 238, 207, 254, 223, 239, 255,
    ],

    ROW_SCAN_16x16: [
        0, 1, 2, 16, 3, 17, 4, 18, 32, 5, 33, 19, 6, 34, 48, 20,
        49, 7, 35, 21, 50, 64, 8, 36, 65, 22, 51, 37, 80, 9, 66, 52,
        23, 38, 81, 67, 10, 53, 24, 82, 68, 96, 39, 11, 54, 83, 97, 69,
        25, 98, 84, 40, 112, 55, 12, 70, 99, 113, 85, 26, 41, 56, 114, 100,
        13, 71, 128, 86, 27, 115, 101, 129, 42, 57, 72, 116, 14, 87, 130, 102,
        144, 73, 131, 117, 28, 58, 15, 88, 43, 145, 103, 132, 146, 118, 74, 160,
        89, 133, 104, 29, 59, 147, 119, 44, 161, 148, 90, 105, 134, 162, 120, 176,
        75, 135, 149, 30, 60, 163, 177, 45, 121, 91, 106, 164, 178, 150, 192, 136,
        165, 179, 31, 151, 193, 76, 122, 61, 137, 194, 107, 152, 180, 208, 46, 166,
        167, 195, 92, 181, 138, 209, 123, 153, 224, 196, 77, 168, 210, 182, 240, 108,
        197, 62, 154, 225, 183, 169, 211, 47, 139, 93, 184, 226, 212, 241, 198, 170,
        124, 155, 199, 78, 213, 185, 109, 227, 200, 63, 228, 242, 140, 214, 171, 186,
        156, 229, 243, 125, 94, 201, 244, 215, 216, 230, 141, 187, 202, 79, 172, 110,
        157, 245, 217, 231, 95, 246, 232, 126, 203, 247, 233, 173, 218, 142, 111, 158,
        188, 248, 127, 234, 219, 249, 189, 204, 143, 174, 159, 250, 235, 205, 220, 175,
        190, 251, 221, 191, 206, 236, 207, 237, 252, 222, 253, 223, 238, 239, 254, 255,
    ],

    DEFAULT_SCAN_32x32: [
        0, 32, 1, 64, 33, 2, 96, 65, 34, 128, 3, 97, 66, 160,
        129, 35, 98, 4, 67, 130, 161, 192, 36, 99, 224, 5, 162, 193,
        68, 131, 37, 100,
        225, 194, 256, 163, 69, 132, 6, 226, 257, 288, 195, 101, 164, 38,
        258, 7, 227, 289, 133, 320, 70, 196, 165, 290, 259, 228, 39, 321,
        102, 352, 8, 197,
        71, 134, 322, 291, 260, 353, 384, 229, 166, 103, 40, 354, 323, 292,
        135, 385, 198, 261, 72, 9, 416, 167, 386, 355, 230, 324, 104, 293,
        41, 417, 199, 136,
        262, 387, 448, 325, 356, 10, 73, 418, 231, 168, 449, 294, 388, 105,
        419, 263, 42, 200, 357, 450, 137, 480, 74, 326, 232, 11, 389, 169,
        295, 420, 106, 451,
        481, 358, 264, 327, 201, 43, 138, 512, 482, 390, 296, 233, 170, 421,
        75, 452, 359, 12, 513, 265, 483, 328, 107, 202, 514, 544, 422, 391,
        453, 139, 44, 234,
        484, 297, 360, 171, 76, 515, 545, 266, 329, 454, 13, 423, 203, 108,
        546, 485, 576, 298, 235, 140, 361, 330, 172, 547, 45, 455, 267, 577,
        486, 77, 204, 362,
        608, 14, 299, 578, 109, 236, 487, 609, 331, 141, 579, 46, 15, 173,
        610, 363, 78, 205, 16, 110, 237, 611, 142, 47, 174, 79, 206, 17,
        111, 238, 48, 143,
        80, 175, 112, 207, 49, 18, 239, 81, 113, 19, 50, 82, 114, 51,
        83, 115, 640, 516, 392, 268, 144, 20, 672, 641, 548, 517, 424,
        393, 300, 269, 176, 145,
        52, 21, 704, 673, 642, 580, 549, 518, 456, 425, 394, 332, 301,
        270, 208, 177, 146, 84, 53, 22, 736, 705, 674, 643, 612, 581,
        550, 519, 488, 457, 426, 395,
        364, 333, 302, 271, 240, 209, 178, 147, 116, 85, 54, 23, 737,
        706, 675, 613, 582, 551, 489, 458, 427, 365, 334, 303, 241,
        210, 179, 117, 86, 55, 738, 707,
        614, 583, 490, 459, 366, 335, 242, 211, 118, 87, 739, 615, 491,
        367, 243, 119, 768, 644, 520, 396, 272, 148, 24, 800, 769, 676,
        645, 552, 521, 428, 397, 304,
        273, 180, 149, 56, 25, 832, 801, 770, 708, 677, 646, 584, 553,
        522, 460, 429, 398, 336, 305, 274, 212, 181, 150, 88, 57, 26,
        864, 833, 802, 771, 740, 709,
        678, 647, 616, 585, 554, 523, 492, 461, 430, 399, 368, 337, 306,
        275, 244, 213, 182, 151, 120, 89, 58, 27, 865, 834, 803, 741,
        710, 679, 617, 586, 555, 493,
        462, 431, 369, 338, 307, 245, 214, 183, 121, 90, 59, 866, 835,
        742, 711, 618, 587, 494, 463, 370, 339, 246, 215, 122, 91, 867,
        743, 619, 495, 371, 247, 123,
        896, 772, 648, 524, 400, 276, 152, 28, 928, 897, 804, 773, 680,
        649, 556, 525, 432, 401, 308, 277, 184, 153, 60, 29, 960, 929,
        898, 836, 805, 774, 712, 681,
        650, 588, 557, 526, 464, 433, 402, 340, 309, 278, 216, 185, 154,
        92, 61, 30, 992, 961, 930, 899, 868, 837, 806, 775, 744, 713, 682,
        651, 620, 589, 558, 527,
        496, 465, 434, 403, 372, 341, 310, 279, 248, 217, 186, 155, 124,
        93, 62, 31, 993, 962, 931, 869, 838, 807, 745, 714, 683, 621, 590,
        559, 497, 466, 435, 373,
        342, 311, 249, 218, 187, 125, 94, 63, 994, 963, 870, 839, 746, 715,
        622, 591, 498, 467, 374, 343, 250, 219, 126, 95, 995, 871, 747, 623,
        499, 375, 251, 127,
        900, 776, 652, 528, 404, 280, 156, 932, 901, 808, 777, 684, 653, 560,
        529, 436, 405, 312, 281, 188, 157, 964, 933, 902, 840, 809, 778, 716,
        685, 654, 592, 561,
        530, 468, 437, 406, 344, 313, 282, 220, 189, 158, 996, 965, 934, 903,
        872, 841, 810, 779, 748, 717, 686, 655, 624, 593, 562, 531, 500, 469,
        438, 407, 376, 345,
        314, 283, 252, 221, 190, 159, 997, 966, 935, 873, 842, 811, 749, 718,
        687, 625, 594, 563, 501, 470, 439, 377, 346, 315, 253, 222, 191, 998,
        967, 874, 843, 750,
        719, 626, 595, 502, 471, 378, 347, 254, 223, 999, 875, 751, 627, 503,
        379, 255, 904, 780, 656, 532, 408, 284, 936, 905, 812, 781, 688, 657,
        564, 533, 440, 409,
        316, 285, 968, 937, 906, 844, 813, 782, 720, 689, 658, 596, 565, 534,
        472, 441, 410, 348, 317, 286, 1000, 969, 938, 907, 876, 845, 814, 783,
        752, 721, 690, 659,
        628, 597, 566, 535, 504, 473, 442, 411, 380, 349, 318, 287, 1001, 970,
        939, 877, 846, 815, 753, 722, 691, 629, 598, 567, 505, 474, 443, 381,
        350, 319, 1002, 971,
        878, 847, 754, 723, 630, 599, 506, 475, 382, 351, 1003, 879, 755, 631,
        507, 383, 908, 784, 660, 536, 412, 940, 909, 816, 785, 692, 661, 568,
        537, 444, 413, 972,
        941, 910, 848, 817, 786, 724, 693, 662, 600, 569, 538, 476, 445, 414,
        1004, 973, 942, 911, 880, 849, 818, 787, 756, 725, 694, 663, 632, 601,
        570, 539, 508, 477,
        446, 415, 1005, 974, 943, 881, 850, 819, 757, 726, 695, 633, 602, 571,
        509, 478, 447, 1006, 975, 882, 851, 758, 727, 634, 603, 510, 479,
        1007, 883, 759, 635, 511,
        912, 788, 664, 540, 944, 913, 820, 789, 696, 665, 572, 541, 976, 945,
        914, 852, 821, 790, 728, 697, 666, 604, 573, 542, 1008, 977, 946, 915,
        884, 853, 822, 791,
        760, 729, 698, 667, 636, 605, 574, 543, 1009, 978, 947, 885, 854, 823,
        761, 730, 699, 637, 606, 575, 1010, 979, 886, 855, 762, 731, 638, 607,
        1011, 887, 763, 639,
        916, 792, 668, 948, 917, 824, 793, 700, 669, 980, 949, 918, 856, 825,
        794, 732, 701, 670, 1012, 981, 950, 919, 888, 857, 826, 795, 764, 733,
        702, 671, 1013, 982,
        951, 889, 858, 827, 765, 734, 703, 1014, 983, 890, 859, 766, 735, 1015,
        891, 767, 920, 796, 952, 921, 828, 797, 984, 953, 922, 860, 829, 798,
        1016, 985, 954, 923,
        892, 861, 830, 799, 1017, 986, 955, 893, 862, 831, 1018, 987, 894, 863,
        1019, 895, 924, 956, 925, 988, 957, 926, 1020, 989, 958, 927, 1021,
        990, 959, 1022, 991, 1023
    ]
});
},{}],8:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],9:[function(require,module,exports){
'use strict';

var VINT = require('./VINT.js');
var VP9 = require('./codecs/VP9/VP9.js');


class FlareCodec {

    constructor() {

    }

    testDecode() {
        var codec = VP9;

    }

}

class MasterSegment{
    
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
        this.seekHead;
        this.info;
        this.tracks;
        this.cues;
        this.clusters = [];
        this.clusterCount = 0;
        this.clusterPreloadCount = 0;
        this.clusterSize = 0;
    }
    
    static CreateInstance(dataView, offset){
        //702
        if (offset < 0){
            console.warn("invalid position");
        }
        
        //does not handle unknown size yet
        var elementId = VINT.read(dataView, offset);
        
        if(elementId.raw === Element.IdTable.Segment){
            //console.log("segment found");
            var segment = new MasterSegment(dataView);
            segment.offset = offset;
            offset += elementId.width;
            var elementSize = VINT.read(dataView, offset);
            segment.size = elementSize.data;
            segment.dataOffset = offset + elementSize.width;
            offset+= elementSize.data;
            return segment;
        }
        
    }
    
    loadCluster(){
        //1024
        this.doLoadCluster();
    }
    
    doLoadCluster(){
        //1033
    }
    
    appendCluster(){
        //1335
    }
    
    preloadCluster(){
        //1394
    }
    
    parseTopLevel() {
        //818
        var offset = this.dataOffset;
        var end = offset + this.size;
        var elementId;
        var elementWidth;
        var elementOffset;
        
        while (offset < end) {
            
            //console.log(offset +","+ end);
            elementOffset = offset;
            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;


            switch (elementId.raw) {
                case Element.IdTable.Info:
                    this.info = new SegmentInfo(this.dataView);
                    this.info.offset = elementOffset;
                    this.info.size = elementWidth.data;
                    this.info.dataOffset = offset;
                    this.info.parse();
                    break;
                case Element.IdTable.Tracks:
                    this.tracks = new Tracks(this.dataView);
                    this.tracks.offset = elementOffset;
                    this.tracks.size = elementWidth.data;
                    this.tracks.dataOffset = offset;
                    this.tracks.parse();
                    break;
                case Element.IdTable.Cues:
                    this.cues = new Cues(this.dataView);
                    this.cues.offset = elementOffset;
                    this.cues.size = elementWidth.data;
                    this.cues.dataOffset = offset;
                    break;
                case Element.IdTable.SeekHead:
                    this.seekHead = new SeekHead(this.dataView);
                    this.seekHead.offset = elementOffset;
                    this.seekHead.size = elementWidth.data;
                    this.seekHead.dataOffset = offset;
                    this.seekHead.parse();
                    break;
                case Element.IdTable.Chapters:
                    this.chapters = new Chapters(this.dataView);
                    this.chapters.offset = elementOffset;
                    this.chapters.size = elementWidth.data;
                    this.chapters.dataOffset = offset;
                    this.chapters.parse();
                    break;
                case Element.IdTable.Tags:
                    this.tags = new Tags(this.dataView);
                    this.tags.offset = elementOffset;
                    this.tags.size = elementWidth.data;
                    this.tags.dataOffset = offset;
                    this.tags.parse();
                    break;
                //For now just load cluster data here    
                case Element.IdTable.Cluster:
                    var cluster
                    cluster = new Cluster(this.dataView);
                    cluster.offset = elementOffset;
                    cluster.size = elementWidth.data;
                    cluster.dataOffset = offset;
                    cluster.parse();
                    this.cluster = cluster;
                    break;
                default:
                    console.warn("not found id = " + elementId.raw);
                    break;


            }
            
        
            


            offset += elementWidth.data;
            
        }


    }
    
    load(){
       //1448
        this.parseTopLevel();
        
        //while(true){
          //this.loadCluster();  
        //}
        //
   // Outermost (level 0) segment object has been constructed,
  // and pos designates start of payload.  We need to find the
  // inner (level 1) elements.
/*
  const long long header_status = ParseHeaders();

  if (header_status < 0)  // error
 
  if (header_status > 0)  // underflow
 
  if (m_pInfo == NULL || m_pTracks == NULL)
    return E_FILE_FORMAT_INVALID;

  for (;;) {
    const long status = LoadCluster();

    if (status < 0)  // error
      return status;

    if (status >= 1)  // no more clusters
      return 0;
  }
        */
    }
}

class Cluster{
    
    constructor(dataView){
        
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
        this.timeCode;
        this.entries = [];
        this.entriesSize;
        this.entriesCount;
        this.segment;
        
    }
    
    parse(){
        //6133
        var offset = this.dataOffset;
        var end = offset + this.size;
        var elementId;
        var elementWidth;
        var elementOffset;
        
        while (offset < end) {
            // cluster load 5909
            //console.log(offset +","+ end);
            elementOffset = offset;
            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;


            switch (elementId.raw) {
                
                case Element.IdTable.Timecode:
                    this.timeCode = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.SimpleBlock:
                    var entry = new SimpleBlock(this.dataView);
                    //entry = new Cluster(this.dataView);
                    entry.offset = elementOffset;
                    entry.size = elementWidth.data;
                    entry.dataOffset = offset;
                    entry.parse();
                    this.entries.push(entry);
                    break;
                case Element.IdTable.BlockGroup:
                    
                    console.warn("Need to implement block group");
                    break;
                default:
                    console.warn("not found id = " + elementId.raw);
                    break;


            }
            
        
            


            offset += elementWidth.data;
            
        }


    }
    
    getTime(){
        
    }
    
    getFirstTime(){
        
    }
    
    getLastTime(){
        
    }
    
    
    
}

class BlockEntry{
    
    constructor(dataView){
        
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
        this.kind;
        this.cluster;
    }

}

class Frame{
    
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
    }
    
    read(){
        
    }
    
}

class SimpleBlock extends BlockEntry{
    
    constructor(dataView){
        super(dataView);
        this.offset;
        this.dataOffset;
        this.size;
        this.block = new Block(dataView);
        
    }
    
    parse(){
        this.block.dataOffset = this.dataOffset;
        this.block.size = this.size;
        this.block.parse();
    }
    
}

class Block{
    
    constructor(dataView){
        
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
        this.flags;
        this.track;
        this.timeCode = -1;
        this.frames = [];
        this.frameCount;
        this.discardPadding;
    }
    
    getTime(){
        
    }
    
    isKey(){
        
    }
    
    setKey(){
        
    }
    
    isInvisible(){
        
    }
    
    parse(){
        //7503
        var offset = this.dataOffset;
        var end = offset + this.size;
        var elementId;
        var elementWidth;
        var elementOffset;
        var trackId = VINT.read(this.dataView, offset);
        this.track = trackId.data;
        offset += trackId.width;
        //now read timecode;
        this.timeCode = this.dataView.getInt16(offset);
        offset+=2;
        
        this.flags = this.dataView.getUint8(offset);
        this.lacing = (this.flags & 0x06)>> 1;
        offset++;
        if (this.lacing === 0){
            //no lacing;
            this.frameCount = 1;
            this.frames[0] = new Frame(this.dataView);
            this.frames[0].dataOffset = offset;
            this.frames[0].size = this.size;
        }
        //Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
    }
}

class SeekHead{
    
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
        this.entries = [];
        this.entryCount = 0;
        this.voidElements = [];
        this.voidElementCount = 0;
    }
    
    parse(){
        //1495
        console.log("parsing seek head");
        this.entryCount = 0;
        this.voidElementCount = 0;
        var offset = this.dataOffset;
        var end = this.dataOffset + this.size;
        var elementId;
        var elementWidth;
        var elementOffset;
        
        while (offset < end) {
            
            //console.log(offset +","+ end);
            elementOffset = offset;
            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;
           
           if(elementId.raw === Element.IdTable.Seek){
               var entry = new Entry(this.dataView);
               entry.dataOffset = offset;
               entry.offset = elementOffset;
               entry.size = elementWidth.data;
               entry.parse();
               this.entries.push(entry);
           }else if (elementId.raw === Element.IdTable.Void){
               
           }

            offset += elementWidth.data;
            
        }
        
        this.entryCount = this.entries.length;
        this.voidElementCount = this.voidElements.length;
        
    }
    
}

class Entry{
    
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
        this.id;
        
    }
    
    parse(){
        //1732
        //meeds to start with seek id
        this.voidElementCount = 0;
        var offset = this.dataOffset;
        var end = this.dataOffset + this.size;
        var elementId;
        var elementWidth;
        var elementOffset;
        
        elementOffset = offset;
        elementId = VINT.read(this.dataView, offset);
        if(elementId.raw != Element.IdTable.SeekID){
            console.warn("Seek ID not found");
        }
        
        offset += elementId.width;
        elementWidth = VINT.read(this.dataView, offset);
        offset += elementWidth.width;
        this.id = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
        offset += elementWidth.data;
        
        
        elementId = VINT.read(this.dataView, offset);
        if(elementId.raw != Element.IdTable.SeekPosition){
            console.warn("Seek Position not found");
        }
        offset += elementId.width;
        elementWidth = VINT.read(this.dataView, offset);
        offset += elementWidth.width;
        this.seekPosition = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
        offset += elementWidth.data;

    }
    
}

class VoidElement{
    
}
class Chapters{
    
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
        
    }
    
    parse(){
        console.log("parsing chapters");
    }
}

class Tags{
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
    }
    
    parse(){
        console.log("parsing tags");
    }
}

class Cues{
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
        this.segment;
        this.cuePoints = [];
        this.count;
        this.preloadCount;
        //this.position;
    }
    
    getCount(){
        return this.cuePoints.length;
    }
    
    init(){
        
    }
    
    preloadCuePoint(){
        
    }
    
    find(){
        
    }
    
    getFirst(){
        
    }
    
    getLast(){
        
    }
    
    getNext(){
        
    }
    
    getBlock(){
        
    }
    
    findOrPreloadCluster(){
        
    }
}
class Tracks{
    
    constructor(dataView){
        this.dataView = dataView;
        this.segment;
        this.offset;
        this.dataOffset;
        this.size;
        this.trackEntries;
        this.trackEntriesEnd;
        
    }
    
    
    
    parse() {
        console.log("parsing tracks");
        this.trackEntries = null;
        this.trackEntriesEnd = null;

        var end = this.dataOffset + this.size;
        var offset = this.dataOffset;
        var count = 0;
        var elementId;
        var elementWidth;
        var elementOffset;

        while (offset < end) {

            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;


            if (elementId.raw === Element.IdTable.TrackEntry) {
                count++;
            }

            offset += elementWidth.data;
            if (offset > end)
                console.warn("invalid track format");

        }

        if (count < 0) {
            return;//done
        }
        
        this.trackEntries = [];//new array(count);
        //this.trackEntriesEnd = this.trackEntries;


        offset = this.dataOffset;
        var payloadEnd;
        var elementTotalSize;
        while (offset < end) {
            //5571
            elementOffset = offset;
            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;

            payloadEnd = offset + elementWidth.data;
            elementTotalSize = payloadEnd - elementOffset;

            if (elementId.raw === Element.IdTable.TrackEntry) {

                this.trackEntries.push(this.ParseTrackEntry(offset, elementWidth.data));

            }
            offset += elementWidth.data;
        }
    }
    
    ParseTrackEntry(dataOffset, size){
        var trackEntry;// = new Track();
        var trackInfo = new TrackInfo();
        var videoSettings = new TrackSettings();
        var audioSettings = new TrackSettings();
        var encodingSettings = new TrackSettings();
        var lacing = 1;

        
        var end = dataOffset + size;
        var offset = dataOffset;
        var elementId;
        var elementWidth;
        var elementOffset;
        var lacing;
        
        while (offset < end) {
            //5621
            elementOffset = offset;
            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;


            switch(elementId.raw){
                case Element.IdTable.Video :
                    videoSettings.offset = elementOffset;
                    videoSettings.dataOffset = offset;
                    videoSettings.size = elementWidth.data;
                    break;
                case Element.IdTable.Audio :
                    audioSettings.offset = elementOffset;
                    audioSettings.dataOffset = offset;
                    audioSettings.size = elementWidth.data;
                    break;
                case Element.IdTable.ContentEncodings :
                    encodingSettings.offset = elementOffset;
                    encodingSettings.dataOffset = offset;
                    encodingSettings.size = elementWidth.data;
                    break;
                case Element.IdTable.TrackUID :
                    //need to get uid
                    break;
                case Element.IdTable.TrackNumber :
                    trackInfo.number = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.TrackType :
                    trackInfo.type = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.Name :
                    trackInfo.name = Element.readString(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.Language :
                    trackInfo.language = Element.readString(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.DefaultDuration :
                    trackInfo.defaultDuration = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.CodecID :
                    trackInfo.codecID = Element.readString(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.FlagLacing :
                    lacing = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
                    if ((lacing < 0) || (lacing > 1))
                        console.warn("invalid lacing");
                    break;
                case Element.IdTable.CodecPrivate :
                    //need to fill binary
                    break;
                case Element.IdTable.CodecName :
                    trackInfo.codecName = Element.readString(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.CodecDelay :
                    trackInfo.codecDelay = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.SeekPreRoll :
                    trackInfo.seekPreRoll = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
                    break;
                default:
                    console.warn("track type not found");
                    break;
            }
            
            
            offset += elementWidth.data;
        }
        
        if (offset != end)
            console.warn("invalid track");

        if (trackInfo.number <= 0)  // not specified
            console.warn("invalid track number");

        //if (GetTrackByNumber(info.number)) //check if track exists
        //return E_FILE_FORMAT_INVALID;

        if (trackInfo.type <= 0)  // not specified
            console.warn("invalid track type");

        trackInfo.lacing = (lacing > 0) ? true : false;
        
        if(trackInfo.type === Track.Video){
            if (videoSettings.offset < 0 || audioSettings.offset >= 0)
                console.warn("invalid video settings");
            trackInfo.settings = videoSettings;
            trackEntry = new VideoTrack(this.dataView, trackInfo);
            trackEntry.parse();
            
        }
     
        
        //console.log(trackInfo);
        return trackEntry;
        
    }

}


class Track{
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.dataOffset;
        this.size;
    }
}



Track.Video = 1;
Track.Audio = 2;

class VideoTrack extends Track{
    
    constructor(dataView , info){
        super(dataView);
        this.width = 0;
        this.height = 0;
        this.displayWidth = 0;
        this.displayHeight = 0;
        this.displayUnit = 0;
        this.stereoMode = 0;

        this.rate = 0.0;
        this.info = info;
        this.settings = info.settings;
        this.dataOffset = this.settings.dataOffset;
        this.offset = this.settings.offset;
        this.size = this.settings.size;
        this.color;
    }
    
    parse(){
        //5197

        var end = this.dataOffset + this.size;
        var offset = this.dataOffset;
        var elementId;
        var elementWidth;
        var elementOffset;

        
        while (offset < end) {
            elementOffset = offset;
            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;


            switch(elementId.raw){
                case Element.IdTable.PixelWidth :
                    this.width = Element.readUnsignedInt(this.dataView, offset, elementWidth.data);
                    break;
                case Element.IdTable.PixelHeight :
                    this.height = Element.readUnsignedInt(this.dataView, offset, elementWidth.data);
                    break;
                case Element.IdTable.DisplayWidth :
                    this.displayWidth = Element.readUnsignedInt(this.dataView, offset, elementWidth.data);
                    break;
                case Element.IdTable.DisplayHeight :
                    this.displayHeight = Element.readUnsignedInt(this.dataView, offset, elementWidth.data);
                    break;
                case Element.IdTable.DisplayUnit :
                    this.displayUnit = Element.readUnsignedInt(this.dataView, offset, elementWidth.data);
                    break;
                case Element.IdTable.StereoMode :
                    this.stereoMode = Element.readUnsignedInt(this.dataView, offset, elementWidth.data);
                    break;
                case Element.IdTable.FrameRate :
                    this.frameRate = Element.readUnsignedInt(this.dataView, offset, elementWidth.data);
                    break;
                case Element.IdTable.Colour:
                    console.log("color");
                    //this.frameRate = Element.readUnsignedInt(this.dataView, offset, elementWidth.data);
                    break;
                default:
                    
                    break;
            }
            
            
            offset += elementWidth.data;
        }
        
        //console.log(this);
    }
    
}

class TrackInfo{
    constructor() {
        this.type = 0;
        this.number = 0;
        this.uid = 0;
        this.defaultDuration = 0;
        this.language;
        this.codecID;
        this.codecName;
    }
}

class TrackSettings{
    constructor(){
        this.offset = -1;
        this.size = -1;
    }
}


class SegmentInfo {
    
    constructor(dataView) {
        this.dataView = dataView;
        this.offset;
        this.size;
        this.dataOffset;
        this.muxingApp;
        this.writingApp;
        this.title;
        this.dataOffset;
        this.timecodeScale;
        this.duration;

    }
    
    parse(){
        console.log("parsing segment info");
        var end = this.dataOffset + this.size;
        var offset = this.dataOffset;
        
        var elementId;
        var elementWidth;
        var elementOffset;
        this.timecodeScale = 1000000;
        this.duration = -1;
                
        while (offset < end) {
            
            elementOffset = offset;
            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;


            switch (elementId.raw) {
                case Element.IdTable.TimecodeScale:
                    this.timecodeScale = Element.readUnsignedInt(this.dataView, offset, elementWidth.data );
                    if (this.timecodeScale <= 0)
                    console.warn("Invalid timecode scale");
                    break;
                case Element.IdTable.Duration:
                    this.duration = Element.readFloat(this.dataView, offset, elementWidth.data );
                    if (this.duration <= 0)
                    console.warn("Invalid duration");
                    break;    
                case Element.IdTable.MuxingApp:
                    this.muxingApp = Element.readString(this.dataView, offset, elementWidth.data );             
                    break;
                case Element.IdTable.WritingApp:
                    this.writingApp = Element.readString(this.dataView, offset, elementWidth.data );
                    
                    break;
                case Element.IdTable.Title:                    
                    this.title = Element.readString(this.dataView, offset, elementWidth.data );
                    break;
                default:
                    console.warn("segment info element not found");
                    break;


            }




            offset += elementWidth.data;
            
        }
        
    }
}


class EBMLHeader{
    
    constructor(dataView){
        this._dataView = dataView;
        this._totalSize = 0;
        this.version;
        this.readVersion;
        this.maxIdLength;
        this.maxSizeLength;
        this.docTypeVersion;
        this.docTypeReadVersion;
    }
    
    getTotalSize(){
        return this._totalSize;
    }
    
    parse(){
        
        var offset = 0;//assume header starts at 0 for now
        var headerOffset = offset;
        var elementId = VINT.read(this._dataView, offset);

        if(elementId.raw != Element.IdTable.EBML){
            console.warn('INVALID HEADER')
        }
        
        offset += elementId.width;
        var elementSize = VINT.read(this._dataView, offset);
        this._totalSize = elementId.width + elementSize.width + elementSize.data;
        offset += elementSize.width;
    
        var element;
        var end = headerOffset + elementId.width + elementSize.width+ elementSize.data; //total header size
        while (offset <  end) {
            element = Element.getElement(this._dataView,offset , end );
            if (element) {
                offset += element.headerSize;
                switch (element.id) {
                    case Element.IdTable.EBMLVersion:
                        this.version = Element.readUnsignedInt(this._dataView, offset, element.size );
                        break;
                    case Element.IdTable.EBMLReadVersion:
                        this.readVersion = Element.readUnsignedInt(this._dataView, offset, element.size );
                        break;
                    case Element.IdTable.EBMLMaxIDLength:
                        this.maxIdLength = Element.readUnsignedInt(this._dataView, offset, element.size );
                        break;
                    case Element.IdTable.EBMLMaxSizeLength:
                        this.maxSizeLength = Element.readUnsignedInt(this._dataView, offset, element.size );
                        break;
                    case Element.IdTable.DocType:
                        this.docType = Element.readString(this._dataView, offset, element.size );
                        break;
                    case Element.IdTable.DocTypeVersion:
                        this.docTypeVersion = Element.readUnsignedInt(this._dataView, offset, element.size );
                        break;
                    case Element.IdTable.DocTypeReadVersion:
                        this.docTypeReadVersion = Element.readUnsignedInt(this._dataView, offset, element.size );
                        break;
                    default:
                        console.log("not found");
                        break;
                }
            }else{
                console.warn("File Reading error in header");
            }

            offset += element.size;
        }

        if (offset != end) {
            console.warn("invalid file format");
        }



        if (this.docType === null || this.docTypeReadVersion <= 0 || this.docTypeVersion <= 0) {
            console.warn("invalid file format");
        }

        // Make sure EBMLMaxIDLength and EBMLMaxSizeLength are valid.
        if (this.maxIdLength <= 0 || this.maxIdLength > 4 || this.maxSizeLength <= 0 ||
                this.maxSizeLength > 8) {
            console.warn("invalid file format");
        }
        
    }
    
}

class Webm {

    constructor(arrayBuffer) {

        this.dataview = new DataView(arrayBuffer);
        this.header = new EBMLHeader(this.dataview );
        this.body = null;
        

    }

    parse() {

        this.header.parse();

        var bodyOffset = this.header.getTotalSize();
        var offset = bodyOffset;
        this.body = MasterSegment.CreateInstance(this.dataview, offset);
        this.body.load();
       
        /*
        var elementId = VINT.read(this.dataview, offset);
        var elementClass = Element.ClassTable[elementId.raw];
        offset += elementId.width;
        var elementSize = VINT.read(this.dataview, offset);
        if (elementClass) {
            var element = new elementClass(this.dataview);
            element.setOffset(bodyOffset);
            element.setSize(elementSize);
            element.parse();
            this.body = element;
        } else {
            console.log("body");
        }
                                        */

        console.log(this);
                                        


    }

    static load(arrayBuffer) {

        var webm = new Webm(arrayBuffer);
        webm.parse();
        /**
         * testing decoding first frame
         */
        //var firstFrame = webm.getFirstFrame();
        var frameData = webm.body.cluster.entries[0].block.frames[0];
        var offset = frameData.dataOffset;
        //console.log(offset);
        var size = frameData.size;
        var vp9 = new VP9();
        vp9.decode(webm.dataview , offset , size);
        return webm;

    }

    toJson() {
        var webm = {
            header: this.header,
            body: this.body
        };

        return JSON.stringify(webm, null, 2);
    }
    
    /**
     * 
     * Testing purposes only
     */
    getFirstFrame(){
        var frameData = this.body.cluster.entries[0].block.frames[0];
        var offset = frameData.dataOffset;
        var size = frameData.size;
        var frameBuffer = frameData.dataView.buffer.slice(offset, offset+size);
        return new DataView(this.dataView , offset);
    }
    /*
     * get parser version
     */
    static getVersion(){
        return {
            major : 1,
            minor : 0,
            build : 0,
            revision :30
        }
    }

}


class Element {

    static readUnsignedInt(dataView, offset, size) {
        //need to fix overflow for 64bit unsigned int
        if (offset < 0 || size <= 0 || size > 8) {
            console.warn("invalid file size");
        }


        var result = 0;
        var b;

        for (var i = 0; i < size; i++) {


            b = dataView.getUint8(offset);
            if(i === 0 && b < 0){
                console.warn ("invalid integer value");
            }

            result <<= 8;
            result |= b;

            offset++;
        }

        return result;
    }
    
    static readFloat(dataView, offset, size) {
        //need to fix overflow for 64bit unsigned int
        if (offset < 0 && (size === 4  || size === 8)) {
            console.warn("invalid float size");
        }

        if (size === 4){
            return dataView.getFloat32(offset);
        }else{
            return dataView.getFloat64(offset);
        }


    }
    
    static readUT8F(dataView, offset, size){
        var tempString = '';
        for (var i = 0; i < size; i++) {
            tempString += String.fromCharCode(dataView.getUint8(offset + i));
        }
        return btoa(tempString);
    }

    static readString(dataView, offset, size) {
        var tempString = '';
        for (var i = 0; i < size; i++) {
            tempString += String.fromCharCode(dataView.getUint8(offset + i));
        }
        return tempString;
    }
    
    static getElement(dataView, offset, end){
        
        var elementOffset = offset;
        if ( offset >= end){ 
            console.warn("read error");
            return false;
        }
            
            
        var elementIdVint = VINT.read(dataView, offset);
        var elementId = elementIdVint.raw;
        
        
        //Validate ID    
        if (elementId < 0){
            console.warn("id read error");
            return false;
        }else if(elementId === 0){
            console.warn("invalid file format");
            return false;
        }
        
        //advance offset and
        offset+= elementIdVint.width;
        if (offset >= end){
            console.warn("read error");
            return false;
        }
        
        //read the element size
        var elementSize = VINT.read(dataView, offset);
        if (elementSize.data < 0 || elementSize.width < 1 || elementSize.width > 8) {
            console.warn("Invalid File Format");
            return false;
        }
        
        //advance offset and
        offset+= elementSize.width;
        if (offset >= end){
            console.warn("read error");
            return false;
        }
         
        var element = new Element(elementIdVint.raw, dataView);
        element.size = elementSize.data;
        element.dataOffset = offset;
        element.headerSize = elementSize.width + elementIdVint.width;
        return element;
    }

    constructor(id, dataView) {

        this._dataView = dataView;
        this._id = id;
        this.id = id;
        this._offset;
        this._size;
        this._totalSize;
        this.dataOffset;
        this.status;
        this.headerSize;
        this.size;

    }

    setSize(size) {
        this._size = size;
    }

    getTotalSize() {
        return this._size.data + this.getIdLength() + this._size.width;
    }

    setOffset(offset) {

        this._offset = offset;

    }

    parse() {
        console.log("Needs to be implemented");
    }

    getIdLength() {
        var length
        switch (this.EBMLClass) {
            case 'A':
                length = 1;
                break;
            case 'B' :
                length = 2;
                break;
            case 'C' :
                length = 3;
                break;
            case 'D' :
                length = 4;
                break;

        }

        return length;
    }
    

}

class EBMLSignedInteger extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.length;// length of octet
        this.value;// value of the integer

    }

    parse() {
        if (this._size.data === 0) {
            this.value = 0;
        } else {
            var tempOffset = this._offset + this.getIdLength() + this._size.width;
            this.value = VINT.read(this._dataView, tempOffset).data;
        }
    }

}

class EBMLUnsignedInteger extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.value;// value of the integer

    }

    parse() {
        //read length amount of bytes
        var tempOctet = 0;
        var readOctet;
        var tempOffset = this._offset + this.getIdLength() + this._size.width;

        for (var i = 0; i < this._size.data; i++) {
            readOctet = this._dataView.getUint8(tempOffset + i);
            tempOctet = tempOctet << (8 * i) | readOctet;
        }

        this.value = tempOctet;

    }

}

class EBMLString extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.length;// 0 to max
        this.value;// value of the integer

    }

    parse() {

        var tempOffset = this._offset + this.getIdLength() + this._size.width; // The offset where the data starts
        var charCount = this._size.data; // Number of characters to read
        var tempString = '';
        for (var i = 0; i < charCount; i++) {
            tempString += String.fromCharCode(this._dataView.getUint8(tempOffset + i));
        }
        this.value = tempString;

    }

}

class EBMLUTF8 extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.length;// 0 to max
        this.value;// value of the integer

    }

    parse() {

        var tempOffset = this._offset + this.getIdLength() + this._size.width; // The offset where the data starts
        var charCount = this._size.data; // Number of characters to read
        var tempString = '';
        for (var i = 0; i < charCount; i++) {
            tempString += String.fromCharCode(this._dataView.getUint8(tempOffset + i));
        }
        this.value = btoa(tempString);

    }

}

class EBMLDate extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.length;// 0 or 8
        this.value;// musted be signed int

    }

}

class EBMLFloat extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.length;// length of octet
        this.value;// value of the integer

    }

}

class EBMLMasterElement extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.length;// 
        this.elements = [];

    }

    getNextElement(internalOffset) {

        var tempOffset = internalOffset;

        var elementOffset = internalOffset;

        var elementId = VINT.read(this._dataView, internalOffset);

        tempOffset += elementId.width;

        var elementSize = VINT.read(this._dataView, tempOffset);
        var elementClass = Element.ClassTable[elementId.raw];
        var element;

        if (elementClass) {

            element = new elementClass(this._dataView);
            element.setOffset(elementOffset);
            element.setSize(elementSize);



        } else {

            console.log("Element Not Found" + elementId.raw);
            return false;

        }

        return element;

    }

    parse() {

        var tempOffset = this._offset + this.getIdLength() + this._size.width;

        var nextElement;

        if (this._id === Element.IdTable.Info) {
            //console.log("total size is is : " + this.getTotalSize());
        }

        while (tempOffset < this._offset + this.getTotalSize()) {

            nextElement = this.getNextElement(tempOffset);
            if (nextElement) {
                this.elements.push(nextElement);
                nextElement.parse();
                tempOffset += nextElement.getTotalSize();
            } else {
                console.log("Element Not Found" + this);
                break;

            }

        }




    }

}

class EBMLBinary extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        //this.length;// 
        this.data;
        this._dataOffset;


    }

    parse() {
        this._dataOffset = this._offset + this.getIdLength() + this._size.width;
    }

}

        /*

class Block extends EBMLBinary {
    
    constructor(dataView) {
        
        super(Element.IdTable.Block, dataView);
        this.EBMLClass = 'A';
        this._m_track;
        this._m_timecode;
        this._m_flags;
        this._m_frames = [];
        this._m_frame_count = 0;

    }

    getTrackNumber() {

    }
    GetTimeCode(cluster) {

    }
    GetTime(cluster) {
    }

    IsKey() {

    }

    SetKey() {

    }
    IsInvisible() {

    }

    GetFrameCount() {

    }

    GetFrame(frameIndex) {

    }

    GetDiscardPadding() {

    }

}
*/

Element.IdTable = {
    //Basics
    EBML: 0x1A45DFA3,
    EBMLVersion: 0x4286,
    EBMLReadVersion: 0x42F7,
    EBMLMaxIDLength: 0x42F2,
    EBMLMaxSizeLength: 0x42F3,
    DocType: 0x4282,
    DocTypeVersion: 0x4287,
    DocTypeReadVersion: 0x4285,
    //Global
    Void: 0xEC,
    //Segment
    Segment: 0x18538067,
    //Meta Seek Information
    SeekHead: 0x114D9B74,
    Seek: 0x4DBB,
    SeekID: 0x53AB,
    SeekPosition: 0x53AC,
    //Segment Information
    Info: 0x1549A966,
    TimecodeScale: 0x2AD7B1,
    Duration: 0x4489,
    DateUTC: 4461,
    Title: 0x7BA9,
    MuxingApp: 0x4D80,
    WritingApp: 0x5741,
    //Cluster
    Cluster: 0x1F43B675,
    Timecode: 0xE7,
    PrevSize: 0xAB,
    SimpleBlock: 0xA3,
    BlockGroup: 0xA0,
    Block: 0xA1,
    BlockAdditions: 0x75A1,
    BlockMore: 0xA6,
    BlockAddID: 0xEE,
    BlockAdditional: 0xA5,
    BlockDuration: 0x9B,
    ReferenceBlock: 0xFB,
    DiscardPadding: 0x75A2,
    //Track
    Tracks: 0x1654AE6B,
    TrackEntry: 0xAE,
    TrackNumber: 0xD7,
    TrackUID: 0x73C5,
    TrackType: 0x83,
    FlagEnabled: 0xB9,
    FlagDefault: 0x88,
    FlagForced: 0x55AA,
    FlagLacing: 0x9C,
    DefaultDuration: 0x23E383,
    Name: 0x536E,
    Language: 0x22B59C,
    CodecID: 0x86,
    CodecPrivate: 0x63A2,
    CodecName: 0x258688,
    CodecDelay: 0x56AA,
    SeekPreRoll: 0x56BB,
    Video: 0xE0,
    FlagInterlaced: 0x9A,
    StereoMode: 0x53B8,
    AlphaMode: 0x53C0,
    PixelWidth: 0xB0,
    PixelHeight: 0xBA,
    PixelCropBottom: 0x54AA,
    PixelCropTop: 0x54BB,
    PixelCropLeft: 0x54CC,
    PixelCropRight: 0x54DD,
    DisplayWidth: 0x54B0,
    DisplayHeight: 0x54BA,
    DisplayUnit: 0x54B2,
    AspectRatioType: 0x54B3,
    Audio: 0xE1,
    SamplingFrequency: 0xB5,
    OutputSamplingFrequency: 0x78B5,
    Channels: 0x9F,
    BitDepth: 0x6264,
    ContentEncodings: 0x6D80,
    ContentEncoding: 0x6240,
    ContentEncodingOrder: 0x5031,
    ContentEncodingScope: 0x5032,
    ContentEncodingType: 0x5033,
    ContentEncryption: 0x5035,
    ContentEncAlgo: 0x47E1,
    ContentEncKeyID: 0x47E2,
    FrameRate: 0x2383E3,
    //ContentEncAESSettings : //For some reason this one isnt in the matroska spec
    //AESSettingsCipherMode //This one too
    //Colour
    Colour: 0x55B0,
    MatrixCoefficients: 0x55B1,
    BitsPerChannel: 0x55B2,
    ChromaSubsamplingHorz: 0x55B3,
    ChromaSubsamplingVert: 0x55B4,
    CbSubsamplingHorz: 0x55B5,
    CbSubsamplingVert: 0x55B6,
    ChromaSitingHorz: 0x55B7,
    ChromaSitingVert: 0x55B8,
    Range: 0x55B9,
    TransferCharacteristics: 0x55BA,
    Primaries: 0x55BB,
    MaxCLL: 0x55BC,
    MaxFALL: 0x55BD,
    MasteringMetadata: 0x55D0,
    PrimaryRChromaticityX: 0x55D1,
    PrimaryRChromaticityY: 0x55D2,
    PrimaryGChromaticityX: 0x55D3,
    PrimaryGChromaticityY: 0x55D4,
    PrimaryBChromaticityX: 0x55D5,
    PrimaryBChromaticityY: 0x55D6,
    WhitePointChromaticityX: 0x55D7,
    WhitePointChromaticityY: 0x55D8,
    LuminanceMax: 0x55D9,
    LuminanceMin: 0x55DA,
    //Cueing Data
    Cues: 0x1C53BB6B,
    CuePoint: 0xBB,
    CueTime: 0xB3,
    CueTrackPositions: 0xB7,
    CueTrack: 0xF7,
    CueClusterPosition: 0xF1,
    CueRelativePosition: 0xF0,
    CueDuration: 0xB2,
    CueBlockNumber: 0x5378,
    //Chapters
    Chapters: 0x1043A770,
    EditionEntry: 0x45B9,
    ChapterAtom: 0xB6,
    ChapterUID: 0x73C4,
    ChapterStringUID: 0x5654,
    ChapterTimeStart: 0x91,
    ChapterTimeEnd: 0x92,
    ChapterDisplay: 0x80,
    ChapString: 0x85,
    ChapLanguage: 0x437E,
    ChapCountry: 0x437E,
    //Tagging
    Tags: 0x1254C367,
    Tag: 0x7373,
    Targets: 0x63C0,
    TargetTypeValue: 0x68CA,
    TargetType: 0x63CA,
    TagTrackUID: 0x63C5,
    SimpleTag: 0x67C8,
    TagName: 0x45A3,
    TagLanguage: 0x447A,
    TagDefault: 0x4487,
    TagString: 0x4487,
    TagBinary: 0x4485
};






console.log(Element.IdTable);

if ("global" === "global") {

    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {

    module.exports.Webm = Webm;

}

},{"./VINT.js":1,"./codecs/VP9/VP9.js":4}]},{},[9]);
