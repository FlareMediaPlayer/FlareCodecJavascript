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

var VINT = require('./VINT.js');


class Webm {

    constructor(arrayBuffer) {

        this.dataview = new DataView(arrayBuffer);
        this.header = null;
        this.body = null;


    }

    parse() {

        var offset = 0;
        var elementId = VINT.read(this.dataview, offset);
        //console.log(elementId);
        offset += elementId.width;
        var elementSize = VINT.read(this.dataview, offset);

        //Lookup
        var elementClass = Element.ClassTable[elementId.raw];
        var element;
        if (elementClass) {
            element = new elementClass(this.dataview);
            element.setOffset(0);
            element.setSize(elementSize);
            element.parse();
            this.header = element;
        } else {
            console.log("element not found");
        }
        
        var bodyOffset = this.header.getTotalSize();
        offset = bodyOffset
        elementId = VINT.read(this.dataview, offset);
        elementClass = Element.ClassTable[elementId.raw];
        offset += elementId.width;
        elementSize = VINT.read(this.dataview, offset);
        if (elementClass) {
            element = new elementClass(this.dataview);
            element.setOffset(bodyOffset);
            element.setSize(elementSize);
            element.parse();
            this.body = element;
        } else {
            console.log("body");
        }

        console.log(this);


    }

    static load(arrayBuffer) {

        var webm = new Webm(arrayBuffer);
        webm.parse();
        return webm;

    }
    
    toJson(){
        var webm = {
            header : this.header,
            body : this.body
        };
        
        return JSON.stringify(webm, null, 2) ;
    }

}

class Element {

    constructor(id, dataView) {

        this._dataView = dataView;
        this._id = id;
        this._offset;
        this._size;

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

}

class EBMLUnsignedInteger extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.value;// value of the integer

    }
    
    parse(){
        //read length amount of bytes
        var tempOctet = 0;
        var readOctet;
        var tempOffset = this._offset + this.getIdLength() + this._size.width;

        for(var i = 0; i < this._size.data; i++){
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
    
    parse(){
        
        var tempOffset = this._offset + this.getIdLength() + this._size.width; // The offset where the data starts
        var charCount = this._size.data; // Number of characters to read
        var tempString = '';
        for(var i = 0; i < charCount; i++){
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
        
        if (this._id === Element.IdTable.Segment) {
            console.log(internalOffset);
        }
        
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
        
        if(this._id === Element.IdTable.Info){
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
    
    parse(){
        this._dataOffset = this._offset + this.getIdLength() + this._size.width;
    }

}

class EBML extends EBMLMasterElement {

    constructor(dataView) {
        super(Element.IdTable.EBML, dataView);
        this.EBMLClass = 'D';

    }

}






class EBMLVersion extends EBMLUnsignedInteger {

    constructor(dataView) {
        super(Element.IdTable.EBMLVersion, dataView);
        this.EBMLClass = 'B';
    }

}

class EBMLReadVersion extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.EBMLReadVersion, dataView);
        this.EBMLClass = 'B';
    }
}

class EBMLMaxIDLength extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.EBMLMaxIDLength, dataView);
        this.EBMLClass = 'B';
    }
}

class EBMLMaxSizeLength extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.EBMLMaxSizeLength, dataView);
        this.EBMLClass = 'B';
    }
}

class DocType extends EBMLString {
    constructor(dataView) {
        super(Element.IdTable.DocType, dataView);
        this.EBMLClass = 'B';
    }
}

class DocTypeVersion extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.DocTypeVersion, dataView);
        this.EBMLClass = 'B';
    }
}

class DocTypeReadVersion extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.DocTypeReadVersion, dataView);
        this.EBMLClass = 'B';
    }
}

class Void extends EBMLBinary{
    constructor(dataView) {
        super(Element.IdTable.Void, dataView);
        this.EBMLClass = 'A';
    }
}

class Segment extends EBMLMasterElement{
    
    constructor(dataView) {
        
        super(Element.IdTable.Segment, dataView);
        this.EBMLClass = 'D';

    }
    
}

