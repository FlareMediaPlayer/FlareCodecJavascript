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
    //vp9_decode_frame 2157
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
        this.loadProbs2(this.frameHeader.frameContextIdx);
        this.clearCounts( );
        
        this.bitstream.initBool(this.frameHeader.headerSizeInBytes);
        console.log(this.bitstream);
        this.compressedHeader = new CompressedHeader(this.bitstream , this);
        this.compressedHeader.parse();
   
        
        this.bitstream.exitBool();
     
        this.endBitPos = this.bitstream.bitPosition;
        this.headerBytes = (this.endBitPos - this.offset);
        this.decodeTiles(this.size - this.headerBytes);
        
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
    
    clearAboveContext(){
        
    }

    decodeTiles(sz) {
        this.tileCols = 1 << this.frameHeader.tileColsLog2;
        this.tileRows = 1 << this.frameHeader.tileRowsLog2;
        this.clearAboveContext();
        for (var tileRow = 0; tileRow < tileRows; tileRow++) {
            for (var tileCol = 0; tileCol < tileCols; tileCol++) {
                this.lastTile = (tileRow === tileRows - 1) && (tileCol === tileCols - 1)
                if (this.lastTile) {
                    this.tileSize = sz;
                } else {
                    this.tileSize = this.bitstream.f(32);
                    sz -= this.tileSize + 4;
                }
                this.miRowStart = get_tile_offset(tileRow, MiRows, tile_rows_log2)
                this.miRowEnd = get_tile_offset(tileRow + 1, MiRows, tile_rows_log2)
                this.miColStart = get_tile_offset(tileCol, MiCols, tile_cols_log2)
                this.miColEnd = get_tile_offset(tileCol + 1, MiCols, tile_cols_log2)
                this.bitstream.initBool(this.tileSize);

                this.decode_tile();
                this.bitstream.exitBool();

            }
        }
 
    }
    
    getTileOffset(tileNum, mis, tileSzLog2) {
        var sbs = (mis + 7) >> 3;
        var offset = ((tileNum * sbs) >> tileSzLog2) << 3;

        return Math.min(offset, mis);
    }
    
    decode_tile() {
        for (r = MiRowStart; r < MiRowEnd; r += 8) {
            clearLeftContext();
            for (c = MiColStart; c < MiColEnd; c += 8)
                decode_partition(r, c, CONSTANTS.BLOCK_64X64)
        }

    }
    
    decode_partition(r, c, bsize) {
if (r >= MiRows || c >= MiCols)

        return 0
        num8x8 = num_8x8_blocks_wide_lookup[ bsize ]

        halfBlock8x8 = num8x8 >> 1
        hasRows = (r + halfBlock8x8) < MiRows

        hasCols = (c + halfBlock8x8) < MiCols
        partition
        T
        subsize = subsize_lookup[ partition][ bsize ]
        if (subsize < BLOCK_8X8 || partition == PARTITION_NONE) {
decode_block(r, c, subsize)
        } else if (partition == PARTITION_HORZ) {
decode_block(r, c, subsize)
        if (hasRows)
        decode_block(r + halfBlock8x8, c, subsize)
        } else if (partition == PARTITION_VERT) {
decode_block(r, c, subsize)
        if (hasCols)

        decode_block(r, c + halfBlock8x8, subsize)
        } else {
decode_partition(r, c, subsize)
        decode_partition(r, c + halfBlock8x8, subsize)
        decode_partition(r + halfBlock8x8, c, subsize)
        decode_partition(r + halfBlock8x8, c + halfBlock8x8, subsize)
        }
if (bsize == BLOCK_8X8 || partition != PARTITION_SPLIT) {
for (i = 0; i < num8x8; i ++) {
AbovePartitionContext[ c + i ] = 15 >> b_width_log2_lookup[ subsize ]
LeftPartitionContext[ r + i ] = 15 >> b_height_log2_lookup[ subsize ]
        }
}
}
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
                                    this.coefProbs[ txSz ][ i ][ j ][ k ][ l ][ m ] = this.diffUpdateProb(this.coefProbs[ txSz ][ i ][ j ][ k ][ l ][ m ]);
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
            return subExpValMinus32 + 32;
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