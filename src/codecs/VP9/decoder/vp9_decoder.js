'use strict';
/*

#include "vpx/vpx_codec.h"
#include "vpx_dsp/bitreader.h"
#include "vpx_scale/yv12config.h"
#include "vpx_util/vpx_thread.h"

#include "vp9/common/vp9_thread_common.h"
#include "vp9/common/vp9_onyxc_int.h"
#include "vp9/common/vp9_ppflags.h"
#include "vp9/decoder/vp9_dthread.h"

#include "./vp9_rtcd.h"
#include "./vpx_dsp_rtcd.h"
#include "./vpx_scale_rtcd.h"

#include "vpx_mem/vpx_mem.h"
#include "vpx_ports/system_state.h"
#include "vpx_ports/vpx_once.h"
#include "vpx_ports/vpx_timer.h"
#include "vpx_scale/vpx_scale.h"
#include "vpx_util/vpx_thread.h"

#include "vp9/common/vp9_alloccommon.h"
#include "vp9/common/vp9_loopfilter.h"
#include "vp9/common/vp9_onyxc_int.h"
#if CONFIG_VP9_POSTPROC
#include "vp9/common/vp9_postproc.h"
#endif
#include "vp9/common/vp9_quant_common.h"
#include "vp9/common/vp9_reconintra.h"

#include "vp9/decoder/vp9_decodeframe.h"
#include "vp9/decoder/vp9_decoder.h"
#include "vp9/decoder/vp9_detokenize.h"

 */

module.exports = class VP9Decoder{
}
 /* 
    DECLARE_ALIGNED(16, MACROBLOCKD, mb);

  DECLARE_ALIGNED(16, VP9_COMMON, common);

  int ready_for_new_data;

  int refresh_frame_flags;

  int frame_parallel_decode;  // frame-based threading.


  RefCntBuffer *cur_buf;   //  Current decoding frame buffer.


  TileWorkerData *tile_worker_data;
  TileBuffer tile_buffers[64];
  int num_tile_workers;
  int total_tiles;

  VP9LfSync lf_row_sync;

  vpx_decrypt_cb decrypt_cb;
  void *decrypt_state;

  int inv_tile_order;
  int need_resync;  // wait for key/intra-only frame.
  int hold_ref_buf;  // hold the reference buffer.
};


typedef struct TileBuffer {
  const uint8_t *data;
  size_t size;
  int col;  // only used with multi-threaded decoding
} TileBuffer;




int vp9_receive_compressed_data(struct VP9Decoder *pbi,
                                size_t size, const uint8_t **dest);

int vp9_get_raw_frame(struct VP9Decoder *pbi, YV12_BUFFER_CONFIG *sd,
                      vp9_ppflags_t *flags);

vpx_codec_err_t vp9_copy_reference_dec(struct VP9Decoder *pbi,
                                       VP9_REFFRAME ref_frame_flag,
                                       YV12_BUFFER_CONFIG *sd);

vpx_codec_err_t vp9_set_reference_dec(VP9_COMMON *cm,
                                      VP9_REFFRAME ref_frame_flag,
                                      YV12_BUFFER_CONFIG *sd);

static INLINE uint8_t read_marker(vpx_decrypt_cb decrypt_cb,
                                  void *decrypt_state,
                                  const uint8_t *data) {
  if (decrypt_cb) {
    uint8_t marker;
    decrypt_cb(decrypt_state, data, &marker, 1);
    return marker;
  }
  return *data;
}

// This function is exposed for use in tests, as well as the inlined function
// "read_marker".
vpx_codec_err_t vp9_parse_superframe_index(const uint8_t *data,
                                           size_t data_sz,
                                           uint32_t sizes[8], int *count,
                                           vpx_decrypt_cb decrypt_cb,
                                           void *decrypt_state);

struct VP9Decoder *vp9_decoder_create(BufferPool *const pool);

void vp9_decoder_remove(struct VP9Decoder *pbi);

static INLINE void decrease_ref_count(int idx, RefCntBuffer *const frame_bufs,
                                      BufferPool *const pool) {
  if (idx >= 0 && frame_bufs[idx].ref_count > 0) {
    --frame_bufs[idx].ref_count;
    // A worker may only get a free framebuffer index when calling get_free_fb.
    // But the private buffer is not set up until finish decoding header.
    // So any error happens during decoding header, the frame_bufs will not
    // have valid priv buffer.
    if (frame_bufs[idx].ref_count == 0 &&
        frame_bufs[idx].raw_frame_buffer.priv) {
      pool->release_fb_cb(pool->cb_priv, &frame_bufs[idx].raw_frame_buffer);
    }
  }
}
*/
