'use strict';

import "./vp9-enums";

const b_width_log2_lookup = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4];
 
const b_height_log2_lookup = [0, 1, 0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4];

const num_4x4_blocks_wide_lookup = [1, 1, 2, 2, 2, 4, 4, 4, 8, 8, 8, 16, 16];

const num_4x4_blocks_high_lookup = [1, 2, 1, 2, 4, 2, 4, 8, 4, 8, 16, 8, 16];

const mi_width_log2_lookup = [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3];

const num_8x8_blocks_wide_lookup = [1, 1, 1, 1, 1, 2, 2, 2, 4, 4, 4, 8, 8];

const num_8x8_blocks_high_lookup = [1, 1, 1, 1, 2, 1, 2, 4, 2, 4, 8, 4, 8];

const size_group_lookup = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3];

const num_pels_log2_lookup = [4, 5, 5, 6, 7, 7, 8, 9, 9, 10, 11, 11, 12];

/*PARTITION_TYPE*/
const partition_lookup = [
  [  // 4X4
    // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
    PARTITION_NONE, PARTITION_INVALID, PARTITION_INVALID,
    PARTITION_INVALID, PARTITION_INVALID, PARTITION_INVALID,
    PARTITION_INVALID, PARTITION_INVALID, PARTITION_INVALID,
    PARTITION_INVALID, PARTITION_INVALID, PARTITION_INVALID,
    PARTITION_INVALID
  ], [  // 8X8
    // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
    PARTITION_SPLIT, PARTITION_VERT, PARTITION_HORZ, PARTITION_NONE,
    PARTITION_INVALID, PARTITION_INVALID, PARTITION_INVALID,
    PARTITION_INVALID, PARTITION_INVALID, PARTITION_INVALID,
    PARTITION_INVALID, PARTITION_INVALID, PARTITION_INVALID
  ], [  // 16X16
    // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
    PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT,
    PARTITION_VERT, PARTITION_HORZ, PARTITION_NONE, PARTITION_INVALID,
    PARTITION_INVALID, PARTITION_INVALID, PARTITION_INVALID,
    PARTITION_INVALID, PARTITION_INVALID
  ], [  // 32X32
    // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
    PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT,
    PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_VERT,
    PARTITION_HORZ, PARTITION_NONE, PARTITION_INVALID,
    PARTITION_INVALID, PARTITION_INVALID
  ], [  // 64X64
    // 4X4, 4X8,8X4,8X8,8X16,16X8,16X16,16X32,32X16,32X32,32X64,64X32,64X64
    PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT,
    PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_SPLIT,
    PARTITION_SPLIT, PARTITION_SPLIT, PARTITION_VERT, PARTITION_HORZ,
    PARTITION_NONE
  ]
];

const subsize_lookup = [
  [     // PARTITION_NONE
    BLOCK_4X4,   BLOCK_4X8,   BLOCK_8X4,
    BLOCK_8X8,   BLOCK_8X16,  BLOCK_16X8,
    BLOCK_16X16, BLOCK_16X32, BLOCK_32X16,
    BLOCK_32X32, BLOCK_32X64, BLOCK_64X32,
    BLOCK_64X64,
  ], [  // PARTITION_HORZ
    BLOCK_INVALID, BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_8X4,     BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_16X8,    BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_32X16,   BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_64X32,
  ], [  // PARTITION_VERT
    BLOCK_INVALID, BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_4X8,     BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_8X16,    BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_16X32,   BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_32X64,
  ], [  // PARTITION_SPLIT
    BLOCK_INVALID, BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_4X4,     BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_8X8,     BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_16X16,   BLOCK_INVALID, BLOCK_INVALID,
    BLOCK_32X32,
  ]
];

const max_txsize_lookup = [
  TX_4X4,   TX_4X4,   TX_4X4,
  TX_8X8,   TX_8X8,   TX_8X8,
  TX_16X16, TX_16X16, TX_16X16,
  TX_32X32, TX_32X32, TX_32X32, TX_32X32
];

const txsize_to_bsize = [
    BLOCK_4X4,  // TX_4X4
    BLOCK_8X8,  // TX_8X8
    BLOCK_16X16,  // TX_16X16
    BLOCK_32X32,  // TX_32X32
];

const tx_mode_to_biggest_tx_size = [
  TX_4X4,  // ONLY_4X4
  TX_8X8,  // ALLOW_8X8
  TX_16X16,  // ALLOW_16X16
  TX_32X32,  // ALLOW_32X32
  TX_32X32,  // TX_MODE_SELECT
];

const ss_size_lookup = [
//  ss_x == 0    ss_x == 0        ss_x == 1      ss_x == 1
//  ss_y == 0    ss_y == 1        ss_y == 0      ss_y == 1
  [[BLOCK_4X4,   BLOCK_INVALID], [BLOCK_INVALID, BLOCK_INVALID]],
  [[BLOCK_4X8,   BLOCK_4X4],     [BLOCK_INVALID, BLOCK_INVALID]],
  [[BLOCK_8X4,   BLOCK_INVALID], [BLOCK_4X4,     BLOCK_INVALID]],
  [[BLOCK_8X8,   BLOCK_8X4],     [BLOCK_4X8,     BLOCK_4X4]],
  [[BLOCK_8X16,  BLOCK_8X8],     [BLOCK_INVALID, BLOCK_4X8]],
  [[BLOCK_16X8,  BLOCK_INVALID], [BLOCK_8X8,     BLOCK_8X4]],
  [[BLOCK_16X16, BLOCK_16X8],    [BLOCK_8X16,    BLOCK_8X8]],
  [[BLOCK_16X32, BLOCK_16X16],   [BLOCK_INVALID, BLOCK_8X16]],
  [[BLOCK_32X16, BLOCK_INVALID], [BLOCK_16X16,   BLOCK_16X8]],
  [[BLOCK_32X32, BLOCK_32X16],   [BLOCK_16X32,   BLOCK_16X16]],
  [[BLOCK_32X64, BLOCK_32X32],   [BLOCK_INVALID, BLOCK_16X32]],
  [[BLOCK_64X32, BLOCK_INVALID], [BLOCK_32X32,   BLOCK_32X16]],
  [[BLOCK_64X64, BLOCK_64X32],   [BLOCK_32X64,   BLOCK_32X32]],
];

// Generates 4 bit field in which each bit set to 1 represents
// a blocksize partition  1111 means we split 64x64, 32x32, 16x16
// and 8x8.  1000 means we just split the 64x64 to 32x32
const partition_context_lookup =
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
        ];
