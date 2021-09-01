



function rgbToHex_4(rgb_4) {
    return "#" + ((1 << 24) + (rgb_4[0]/4 << 16) + (rgb_4[1]/4 << 8) + rgb_4[2]/4).toString(16).slice(1);
}
function hexToColor_4(hex){
    if(hex[0] == '#') hex = hex.substring(1);
    var bigint = parseInt(hex, 16);
    return [((bigint >> 16) & 255)*4, ((bigint >> 8) & 255)*4, (bigint & 255)*4];
}
function hexToColor(hex){
    if(hex[0] == '#') hex = hex.substring(1);
    var bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
function listfromx4(initialList){
    return initialList.map(item=>{
        return [item[0]/4,item[1]/4,item[2]/4]
    })
}
function listtox4(initialList){
    return initialList.map(item=>{
        return [item[0]*4,item[1]*4,item[2]*4]
    })
}
function isHexColor(hex){
    return typeof hex === 'string' && 
    hex.charAt(0) === '#' &&
    hex.length === 7 &&
    !isNaN(Number('0x' + hex.substring(1)));
}
alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "!", "@", "&", "(", ")", "-", "_", "=", "+", ".", ",", "/", "?", ";", ":", "\"", "\'" ];
morse = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--..",".----","..---","...--","....-","-....","--...","---..","----.","-----","-.-.--",".--.-.", ".....", ".-...", "-.--.", "-.--.-", "-....-", "..--.-", "-...-", ".-.-.", ".-.-.-", "--..--", "-..-.", "..--..", "-.-.-.", "---...", ".----.", ".-..-." ];    
 
function encodeMessage(e){
    var encoded = "";
    var words = e.split(/\s+/).filter(function(i){return i});
    for (var i = 0; i < words.length; i++) {
        var ch = words[i].split('').filter(function(i){return i});
        for (var j = 0; j < ch.length; j++) {
            if (this.alphabet.indexOf(ch[j]) > -1){
            encoded += this.morse[this.alphabet.indexOf(ch[j])];
            if (j + 1 != ch.length) encoded += "*";
            }
        }
        if (i + 1 != words.length) encoded += "|";
    }
    return encoded;
}

function decodeMessage(e){
    var decoded = "";
    var encodedWords = e.split('|').filter(function(i){return i});
    for (var i = 0; i < encodedWords.length; i++)
    {
        var ch = encodedWords[i].split('*').filter(function(i){return i});
        for (var j = 0; j < ch.length; j++) if(this.morse.indexOf(ch[j]) > -1)decoded += this.alphabet[this.morse.indexOf(ch[j])];
        if (i + 1 != encodedWords.length)  decoded += " ";
    }
    return decoded;
}

export { rgbToHex_4, hexToColor_4, hexToColor,listfromx4,listtox4, isHexColor, encodeMessage, decodeMessage }