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
        var raw;

        switch(vint_width){
            case 1:
                raw = tempOctet;
                vint_data = tempOctet & 0x80;
                break;
            case 2:
                break;
            case 3:
                vint_data = dataview.getUint32(offset) & 0x001FFFFF;
                break;
            case 4:
                raw = dataview.getUint32(offset);
                vint_data = raw & 0x0FFFFFFF;
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                console.log("case 7");
                break;
            case 8:
                //Largest allowable integer in javascript is 2^53-1 so gonna have to truncate for now
                raw = dataview.getFloat64(offset);
                var firstInt = dataview.getUint32(offset) & 0x000FFFFF;
                var secondInt = dataview.getUint32(offset + 4);
                vint_data = (firstInt << 8) | secondInt;
                break;
        }
        return new VINT(raw, vint_width, vint_data);
        
    }
    
}

class Webm {
    
    constructor(arrayBuffer){
        
        this.dataview = new DataView(arrayBuffer);
        this.header = null;
        
    }
    
    parse(){
        
        var offset = 0;
        var elementId = VINT.read(this.dataview, offset);
        offset += elementId.width;
        var elementSize = VINT.read(this.dataview, offset);
        
        //Lookup
        if(Element.Table[elementId.raw]){
            console.log("found!");
        }
        
        
        
    }
    
    static load(arrayBuffer){
        
        var webm = new Webm(arrayBuffer);
        webm.parse();
        return webm;
        
    }
    
    
}

class Element {
    
    constructor(id, dataSize){
        
        this.id = id;
        this.dataSize = dataSize;
        this.data;
        this.header; // convinient pointer to the header
        this.children = [];
        
    }
       
}

class EBML extends Element{
    
    constructor(dataSize){
        super(0x1A45DFA3, dataSize);
    }
    
}

Element.Table = {
    0x1A45DFA3 : EBML
}



if (process.env.MODE === "global") {
    
    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {
    
    module.exports.Webm = Webm;

}
