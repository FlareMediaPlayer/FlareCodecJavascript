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
    INVALID_CASE: 9


});