class SeekHead extends EBMLMasterElement{
    constructor(dataView) { 
        super(Element.IdTable.SeekHead, dataView);
        this.EBMLClass = 'D';
    }
}

class Seek extends EBMLMasterElement{
    constructor(dataView) { 
        super(Element.IdTable.Seek, dataView);
        this.EBMLClass = 'B';
    }
}

class SeekID extends EBMLBinary{
    constructor(dataView) { 
        super(Element.IdTable.SeekID, dataView);
        this.EBMLClass = 'B';
    }
}

class SeekPosition extends EBMLUnsignedInteger{
    constructor(dataView) { 
        super(Element.IdTable.SeekPosition, dataView);
        this.EBMLClass = 'B';
    }
}

class Info extends EBMLMasterElement{
    constructor(dataView) { 
        super(Element.IdTable.Info, dataView);
        this.EBMLClass = 'D';
      
    }
}

class TimecodeScale extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.TimecodeScale, dataView);
        this.EBMLClass = 'C';
    }
}

class Duration extends EBMLFloat {
    constructor(dataView) {
        super(Element.IdTable.Duration, dataView);
        this.EBMLClass = 'B';
    }
}

class DateUTC extends EBMLDate {
    constructor(dataView) {
        super(Element.IdTable.DateUTC, dataView);
        this.EBMLClass = 'B';
    }
}

class Title extends EBMLUTF8 {
    constructor(dataView) {
        super(Element.IdTable.Title, dataView);
        this.EBMLClass = 'B';
    }
}

class MuxingApp extends EBMLUTF8 {
    constructor(dataView) {
        super(Element.IdTable.MuxingApp, dataView);
        this.EBMLClass = 'B';
    }
}

class WritingApp extends EBMLUTF8 {
    constructor(dataView) {
        super(Element.IdTable.WritingApp, dataView);
        this.EBMLClass = 'B';
    }
}

class Cluster extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Cluster, dataView);
        this.EBMLClass = 'D';

    }
}

class Timecode extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.Timecode, dataView);
        this.EBMLClass = 'A';
    }
}

class PrevSize extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.PrevSize, dataView);
        this.EBMLClass = 'A';
    }
}

class SimpleBlock extends EBMLBinary {
    constructor(dataView) {
        super(Element.IdTable.SimpleBlock, dataView);
        this.EBMLClass = 'A';
    }
}

class BlockGroup extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.BlockGroup, dataView);
        this.EBMLClass = 'A';
    }
}

class Block extends EBMLBinary {
    constructor(dataView) {
        super(Element.IdTable.Block, dataView);
        this.EBMLClass = 'A';
    }
}


class BlockAdditions extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.BlockAdditions, dataView);
        this.EBMLClass = 'B';
    }
}

class BlockMore extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.BlockMore, dataView);
        this.EBMLClass = 'A';
    }
}

class BlockAddID extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.BlockAddID, dataView);
        this.EBMLClass = 'A';
    }
}

class BlockAdditional extends EBMLBinary {
    constructor(dataView) {
        super(Element.IdTable.BlockAdditional, dataView);
        this.EBMLClass = 'A';
    }
}

class BlockDuration extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.BlockDuration, dataView);
        this.EBMLClass = 'A';
    }
}

class ReferenceBlock extends EBMLSignedInteger {
    constructor(dataView) {
        super(Element.IdTable.ReferenceBlock, dataView);
        this.EBMLClass = 'A';
    }
}

class DiscardPadding extends EBMLSignedInteger {
    constructor(dataView) {
        super(Element.IdTable.DiscardPadding, dataView);
        this.EBMLClass = 'A';
    }
}

class Tracks extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Tracks, dataView);
        this.EBMLClass = 'D';
    }
}

class TrackEntry extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.TrackEntry, dataView);
        this.EBMLClass = 'A';
    }
}

class TrackNumber extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.TrackNumber, dataView);
        this.EBMLClass = 'A';
    }
}

class TrackUID extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.TrackUID, dataView);
        this.EBMLClass = 'B';
    }
}

