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
        console.log(elementId);
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
        
        if (this._id === Element.IdTable.Info) {
            console.log(elementId);
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

console.log(Element.IdTable);

if (process.env.MODE === "global") {

    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {

    module.exports.Webm = Webm;

}
