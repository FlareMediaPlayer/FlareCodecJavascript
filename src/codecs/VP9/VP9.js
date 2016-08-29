'use strict';

var CONSTANTS = require('./constants.js');
        
class VP9{
    constructor(){
        
    }
    
    decode(dataView){
        var frame = new Frame(dataView);
        frame.decode();
    }
    
    
}

class Frame{
    //vp9_decode_frame
    constructor(dataView){
        this.dataView = dataView;
        this.frameHeader;
    }
    
    decode(){
        var offset = 0;
        this.frameHeader = new FrameHeader(this.dataView);
        this.frameHeader.offset = 0;
        this.frameHeader.parse();
    }
    
    
    
    parseHeader(){
        
    }
    
}

class FrameHeader{
    constructor(dataView){
        this.dataView = dataView;
        this.offset;
        this.frameMarker;
        this.profileLowBit;
        this.profileHighBit;
        this.profile;
    }
    
    parse(){
        var offset = this.offset;
        var tempByte= this.dataView.getUint8(offset);
        offset++;
        this.frameMarker = tempByte >> 6 ;
        this.profileLowBit = (tempByte & 0x20) >> 5;
        this.profileHighBit = (tempByte & 0x10) >> 4;
        
        this.profile = (this.profileHighBit << 1) + this.profileLowBit;
        if (this.profile === 3){
            //reserved 0
        }
        this.showExistingFrame = (tempByte >> 3) & 1;
        this.frameType = (tempByte >> 2) & 1;
        this.showFrame = (tempByte >> 1) & 1;
        this.errorResilientMode = tempByte & 1;
        if(this.frameType === CONSTANTS.KEY_FRAME){
            
            this.frameSyncCode(offset);
            offset += 3;
            this.colorConfig(offset);
            offset++;
            this.frameSize(offset);
            offset += 4;
            this.renderSize(offset);
            this.refreshFrameFlags = 0xFF;
            this.frameIsIntra = 1;

        }
        console.log(this);
    }
    
    frameSyncCode(offset){
        this.frameSyncCode1 = this.dataView.getUint8(offset);
        offset++;
        this.frameSyncCode2 = this.dataView.getUint8(offset);
        offset++;
        this.frameSyncCode3 = this.dataView.getUint8(offset);
    }
    
    frameSize(offset){
        this.frameWidth = this.dataView.getUint16(offset) + 1;
        offset += 2;
        this.frameHeight = this.dataView.getUint16(offset) + 1;
        this.computeImageSize();
    }
    
    computeImageSize(){
        this.miCols = (this.frameWidth + 7) >> 3;
        this.miRows = (this.frameHeight + 7) >> 3;
        this.sb64Cols = (this.miCols + 7) >> 3;
        this.sb64Rows = (this.miRows + 7) >> 3;
    }
    
    renderSize(offset){
        /*
         render_and_frame_size_different f(1)
if ( render_and_frame_size_different == 1 ) {
render_width_minus_1 f(16)
render_height_minus_1 f(16)
renderWidth = render_width_minus_1 + 1
renderHeight = render_height_minus_1 + 1
} else {
renderWidth = FrameWidth
renderHeight = FrameHeight
}
         */
    }
    
    colorConfig(offset){
        var tempByte = this.dataView.getUint8(offset);
        if (this.profile >= 2) {
            this.tenOrTwelveBit = (tempByte >> 7) & 1;
            this.bitDepth = this.tenOrTwelveBit ? 12 : 10
        } else {
            this.bitDepth = 8;
        }
        this.colorSpace = (tempByte >> 4) & 0x07;
        if (this.colorSpace != CONSTANTS.CS_RGB) {
            this.colorRange = (tempByte >> 3) & 0x1;
            if (this.profile == 1 || this.profile == 3) {
                this.subsamplingX = (tempByte >> 2) & 1;
                this.subsamplingY = (tempByte >> 1) & 1;

            } else {
                this.subsamplingX = 1;
                this.subsamplingY = 1;
            }
        }else{
            this.colorRange = 1;
            if (this.profile == 1 || this.profile == 3) {
                this.subsamplingX = 0;
                this.subsamplingY = 0;

            }
        }

    }
}
module.exports = VP9;