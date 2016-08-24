const MI_SIZE_LOG2 = 3;
const MI_BLOCK_SIZE_LOG2 = (6 - MI_SIZE_LOG2);  // 64 = 2^6

const MI_SIZE = (1 << MI_SIZE_LOG2);  // pixels per mi-unit
const MI_BLOCK_SIZE = (1 << MI_BLOCK_SIZE_LOG2);  // mi-units per max block

const MI_MASK = (MI_BLOCK_SIZE - 1);

// Bitstream profiles indicated by 2-3 bits in the uncompressed header.
// 00: Profile 0.  8-bit 4:2:0 only.
// 10: Profile 1.  8-bit 4:4:4, 4:2:2, and 4:4:0.
// 01: Profile 2.  10-bit and 12-bit color only, with 4:2:0 sampling.
// 110: Profile 3. 10-bit and 12-bit color only, with 4:2:2/4:4:4/4:4:0
//                 sampling.
// 111: Undefined profile.

//typedef enum BITSTREAM_PROFILE {  
const PROFILE_0 = 0;
const PROFILE_1 = 1;
const PROFILE_2 = 2;
const PROFILE_3 = 3;
const MAX_PROFILES = 4;


const BLOCK_4X4 = 0;
const BLOCK_4X8 = 1;
const BLOCK_8X4 = 2;
const BLOCK_8X8 = 3;
const BLOCK_8X16 = 4;
const BLOCK_16X8 = 5;
const BLOCK_16X16 = 6;
const BLOCK_16X32 = 7;
const BLOCK_32X16 = 8;
const BLOCK_32X32 = 9;
const BLOCK_32X64 = 10;
const BLOCK_64X32 = 11;
const BLOCK_64X64 = 12;
const BLOCK_SIZES = 13;
const BLOCK_INVALID = BLOCK_SIZES;
//typedef uint8_t BLOCK_SIZE;


//typedef PARTITION_TYPE;
const PARTITION_NONE = 0;
const PARTITION_HORZ = 1;
const PARTITION_VERT = 2;
const PARTITION_SPLIT = 3;
const PARTITION_TYPES = 4;
const PARTITION_INVALID = PARTITION_TYPES;


//typedef char PARTITION_CONTEXT;

const PARTITION_PLOFFSET = 4; // number of probability models per block size
const PARTITION_CONTEXTS = 4 * PARTITION_PLOFFSET;

// block transform size
//typedef uint8_t TX_SIZE;
const TX_4X4  = 0;  // 4x4 transform
const TX_8X8 = 1;   // 8x8 transform
const TX_16X16 = 2;   // 16x16 transform
const TX_32X32 = 3;   // 32x32 transform
const TX_SIZES = 4;

// frame transform mode
//typedef TX_MODE
const  ONLY_4X4 = 0;      // only 4x4 transform used
const  ALLOW_8X8 = 1;        // allow block transform size up to 8x8
const  ALLOW_16X16 = 2;        // allow block transform size up to 16x16
const  ALLOW_32X32 = 3;        // allow block transform size up to 32x32
const  TX_MODE_SELECT = 4;        // transform specified for each block
const  TX_MODES = 5;


//typedef TX_TYPE

const DCT_DCT = 0;                      // DCT  in both horizontal and vertical
const ADST_DCT = 1;                      // ADST in vertical, DCT in horizontal
const DCT_ADST = 2;                      // DCT  in vertical, ADST in horizontal
const ADST_ADST = 3;                      // ADST in both directions
const TX_TYPES = 4;


//typedef VP9_REFFRAME
const VP9_LAST_FLAG = 1 << 0;
const VP9_GOLD_FLAG = 1 << 1;
const VP9_ALT_FLAG = 1 << 2;


//typedef PLANE_TYPE
const PLANE_TYPE_Y = 0;
const PLANE_TYPE_UV = 1;
const PLANE_TYPES = 2;


const DC_PRED = 0;       // Average of above and left pixels
const V_PRED = 1;      // Vertical
const H_PRED = 2;       // Horizontal
const D45_PRED = 3;       // Directional 45  deg = round(arctan(1/1) * 180/pi)
const D135_PRED = 4;       // Directional 135 deg = 180 - 45
const D117_PRED = 5;       // Directional 117 deg = 180 - 63
const D153_PRED = 6;       // Directional 153 deg = 180 - 27
const D207_PRED = 7;       // Directional 207 deg = 180 + 27
const D63_PRED = 8;       // Directional 63  deg = round(arctan(2/1) * 180/pi)
const TM_PRED = 9;       // True-motion
const NEARESTMV = 10;
const NEARMV = 11;
const ZEROMV = 12;
const NEWMV = 13;
const MB_MODE_COUNT = 14;
//typedef uint8_t PREDICTION_MODE;

const INTRA_MODES =  (TM_PRED + 1);

const INTER_MODES =  (1 + NEWMV - NEARESTMV);

const SKIP_CONTEXTS = 3;
const INTER_MODE_CONTEXTS = 7;

/* Segment Feature Masks */
const MAX_MV_REF_CANDIDATES  = 2;

const INTRA_INTER_CONTEXTS = 4;
const COMP_INTER_CONTEXTS = 5;
const REF_CONTEXTS = 5;