class TrackType extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.TrackType, dataView);
        this.EBMLClass = 'A';
    }
}

class FlagEnabled extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.FlagEnabled, dataView);
        this.EBMLClass = 'A';
    }
}

class FlagDefault extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.FlagDefault, dataView);
        this.EBMLClass = 'A';
    }
}

class FlagForced extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.FlagForced, dataView);
        this.EBMLClass = 'B';
    }
}

class FlagLacing extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.FlagForced, dataView);
        this.EBMLClass = 'A';
    }
}

class DefaultDuration extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.DefaultDuration, dataView);
        this.EBMLClass = 'C';
    }
}

class Name extends EBMLUTF8 {
    constructor(dataView) {
        super(Element.IdTable.Name, dataView);
        this.EBMLClass = 'B';
    }
}

class Language extends EBMLString {
    constructor(dataView) {
        super(Element.IdTable.Language, dataView);
        this.EBMLClass = 'C';
    }
}

class CodecID extends EBMLString {
    constructor(dataView) {
        super(Element.IdTable.CodecID, dataView);
        this.EBMLClass = 'A';
    }
}

class CodecPrivate extends EBMLString {
    constructor(dataView) {
        super(Element.IdTable.CodecPrivate, dataView);
        this.EBMLClass = 'B';
    }
}

class CodecName extends EBMLUTF8 {
    constructor(dataView) {
        super(Element.IdTable.CodecName, dataView);
        this.EBMLClass = 'C';
    }
}

class CodecDelay extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.CodecDelay, dataView);
        this.EBMLClass = 'B';
    }
}

class SeekPreRoll extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.SeekPreRoll, dataView);
        this.EBMLClass = 'B';
    }
}

class Video extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Video, dataView);
        this.EBMLClass = 'A';
    }
}

class FlagInterlaced extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.FlagInterlaced, dataView);
        this.EBMLClass = 'A';
    }
}

class StereoMode extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.StereoMode, dataView);
        this.EBMLClass = 'B';
    }
}

class AlphaMode extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.AlphaMode, dataView);
        this.EBMLClass = 'B';
    }
}

class PixelWidth extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.PixelWidth, dataView);
        this.EBMLClass = 'A';
    }
}

class PixelHeight extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.PixelHeight, dataView);
        this.EBMLClass = 'A';
    }
}

class PixelCropBottom extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.PixelCropBottom, dataView);
        this.EBMLClass = 'B';
    }
}

class PixelCropTop extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.PixelCropTop, dataView);
        this.EBMLClass = 'B';
    }
}

class PixelCropLeft extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.PixelCropLeft, dataView);
        this.EBMLClass = 'B';
    }
}

class PixelCropRight extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.PixelCropRight, dataView);
        this.EBMLClass = 'B';
    }
}

class DisplayWidth extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.DisplayWidth, dataView);
        this.EBMLClass = 'B';
    }
}

class DisplayHeight extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.DisplayHeight, dataView);
        this.EBMLClass = 'B';
    }
}

class DisplayUnit extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.DisplayUnit, dataView);
        this.EBMLClass = 'B';
    }
}

class AspectRatioType extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.AspectRatioType, dataView);
        this.EBMLClass = 'B';
    }
}

class Audio extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Audio, dataView);
        this.EBMLClass = 'A';
    }
}

class SamplingFrequency extends EBMLFloat {
    constructor(dataView) {
        super(Element.IdTable.SamplingFrequency, dataView);
        this.EBMLClass = 'A';
    }
}

class OutputSamplingFrequency extends EBMLFloat {
    constructor(dataView) {
        super(Element.IdTable.OutputSamplingFrequency, dataView);
        this.EBMLClass = 'B';
    }
}

class Channels extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.Channels, dataView);
        this.EBMLClass = 'A';
    }
}

class BitDepth extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.BitDepth, dataView);
        this.EBMLClass = 'B';
    }
}

class ContentEncodings extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.ContentEncodings, dataView);
        this.EBMLClass = 'B';
    }
}

