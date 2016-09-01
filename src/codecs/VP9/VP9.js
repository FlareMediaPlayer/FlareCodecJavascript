'use strict';

var CONSTANTS = require('./constants.js');
var TABLES = require('./Tables.js');

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
        /*
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
        while (this.bitstream.bitPosition & 7)
            this.bitstream.f(1);
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
        this.lossless = this.base_q_idx == 0 && this.delta_q_y_dc == 0 && this.delta_q_uv_dc == 0 && this.delta_q_uv_ac == 0;
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