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
            
        }while(leadingZeroes < 6);
        
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
        }
        return new VINT(vint_width, vint_data);
        
    }
    
}

class Webm {
    
    constructor(arrayBuffer){
        this.dataview = new DataView(arrayBuffer);

        
        this.header = null;
        
    }
    
    parse(){
        var offset = 0;
        var vint = VINT.read(this.dataview, offset);
        console.log(vint);
    }
    
    static load(arrayBuffer){
        var webm = new Webm(arrayBuffer);
        webm.parse();
        console.log("loading");
        return webm;
    }
    
    
}

class EBML {
    //https://github.com/Matroska-Org/ebml-specification/blob/master/specification.markdown
    static load() {

    }
    
    

}


if (process.env.MODE === "global") {
    
    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {
    
    module.exports.Webm = Webm;

}
