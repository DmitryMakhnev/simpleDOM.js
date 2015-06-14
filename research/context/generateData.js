var tokens = [
    'moob',
    'deep',
    'group',
    'home',
    '_hoodratz'
];

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var tokensMaxRange = tokens.length - 1;
var str = '';
for (var i = 0, iMax = 200000; i < iMax; i += 1) {
    str += tokens[random(0, tokensMaxRange)];
}

console.log(str);

