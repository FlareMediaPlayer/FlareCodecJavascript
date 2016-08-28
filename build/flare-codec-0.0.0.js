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
'use strict';

var ENUMS = require("./vp9-enums"); //Using same format as libvpx

module.exports = Object.freeze({

    b_width_log2_lookup: [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4],

    b_height_log2_lookup: [0, 1, 0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4],

    num_4x4_blocks_wide_lookup: [1, 1, 2, 2, 2, 4, 4, 4, 8, 8, 8, 16, 16],

    num_4x4_blocks_high_lookup: [1, 2, 1, 2, 4, 2, 4, 8, 4, 8, 16, 8, 16],

    mi_width_log2_lookup: [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3],

    num_8x8_blocks_wide_lookup: [1, 1, 1, 1, 1, 2, 2, 2, 4, 4, 4, 8, 8],

    num_8x8_blocks_high_lookup: [1, 1, 1, 1, 2, 1, 2, 4, 2, 4, 8, 4, 8],

    size_group_lookup: [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3],

    num_pels_log2_lookup: [4, 5, 5, 6, 7, 7, 8, 9, 9, 10, 11, 11, 12],

    /*ENUMS.PARTITION_TYPE*/
    partition_lookup: [
        [// 4X4
            // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
            ENUMS.PARTITION_NONE, ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID
        ], [// 8X8
            // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
            ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_VERT, ENUMS.PARTITION_HORZ, ENUMS.PARTITION_NONE,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID
        ], [// 16X16
            // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
            ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT,
            ENUMS.PARTITION_VERT, ENUMS.PARTITION_HORZ, ENUMS.PARTITION_NONE, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID
        ], [// 32X32
            // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
            ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT,
            ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_VERT,
            ENUMS.PARTITION_HORZ, ENUMS.PARTITION_NONE, ENUMS.PARTITION_INVALID,
            ENUMS.PARTITION_INVALID, ENUMS.PARTITION_INVALID
        ], [// 64X64
            // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
            ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT,
            ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT,
            ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_SPLIT, ENUMS.PARTITION_VERT, ENUMS.PARTITION_HORZ,
            ENUMS.PARTITION_NONE
        ]
    ],

    subsize_lookup: [
        [// ENUMS.PARTITION_NONE
            ENUMS.BLOCK_4X4, ENUMS.BLOCK_4X8, ENUMS.BLOCK_8X4,
            ENUMS.BLOCK_8X8, ENUMS.BLOCK_8X16, ENUMS.BLOCK_16X8,
            ENUMS.BLOCK_16X16, ENUMS.BLOCK_16X32, ENUMS.BLOCK_32X16,
            ENUMS.BLOCK_32X32, ENUMS.BLOCK_32X64, ENUMS.BLOCK_64X32,
            ENUMS.BLOCK_64X64,
        ], [// ENUMS.PARTITION_HORZ
            ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_8X4, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_16X8, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_32X16, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_64X32,
        ], [// ENUMS.PARTITION_VERT
            ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_4X8, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_8X16, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_16X32, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_32X64,
        ], [// ENUMS.PARTITION_SPLIT
            ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_4X4, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_8X8, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_16X16, ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID,
            ENUMS.BLOCK_32X32,
        ]
    ],

    max_txsize_lookup: [
        ENUMS.TX_4X4, ENUMS.TX_4X4, ENUMS.TX_4X4,
        ENUMS.TX_8X8, ENUMS.TX_8X8, ENUMS.TX_8X8,
        ENUMS.TX_16X16, ENUMS.TX_16X16, ENUMS.TX_16X16,
        ENUMS.TX_32X32, ENUMS.TX_32X32, ENUMS.TX_32X32, ENUMS.TX_32X32
    ],

    txsize_to_bsize: [
        ENUMS.BLOCK_4X4, // ENUMS.TX_4X4
        ENUMS.BLOCK_8X8, // ENUMS.TX_8X8
        ENUMS.BLOCK_16X16, // ENUMS.TX_16X16
        ENUMS.BLOCK_32X32, // ENUMS.TX_32X32
    ],

    tx_mode_to_biggest_tx_size: [
        ENUMS.TX_4X4, // ONLY_4X4
        ENUMS.TX_8X8, // ALLOW_8X8
        ENUMS.TX_16X16, // ALLOW_16X16
        ENUMS.TX_32X32, // ALLOW_32X32
        ENUMS.TX_32X32, // ENUMS.TX_MODE_SELECT
    ],

    ss_size_lookup: [
//  ss_x == 0    ss_x == 0        ss_x == 1      ss_x == 1
//  ss_y == 0    ss_y == 1        ss_y == 0      ss_y == 1
        [[ENUMS.BLOCK_4X4, ENUMS.BLOCK_INVALID], [ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID]],
        [[ENUMS.BLOCK_4X8, ENUMS.BLOCK_4X4], [ENUMS.BLOCK_INVALID, ENUMS.BLOCK_INVALID]],
        [[ENUMS.BLOCK_8X4, ENUMS.BLOCK_INVALID], [ENUMS.BLOCK_4X4, ENUMS.BLOCK_INVALID]],
        [[ENUMS.BLOCK_8X8, ENUMS.BLOCK_8X4], [ENUMS.BLOCK_4X8, ENUMS.BLOCK_4X4]],
        [[ENUMS.BLOCK_8X16, ENUMS.BLOCK_8X8], [ENUMS.BLOCK_INVALID, ENUMS.BLOCK_4X8]],
        [[ENUMS.BLOCK_16X8, ENUMS.BLOCK_INVALID], [ENUMS.BLOCK_8X8, ENUMS.BLOCK_8X4]],
        [[ENUMS.BLOCK_16X16, ENUMS.BLOCK_16X8], [ENUMS.BLOCK_8X16, ENUMS.BLOCK_8X8]],
        [[ENUMS.BLOCK_16X32, ENUMS.BLOCK_16X16], [ENUMS.BLOCK_INVALID, ENUMS.BLOCK_8X16]],
        [[ENUMS.BLOCK_32X16, ENUMS.BLOCK_INVALID], [ENUMS.BLOCK_16X16, ENUMS.BLOCK_16X8]],
        [[ENUMS.BLOCK_32X32, ENUMS.BLOCK_32X16], [ENUMS.BLOCK_16X32, ENUMS.BLOCK_16X16]],
        [[ENUMS.BLOCK_32X64, ENUMS.BLOCK_32X32], [ENUMS.BLOCK_INVALID, ENUMS.BLOCK_16X32]],
        [[ENUMS.BLOCK_64X32, ENUMS.BLOCK_INVALID], [ENUMS.BLOCK_32X32, ENUMS.BLOCK_32X16]],
        [[ENUMS.BLOCK_64X64, ENUMS.BLOCK_64X32], [ENUMS.BLOCK_32X64, ENUMS.BLOCK_32X32]],
    ],

// Generates 4 bit field in which each bit set to 1 represents
// a blocksize partition  1111 means we split 64x64, 32x32, 16x16
// and 8x8.  1000 means we just split the 64x64 to 32x32
    partition_context_lookup:
            [
                {above: 15, left: 15},
                {above: 15, left: 14},
                {above: 14, left: 15},
                {above: 14, left: 14},
                {above: 14, left: 12},
                {above: 12, left: 14},
                {above: 12, left: 12},
                {above: 12, left: 8},
                {above: 8, left: 12},
                {above: 8, left: 8},
                {above: 8, left: 0},
                {above: 0, left: 8},
                {above: 0, left: 0}
            ]

});

},{"./vp9-enums":3}],3:[function(require,module,exports){
'use strict';
module.exports = Object.freeze({
    
    MI_SIZE_LOG2: 3,
    MI_BLOCK_SIZE_LOG2: (6 - this.MI_SIZE_LOG2),

    MI_SIZE: (1 << this.MI_SIZE_LOG2),
    MI_BLOCK_SIZE: (1 << this.MI_BLOCK_SIZE_LOG2),

    MI_MASK: (this.MI_BLOCK_SIZE - 1),

    PROFILE_0: 0,
    PROFILE_1: 1,
    PROFILE_2: 2,
    PROFILE_3: 3,
    MAX_PROFILES: 4,

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
    BLOCK_INVALID: this.BLOCK_SIZES,
    //typedef uint8_t BLOCK_SIZE,


    //typedef PARTITION_TYPE,
    PARTITION_NONE: 0,
    PARTITION_HORZ: 1,
    PARTITION_VERT: 2,
    PARTITION_SPLIT: 3,
    PARTITION_TYPES: 4,
    PARTITION_INVALID: this.PARTITION_TYPES,

    //typedef char PARTITION_CONTEXT,

    PARTITION_PLOFFSET: 4, // number of probability models per block size
    PARTITION_CONTEXTS: 4 * this.PARTITION_PLOFFSET,

    // block transform size
    //typedef uint8_t TX_SIZE,
    TX_4X4: 0, // 4x4 transform
    TX_8X8: 1, // 8x8 transform
    TX_16X16: 2, // 16x16 transform
    TX_32X32: 3, // 32x32 transform
    TX_SIZES: 4,

    // frame transform mode
    //typedef TX_MODE
    ONLY_4X4: 0, // only 4x4 transform used
    ALLOW_8X8: 1, // allow block transform size up to 8x8
    ALLOW_16X16: 2, // allow block transform size up to 16x16
    ALLOW_32X32: 3, // allow block transform size up to 32x32
    TX_MODE_SELECT: 4, // transform specified for each block
    TX_MODES: 5,

    //typedef TX_TYPE

    DCT_DCT: 0, // DCT  in both horizontal and vertical
    ADST_DCT: 1, // ADST in vertical, DCT in horizontal
    DCT_ADST: 2, // DCT  in vertical, ADST in horizontal
    ADST_ADST: 3, // ADST in both directions
    TX_TYPES: 4,

    //typedef VP9_REFFRAME
    VP9_LAST_FLAG: 1 << 0,
    VP9_GOLD_FLAG: 1 << 1,
    VP9_ALT_FLAG: 1 << 2,

    //typedef PLANE_TYPE
    PLANE_TYPE_Y: 0,
    PLANE_TYPE_UV: 1,
    PLANE_TYPES: 2,

    DC_PRED: 0, // Average of above and left pixels
    V_PRED: 1, // Vertical
    H_PRED: 2, // Horizontal
    D45_PRED: 3, // Directional 45  deg : round(arctan(1/1) * 180/pi)
    D135_PRED: 4, // Directional 135 deg : 180 - 45
    D117_PRED: 5, // Directional 117 deg : 180 - 63
    D153_PRED: 6, // Directional 153 deg : 180 - 27
    D207_PRED: 7, // Directional 207 deg : 180 + 27
    D63_PRED: 8, // Directional 63  deg : round(arctan(2/1) * 180/pi)
    TM_PRED: 9, // True-motion
    NEARESTMV: 10,
    NEARMV: 11,
    ZEROMV: 12,
    NEWMV: 13,
    MB_MODE_COUNT: 14,
    //typedef uint8_t PREDICTION_MODE,

    INTRA_MODES: (this.TM_PRED + 1),

    INTER_MODES: (1 + this.NEWMV - this.NEARESTMV),

    SKIP_CONTEXTS: 3,
    INTER_MODE_CONTEXTS: 7,

    /* Segment Feature Masks */
    MAX_MV_REF_CANDIDATES: 2,

    INTRA_INTER_CONTEXTS: 4,
    COMP_INTER_CONTEXTS: 5,
    REF_CONTEXTS: 5

});
},{}],4:[function(require,module,exports){
'use strict';

var VINT = require('./VINT.js');
var VP9 = require('./codecs/VP9/common/common-data.js');


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
        this.clusters;
        this.clusterCount = 0;
        this.clusterPreloadCount = 0;
        this.clusterSize = 0;
    }
    
    static CreateInstance(dataView, offset){
        
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
        
    }
    
    doLoadCluster(){
        
    }
    
    appendCluster(){
        
    }
    
    preloadCluster(){
        
    }
    
    parseTopLevel() {
        
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
                default:
                    console.warn("not found id = " + elementId.raw);
                    break;


            }
            
        
            


            offset += elementWidth.data;
            
        }


    }
    
    load(){
        this.parseTopLevel();
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
        return webm;

    }

    toJson() {
        var webm = {
            header: this.header,
            body: this.body
        };

        return JSON.stringify(webm, null, 2);
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








class Frame {

    constructor() {
        this.offset;
        this.size;
    }

    read() {

    }

}

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

},{"./VINT.js":1,"./codecs/VP9/common/common-data.js":2}]},{},[4]);
