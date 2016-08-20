(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

class VINT{
    
    constructor(width, data){
        
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
        console.log(vint_width);
        switch(vint_width){
            case 1:
                vint_data = tempOctet & 0x80;
                break;
            case 2:
                break;
            case 3:
                vint_data = dataview.getUint32(offset) & 0x001FFFFF;
                break;
            case 4:
                console.log(dataview.getUint32(offset));
                vint_data = dataview.getUint32(offset) & 0x0FFFFFFF;
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


if ("global" === "global") {
    
    window.Flare = window.Flare || {};
    Flare.Codec = Flare.Codec || {};
    window.Flare.Codec.Webm = Webm;

} else {
    
    module.exports.Webm = Webm;

}

},{}]},{},[1]);
