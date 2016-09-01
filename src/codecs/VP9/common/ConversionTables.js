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