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