class ContentEncoding extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.ContentEncoding, dataView);
        this.EBMLClass = 'B';
    }
}

class ContentEncodingOrder extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.ContentEncodingOrder, dataView);
        this.EBMLClass = 'B';
    }
}

class ContentEncodingScope extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.ContentEncodingScope, dataView);
        this.EBMLClass = 'B';
    }
}

class ContentEncodingType extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.ContentEncodingType, dataView);
        this.EBMLClass = 'B';
    }
}

class ContentEncryption extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.ContentEncryption, dataView);
        this.EBMLClass = 'B';
    }
}

class ContentEncAlgo extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.ContentEncAlgo, dataView);
        this.EBMLClass = 'B';
    }
}

class ContentEncKeyID extends EBMLBinary {
    constructor(dataView) {
        super(Element.IdTable.ContentEncKeyID, dataView);
        this.EBMLClass = 'B';
    }
}

class Cues extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Cues, dataView);
        this.EBMLClass = 'D';
    }
}

class CuePoint extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.CuePoint, dataView);
        this.EBMLClass = 'A';
    }
}

class CueTime extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.CueTime, dataView);
        this.EBMLClass = 'A';
    }
}

class CueTrackPositions extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.CueTrackPositions, dataView);
        this.EBMLClass = 'A';
    }
}

class CueTrack extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.CueTrack, dataView);
        this.EBMLClass = 'A';
    }
}

class CueClusterPosition extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.CueClusterPosition, dataView);
        this.EBMLClass = 'A';
    }
}

class CueRelativePosition extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.CueRelativePosition, dataView);
        this.EBMLClass = 'A';
    }
}

class CueDuration extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.CueDuration, dataView);
        this.EBMLClass = 'A';
    }
}

class CueBlockNumber extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.CueBlockNumber, dataView);
        this.EBMLClass = 'AB';
    }
}

class Chapters extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Chapters, dataView);
        this.EBMLClass = 'D';
    }
}

class EditionEntry extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.EditionEntry, dataView);
        this.EBMLClass = 'B';
    }
}

class ChapterAtom extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.ChapterAtom, dataView);
        this.EBMLClass = 'A';
    }
}

class ChapterUID extends EBMLUTF8{
    constructor(dataView) {
        super(Element.IdTable.ChapterUID, dataView);
        this.EBMLClass = 'B';
    }
}

class ChapterStringUID extends EBMLUTF8{
    constructor(dataView) {
        super(Element.IdTable.ChapterStringUID, dataView);
        this.EBMLClass = 'B';
    }
}

class ChapterTimeStart extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.ChapterTimeStart, dataView);
        this.EBMLClass = 'A';
    }
}

class ChapterTimeEnd extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.ChapterTimeEnd, dataView);
        this.EBMLClass = 'A';
    }
}

class ChapterDisplay extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.ChapterDisplay, dataView);
        this.EBMLClass = 'A';
    }
}

class ChapString extends EBMLUTF8{
    constructor(dataView) {
        super(Element.IdTable.ChapString, dataView);
        this.EBMLClass = 'A';
    }
}

class ChapLanguage extends EBMLString{
    constructor(dataView) {
        super(Element.IdTable.ChapLanguage, dataView);
        this.EBMLClass = 'B';
    }
}

class ChapCountry extends EBMLString{
    constructor(dataView) {
        super(Element.IdTable.ChapCountry, dataView);
        this.EBMLClass = 'B';
    }
}

class Tags extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Tags, dataView);
        this.EBMLClass = 'D';
    }
}

class Tag extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Tag, dataView);
        this.EBMLClass = 'B';
    }
}

class Targets extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.Targets, dataView);
        this.EBMLClass = 'B';
    }
}

class TargetTypeValue extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.TargetTypeValue, dataView);
        this.EBMLClass = 'B';
    }
}

class TargetType extends EBMLString {
    constructor(dataView) {
        super(Element.IdTable.TargetType, dataView);
        this.EBMLClass = 'B';
    }
}

