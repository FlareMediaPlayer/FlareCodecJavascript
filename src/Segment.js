'use_strict';
var VINT = require('./VINT.js');

class Segment{
    constructor(dataView , offset, size){
        
    }
    
    static CreateInstance(dataView, offset){
        if (offset < 0){
            console.warn("invalid position");
        }
        
        //does not handle unknown size yet
        var elementId = VINT.read(dataView, offset);
        if(elementId.raw === ){
            
        }
        
        //var segment = new Segment(dataView, offset, size);
        
    }
}

module.exports = Segment;