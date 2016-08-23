'use strict';

var VINT = require('./VINT.js');


class Webm {

    constructor(arrayBuffer) {

        this.dataview = new DataView(arrayBuffer);
        this.header = null;
        this.elements = [];

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
            this.elements.push(element);
        } else {
            console.log("element not found");
        }

        console.log(this);


    }

    static load(arrayBuffer) {

        var webm = new Webm(arrayBuffer);
        webm.parse();
        return webm;

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
        console.log("This needs to be overridden");
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
        console.log(this.value);
    }

}

class EBMLString extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.length;// 0 to max
        this.value;// value of the integer

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

        tempOffset += elementId.width;

        var elementSize = VINT.read(this._dataView, tempOffset);
        console.log(elementId);
        var elementClass = Element.ClassTable[elementId.raw];
        var element;

        if (elementClass) {

            element = new elementClass(this._dataView);
            element.setOffset(elementOffset);
            element.setSize(elementSize);
            


        } else {

            console.log("Element Not Found");
            return false;

        }

        return element;

    }

    parse() {

        var tempOffset = this._offset + this.getIdLength() + this._size.width;

        var nextElement;


        while (tempOffset < this.getTotalSize()) {
            nextElement = this.getNextElement(tempOffset);
            if (nextElement) {
                this.elements.push(nextElement);
                nextElement.parse();
                tempOffset += nextElement.getTotalSize();
            } else {
                break;
            }

        }

        console.log("parsing");


    }

}

class EBMLBinary extends Element {

    constructor(id, dataView) {

        super(id, dataView);
        this.length;// 
        this.data;

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
    Void: 0xEC

}

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



console.log(Element.IdTable);

if (process.env.MODE === "global") {

    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {

    module.exports.Webm = Webm;

}
