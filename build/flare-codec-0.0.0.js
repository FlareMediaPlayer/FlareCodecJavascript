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
                vint_data = tempOctet & 0x80;
                break;
            case 2:
                vint_raw = dataview.getUint16(offset);
                vint_data = vint_raw & 0x3FFF;
                break;
            case 3:
                vint_raw = dataview.getUint32(offset);
                vint_data = vint_raw & 0x001FFFFF;
                break;
            case 4:
                vint_raw = dataview.getUint32(offset);
                vint_data = vint_raw & 0x0FFFFFFF;
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                console.log("case 7");
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
    
    constructor(arrayBuffer){
        
        this.dataview = new DataView(arrayBuffer);
        this.header = null;
        this.elements = [];
        
    }
    
    parse(){
        
        var offset = 0;
        var elementId = VINT.read(this.dataview, offset);
        console.log(elementId);
        offset += elementId.width;
        var elementSize = VINT.read(this.dataview, offset);
        
        //Lookup
        var elementClass = Element.ClassTable[elementId.raw];
        var element;
        if(elementClass){
            element = new elementClass(this.dataview);
            element.setOffset(offset);
            element.setSize(elementSize);
            element.parse();
            this.elements.push(element);
        }else{
            console.log("element not found");
        }
        
        console.log(this);
        
        
    }
    
    static load(arrayBuffer){
        
        var webm = new Webm(arrayBuffer);
        webm.parse();
        return webm;
        
    }
    
    
}

class Element {
    
    constructor(id, dataView){
        
        this._dataView = dataView;
        this._id = id;
        this._offset;
        
    }
    
    setSize(size){
        this._size = size;
    }
    
    setOffset(offset){
        
        this._offset = offset;
        
    }
    
    parse(){     
        console.log("This needs to be overridden");
    }
       
}

class EBMLSignedInteger extends Element{
    
    constructor(id, dataView){
        
        super(id, dataView);
        this.length;// length of octet
        this.value;// value of the integer
        
    }
    
}

class EBMLUnsignedInteger extends Element{
    
    constructor(id, dataView){
        
        super(id, dataView);
        this.length;// must be 0, 4 or 8 octets
        this.value;// value of the integer
        
    }
    
}

class EBMLString extends Element{
    
    constructor(id, dataView){
        
        super(id, dataView);
        this.length;// 0 to max
        this.value;// value of the integer
        
    }
    
}

class EBMLUTF8 extends Element{
    
    constructor(id, dataView){
        
        super(id, dataView);
        this.length;// 0 to max
        this.value;// value of the integer
        
    }
    
}

class EBMLDate extends Element{
    
    constructor(id, dataView){
        
        super(id, dataView);
        this.length;// 0 or 8
        this.value;// musted be signed int
        
    }
    
}

class EBMLFloat extends Element{
    
    constructor(id, dataView){
        
        super(id, dataView);
        this.length;// length of octet
        this.value;// value of the integer
        
    }
    
}

class EBMLMasterElement extends Element{
    
    constructor(id, dataView){
        
        super(id, dataView);
        this.length;// 
        this.elements = [];
        
    }
    
    getNextElement(){
        
    }
    
    parse(){
        /*
        var offset = this._offset;
        var elementId = VINT.read(this._dataView, offset);
        offset += elementId.width;
        var elementSize = VINT.read(this._dataView, offset);
        var elementClass = Element.Table[elementId.raw];
        var element;
        
        if(elementClass){
            
            element = new elementClass();
            element.setOffset(offset);
            element.setSize(elementSize.data);
            this.elements.push(element);
            
        }else{
            
            console.log("not found");
            
        }
        */
        
        console.log("parsing");
        
        
    }
    
}

class EBMLBinary extends Element{
    
    constructor(id, dataView){
        
        super(id, dataView);
        this.length;// 
        this.data;
        
    }
    
}

class EBML extends EBMLMasterElement{
    
    constructor(dataView){
        super(Element.IdTable.EBML, dataView);
    }
    
    
    
}






class EBMLVersion extends Element{
    
    constructor(dataView){
        super(Element.ElementTypes.EBMLVersion , dataView);
    }
    
}


Element.IdTable = {
    //Basics
    EBML : 0x1A45DFA3,
    EBMLVersion : 0x4286,
    EBMLReadVersion : 0x42F7,
    EBMLMaxIDLength : 0x42F2,
    EBMLMaxSizeLength : 0x42F3,
    DocType : 0x4282,
    DocTypeVersion : 0x4287,
    DocTypeReadVersion : 0x4285,
    //Global
    Void : 0xEC
    
}

Element.ClassTable = {};

Element.ClassTable[Element.IdTable.EBML] = EBML;
Element.ClassTable[Element.IdTable.EBMLVersion] = EBMLVersion;



console.log(Element.IdTable);

if ("global" === "global") {
    
    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {
    
    module.exports.Webm = Webm;

}

},{"./VINT.js":1}]},{},[2]);
