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
        var end = this.offset + this.size;
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
        var trackEntry = new Track();
        var trackInfo = new TrackInfo();
        var trackSettings = new TrackSettings();
        var lacing = 1;

        
        var end = dataOffset + size;
        var offset = dataOffset;
        var elementId;
        var elementWidth;
        var elementOffset;
        while (offset < end) {
            //5621
            elementOffset = offset;
            elementId = VINT.read(this.dataView, offset);
            offset += elementId.width;
            elementWidth = VINT.read(this.dataView, offset);
            offset += elementWidth.width;


            switch(elementId.raw){
                case Element.IdTable.Video :
                    trackSettings.offset = elementOffset;
                    trackSettings.dataOffset = offset;
                    trackSettings.size = elementWidth.data;
                    break;
                case Element.IdTable.Audio :
                    trackSettings.offset = elementOffset;
                    trackSettings.dataOffset = offset;
                    trackSettings.size = elementWidth.data;
                    break;
                case Element.IdTable.ContentEncodings :
                    trackSettings.offset = elementOffset;
                    trackSettings.dataOffset = offset;
                    trackSettings.size = elementWidth.data;
                    break;
                case Element.IdTable.TrackUID :
                    break;
                case Element.IdTable.TrackNumber :
                    trackInfo.number = Element.readUnsignedInt(this.dataView,offset, elementWidth.data);
                    break;
                case Element.IdTable.TrackType :
                    break;
                case Element.IdTable.Name :
                    break;
                case Element.IdTable.Language :
                    break;
                case Element.IdTable.DefaultDuration :
                    break;
                case Element.IdTable.FlagLacing :
                    break;
                case Element.IdTable.CodecPrivate :
                    break;
                case Element.IdTable.CodecName :
                    break;
                case Element.IdTable.CodecDelay :
                    break;
                case Element.IdTable.CodecSeekPreRoll :
                    break;
                default:
                    console.warn("track type not found");
                    break;
            }
            
            
            offset += elementWidth.data;
        }
        
        console.log(trackInfo);
        return trackEntry;
        
    }

}

class Track{
    constructor(){
        
    }
}

class TrackInfo{
    constructor(){
        this.type = 0;
        this.number = 0;
        this.uid = 0;
        this.defaultDuration = 0;
       
    }
}

class TrackSettings{
    constructor(){
        this.start = -1;
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

if (process.env.MODE === "global") {

    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {

    module.exports.Webm = Webm;

}
