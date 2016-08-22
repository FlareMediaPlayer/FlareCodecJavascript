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

if (process.env.MODE === "global") {
    
    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {
    
    module.exports.Webm = Webm;

}
