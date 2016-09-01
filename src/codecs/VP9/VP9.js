'use strict';

var CONSTANTS = require('./constants.js');

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
}


class VP9 {
    constructor() {

    }

    decode(dataView, offset, size) {
        //void vp9_decode_frame 2154
        var frame = new Frame(dataView, offset, size);
        frame.decode();
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
        this.frameHeader = new FrameHeader(this.bitstream);
        this.frameHeader.offset = offset;
        this.frameHeader.parse();
        /*
        this.loadProbs(this.frameContextIdx);
        this.loadProbs2(this.frameContextIdx);
        this.clearCounts( );
        this.initBool(this.frameHeader.getSize());
        this.compressedHeader();
        this.exitBool();
        this.endBitPos = offset;
        this.headerBytes = (this.endBitPos - this.offset);
        this.decodeTiles(this.size - this.headerBytes);
        this.refreshProbs();
        */

    }

    trailingBits() {

    }
    loadProbs() {

    }
    loadProbs2() {

    }
    clearCounts() {

    }
    initBool() {

    }
    compressedHeader() {

    }
    exitBool() {

    }
    decodeTiles() {

    }
    refreshProbs() {

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

    getSize() {
        return -1;
    }

    parse() {
        //339
        
        this.frameMarker = this.bitstream.f(2); // tempByte >> 6;
        this.profileLowBit = this.bitstream.f(1);
        this.profileHighBit = this.bitstream.f(1);
        console.log("parsing");
        console.log(this);

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
        /*
         if (this.frameIsIntra || this.errorResilientMode) {
         this.setupPastIndependence( );
         if (this.frameType === CONSTANTS.KEY_FRAME || this.errorResilientMode === 1
         || this.resetFrameContext === 3) {
         for (i = 0; i < 4; i++) {
         this.save_probs(i);
         }
         } else if (resetFrameContext === 2) {
         this.saveProbs(this.frameContextIdx);
         }
         this.frameContextIdx = 0;
         }
         this.loopFilterParams();
         this.quantization_params();
         this.segmentationParams();
         this.tileInfo(offset);
         this.headerSizeInBytes = this.dataView.getUint16(offset);
         */
        console.log(this);
    }

    setupPastIndependence() {

    }

    tileInfo(offset) {

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

    }

    quantizationParams() {

    }

    segmentationParams() {

    }

    tileInfo() {

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