class TagTrackUID extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.TagTrackUID, dataView);
        this.EBMLClass = 'B';
    }
}

class SimpleTag extends EBMLMasterElement {
    constructor(dataView) {
        super(Element.IdTable.SimpleTag, dataView);
        this.EBMLClass = 'B';
    }
}

class TagName extends EBMLUTF8 {
    constructor(dataView) {
        super(Element.IdTable.TagName, dataView);
        this.EBMLClass = 'B';
    }
}

class TagLanguage extends EBMLString {
    constructor(dataView) {
        super(Element.IdTable.TagLanguage, dataView);
        this.EBMLClass = 'B';
    }
}

class TagDefault extends EBMLUnsignedInteger {
    constructor(dataView) {
        super(Element.IdTable.TagDefault, dataView);
        this.EBMLClass = 'B';
    }
}

class TagString extends EBMLUTF8 {
    constructor(dataView) {
        super(Element.IdTable.TagString, dataView);
        this.EBMLClass = 'B';
    }
}

class TagBinary extends EBMLUTF8 {
    constructor(dataView) {
        super(Element.IdTable.TagBinary, dataView);
        this.EBMLClass = 'B';
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
    Segment : 0x18538067,
    //Meta Seek Information
    SeekHead : 0x114D9B74,
    Seek : 0x4DBB,
    SeekID : 0x53AB,
    SeekPosition : 0x53AC,
    //Segment Information
    Info : 0x1549A966,
    TimecodeScale : 0x2AD7B1,
    Duration : 0x4489,
    DateUTC : 4461,
    Title : 0x7BA9,
    MuxingApp : 0x4D80,
    WritingApp : 0x5741,
    //Cluster
    Cluster : 	0x1F43B675,
    Timecode : 	0xE7,
    PrevSize : 0xAB,
    SimpleBlock : 0xA3,
    BlockGroup : 0xA0,
    Block : 0xA1,
    BlockAdditions : 0x75A1,
    BlockMore  : 0xA6,
    BlockAddID  : 0xEE,
    BlockAdditional  : 0xA5,
    BlockDuration  : 0x9B,
    ReferenceBlock  : 0xFB,
    DiscardPadding  : 0x75A2,
    //Track
    Tracks : 0x1654AE6B,
    TrackEntry : 0xAE,
    TrackNumber : 0xD7,
    TrackUID : 0x73C5,
    TrackType : 0x83,
    FlagEnabled : 0xB9,
    FlagDefault : 0x88,
    FlagForced : 0x55AA,
    FlagLacing : 0x9C,
    DefaultDuration : 0x23E383,
    Name : 0x536E,
    Language : 0x22B59C,
    CodecID : 0x86,
    CodecPrivate: 0x63A2,
    CodecName : 0x258688,
    CodecDelay : 0x56AA,
    SeekPreRoll : 0x56BB,
    Video : 0xE0,
    FlagInterlaced : 0x9A,
    StereoMode : 0x53B8,
    AlphaMode : 0x53C0,
    PixelWidth : 0xB0,
    PixelHeight : 0xBA,
    PixelCropBottom : 0x54AA,
    PixelCropTop : 0x54BB,
    PixelCropLeft : 0x54CC,
    PixelCropRight : 0x54DD,
    DisplayWidth : 0x54B0,
    DisplayHeight : 0x54BA,
    DisplayUnit : 0x54B2,
    AspectRatioType : 0x54B3,
    Audio : 0xE1,
    SamplingFrequency : 0xB5,
    OutputSamplingFrequency : 0x78B5,
    Channels : 0x9F,
    BitDepth : 0x6264,
    ContentEncodings : 0x6D80,
    ContentEncoding : 0x6240,
    ContentEncodingOrder : 0x5031,
    ContentEncodingScope : 0x5032,
    ContentEncodingType : 0x5033,
    ContentEncryption : 0x5035,
    ContentEncAlgo : 0x47E1,
    ContentEncKeyID : 0x47E2,
    //ContentEncAESSettings : //For some reason this one isnt in the matroska spec
    //AESSettingsCipherMode //This one too
    //Colour
    Colour : 0x55B0,
    MatrixCoefficients : 0x55B1,
    BitsPerChannel : 0x55B2,
    ChromaSubsamplingHorz : 0x55B3,
    ChromaSubsamplingVert : 0x55B4,
    CbSubsamplingHorz : 0x55B5,
    CbSubsamplingVert : 0x55B6,
    ChromaSitingHorz : 0x55B7,
    ChromaSitingVert : 0x55B8,
    Range : 0x55B9,
    TransferCharacteristics : 0x55BA,
    Primaries : 0x55BB,
    MaxCLL : 0x55BC,
    MaxFALL : 0x55BD,
    MasteringMetadata : 0x55D0,
    PrimaryRChromaticityX : 0x55D1,
    PrimaryRChromaticityY : 0x55D2,
    PrimaryGChromaticityX : 0x55D3,
    PrimaryGChromaticityY : 0x55D4,
    PrimaryBChromaticityX : 0x55D5,
    PrimaryBChromaticityY : 0x55D6,
    WhitePointChromaticityX : 0x55D7,
    WhitePointChromaticityY : 0x55D8,
    LuminanceMax : 0x55D9,
    LuminanceMin : 0x55DA,
    //Cueing Data
    Cues : 0x1C53BB6B,
    CuePoint : 0xBB,
    CueTime : 0xB3,
    CueTrackPositions : 0xB7,
    CueTrack : 0xF7,
    CueClusterPosition : 0xF1,
    CueRelativePosition : 0xF0,
    CueDuration : 0xB2,
    CueBlockNumber : 0x5378,
    //Chapters
    Chapters : 0x1043A770,
    EditionEntry : 0x45B9,
    ChapterAtom : 0xB6,
    ChapterUID : 0x73C4,
    ChapterStringUID : 0x5654,
    ChapterTimeStart : 0x91,
    ChapterTimeEnd : 0x92,
    ChapterDisplay : 0x80,
    ChapString : 0x85,
    ChapLanguage : 0x437E,
    ChapCountry : 0x437E,
    //Tagging
    Tags : 0x1254C367,
    Tag : 0x7373,
    Targets : 0x63C0,
    TargetTypeValue : 0x68CA,
    TargetType : 0x63CA,
    TagTrackUID : 0x63C5,
    SimpleTag : 0x67C8,
    TagName : 0x45A3,
    TagLanguage : 0x447A,
    TagDefault : 0x4487,
    TagString : 0x4487,
    TagBinary : 0x4485
};

//Create lookup element to find classes
Element.ClassTable = {};
//Basics
Element.ClassTable[Element.IdTable.EBML] = EBML;
Element.ClassTable[Element.IdTable.EBMLVersion] = EBMLVersion;
Element.ClassTable[Element.IdTable.EBMLReadVersion] = EBMLReadVersion;
Element.ClassTable[Element.IdTable.EBMLMaxIDLength] = EBMLMaxIDLength;
Element.ClassTable[Element.IdTable.EBMLMaxSizeLength] = EBMLMaxSizeLength;
Element.ClassTable[Element.IdTable.DocType] = DocType;
Element.ClassTable[Element.IdTable.DocTypeVersion] = DocTypeVersion;
Element.ClassTable[Element.IdTable.DocTypeReadVersion] = DocTypeReadVersion;
//Global
Element.ClassTable[Element.IdTable.Void]= Void;
//Segment
Element.ClassTable[Element.IdTable.Segment] = Segment;
//Meta Seek
Element.ClassTable[Element.IdTable.SeekHead] = SeekHead;
Element.ClassTable[Element.IdTable.Seek] = Seek;
Element.ClassTable[Element.IdTable.SeekID] = SeekID;
Element.ClassTable[Element.IdTable.SeekPosition] = SeekPosition;
//Segment
Element.ClassTable[Element.IdTable.Info] = Info;
Element.ClassTable[Element.IdTable.TimecodeScale] = TimecodeScale;
Element.ClassTable[Element.IdTable.Duration] = Duration;
Element.ClassTable[Element.IdTable.DateUTC] = DateUTC;
Element.ClassTable[Element.IdTable.Title] = Title;
Element.ClassTable[Element.IdTable.MuxingApp] = MuxingApp;
Element.ClassTable[Element.IdTable.WritingApp] = WritingApp;
//Cluster
Element.ClassTable[Element.IdTable.Cluster] = Cluster;
Element.ClassTable[Element.IdTable.Timecode] = Timecode;
Element.ClassTable[Element.IdTable.PrevSize] = PrevSize;
Element.ClassTable[Element.IdTable.SimpleBlock] = SimpleBlock;
Element.ClassTable[Element.IdTable.BlockGroup] = BlockGroup;
Element.ClassTable[Element.IdTable.Block] = Block;
Element.ClassTable[Element.IdTable.BlockAdditions] = BlockAdditions;
Element.ClassTable[Element.IdTable.BlockMore] = BlockMore;
Element.ClassTable[Element.IdTable.BlockAddID] = BlockAddID;
Element.ClassTable[Element.IdTable.BlockAdditional] = BlockAdditional;
Element.ClassTable[Element.IdTable.BlockDuration] = BlockDuration;
Element.ClassTable[Element.IdTable.ReferenceBlock] = ReferenceBlock;
Element.ClassTable[Element.IdTable.DiscardPadding] = DiscardPadding;
//Tracks
Element.ClassTable[Element.IdTable.Tracks] = Tracks;
Element.ClassTable[Element.IdTable.TrackEntry] = TrackEntry;
Element.ClassTable[Element.IdTable.TrackNumber] = TrackNumber;
Element.ClassTable[Element.IdTable.TrackUID] = TrackUID;
Element.ClassTable[Element.IdTable.TrackType] = TrackType;
Element.ClassTable[Element.IdTable.FlagEnabled] = FlagEnabled;
Element.ClassTable[Element.IdTable.FlagDefault] = FlagDefault;
Element.ClassTable[Element.IdTable.FlagForced] = FlagForced;
Element.ClassTable[Element.IdTable.FlagDefault] = FlagDefault;
Element.ClassTable[Element.IdTable.FlagLacing] = FlagLacing;
Element.ClassTable[Element.IdTable.DefaultDuration] = DefaultDuration;
Element.ClassTable[Element.IdTable.Name] = Name;
Element.ClassTable[Element.IdTable.Language] = Language;
Element.ClassTable[Element.IdTable.CodecID] = CodecID;
Element.ClassTable[Element.IdTable.CodecPrivate] = CodecPrivate;
Element.ClassTable[Element.IdTable.CodecName] = CodecName;
Element.ClassTable[Element.IdTable.CodecDelay] = CodecDelay;
Element.ClassTable[Element.IdTable.SeekPreRoll] = SeekPreRoll;
Element.ClassTable[Element.IdTable.Video] = Video;
Element.ClassTable[Element.IdTable.FlagInterlaced] = FlagInterlaced;
Element.ClassTable[Element.IdTable.StereoMode] = StereoMode;
Element.ClassTable[Element.IdTable.AlphaMode] = AlphaMode;
Element.ClassTable[Element.IdTable.PixelWidth] = PixelWidth;
Element.ClassTable[Element.IdTable.PixelHeight] = PixelHeight;
Element.ClassTable[Element.IdTable.PixelCropBottom] = PixelCropBottom;
Element.ClassTable[Element.IdTable.PixelCropTop] = PixelCropTop;
Element.ClassTable[Element.IdTable.PixelCropLeft] = PixelCropLeft;
Element.ClassTable[Element.IdTable.PixelCropRight] = PixelCropRight;
Element.ClassTable[Element.IdTable.DisplayWidth] = DisplayWidth;
Element.ClassTable[Element.IdTable.DisplayHeight] = DisplayHeight;
Element.ClassTable[Element.IdTable.DisplayUnit] = DisplayUnit;
Element.ClassTable[Element.IdTable.AspectRatioType] = AspectRatioType;
Element.ClassTable[Element.IdTable.Audio] = Audio;
Element.ClassTable[Element.IdTable.SamplingFrequency] = SamplingFrequency;
Element.ClassTable[Element.IdTable.OutputSamplingFrequency] = OutputSamplingFrequency;
Element.ClassTable[Element.IdTable.Channels] = Channels;
Element.ClassTable[Element.IdTable.BitDepth] = BitDepth;
Element.ClassTable[Element.IdTable.ContentEncodings] = ContentEncodings;
Element.ClassTable[Element.IdTable.ContentEncoding] = ContentEncoding;
Element.ClassTable[Element.IdTable.ContentEncodingOrder] = ContentEncodingOrder;
Element.ClassTable[Element.IdTable.ContentEncodingScope] = ContentEncodingScope;
Element.ClassTable[Element.IdTable.ContentEncodingType] = ContentEncodingType;
Element.ClassTable[Element.IdTable.ContentEncryption] = ContentEncryption;
Element.ClassTable[Element.IdTable.ContentEncAlgo] = ContentEncAlgo;
Element.ClassTable[Element.IdTable.ContentEncKeyID] = ContentEncKeyID;
//Cueing Data
Element.ClassTable[Element.IdTable.Cues] = Cues;
Element.ClassTable[Element.IdTable.CuePoint] = CuePoint;
Element.ClassTable[Element.IdTable.CueTime] = CueTime;
Element.ClassTable[Element.IdTable.CueTrackPositions] = CueTrackPositions;
Element.ClassTable[Element.IdTable.CueTrack] = CueTrack;
Element.ClassTable[Element.IdTable.CueClusterPosition] = CueClusterPosition;
Element.ClassTable[Element.IdTable.CueRelativePosition] = CueRelativePosition;
Element.ClassTable[Element.IdTable.CueDuration] = CueDuration;
Element.ClassTable[Element.IdTable.CueBlockNumber] = CueBlockNumber;
//Chapters
Element.ClassTable[Element.IdTable.Chapters] = Chapters;
Element.ClassTable[Element.IdTable.EditionEntry] = EditionEntry;
Element.ClassTable[Element.IdTable.ChapterAtom] = ChapterAtom;
Element.ClassTable[Element.IdTable.ChapterUID] = ChapterUID;
Element.ClassTable[Element.IdTable.ChapterStringUID] = ChapterStringUID;
Element.ClassTable[Element.IdTable.ChapterTimeStart] = ChapterTimeStart;
Element.ClassTable[Element.IdTable.ChapterTimeEnd] = ChapterTimeEnd;
Element.ClassTable[Element.IdTable.ChapterDisplay] = ChapterDisplay;
Element.ClassTable[Element.IdTable.ChapString] = ChapString;
Element.ClassTable[Element.IdTable.ChapLanguage] = ChapLanguage;
Element.ClassTable[Element.IdTable.ChapCountry] = ChapCountry;
//Tagging
Element.ClassTable[Element.IdTable.Tags] = Tags;
Element.ClassTable[Element.IdTable.Tag] = Tag;
Element.ClassTable[Element.IdTable.Targets] = Targets;
Element.ClassTable[Element.IdTable.TargetTypeValue] = TargetTypeValue;
Element.ClassTable[Element.IdTable.TargetType] = TargetType;
Element.ClassTable[Element.IdTable.TagTrackUID] = TagTrackUID;
Element.ClassTable[Element.IdTable.SimpleTag] = SimpleTag;
Element.ClassTable[Element.IdTable.TagName] = TagName;
Element.ClassTable[Element.IdTable.TagLanguage] = TagLanguage;
Element.ClassTable[Element.IdTable.TagDefault] = TagDefault;
Element.ClassTable[Element.IdTable.TagString] = TagString;
Element.ClassTable[Element.IdTable.TagBinary] = TagBinary;


console.log(Element.IdTable);

if ("global" === "global") {

    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {

    module.exports.Webm = Webm;

}

},{"./VINT.js":1}]},{},[2]);
