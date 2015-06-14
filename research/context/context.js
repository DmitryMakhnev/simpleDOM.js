var source = 'moobdeepgroup_hoodratz_hoodratzdeephomedeephomegrouphome_hoodratzdeepgroup_hoodratzmoobmoobhome_hoodratzmoobmoobhomehomedeepmoobgroupgroupmoobdeepgroupdeep_hoodratzdeephome_hoodratzmoobhome_hoodratzhome_hoodratzgroupgroupdeep_hoodratzdeepgroupgroupgrouphomedeepdeep_hoodratzmoobmoob';

var resultSource = '';

for (var i = 0, iMax = 100000; i < iMax; i += 1) {
    resultSource += source;
}

var stateId = 0;
var startState = stateId++;
var mState = stateId++;
var dState = stateId++;
var gState = stateId++;
var hState = stateId++;
var _State = stateId++;

function Context () {
    var context = this;
    context.state = startState;
    context.result = [];
    context.bufer = '';
    context.tag = '';
}

var processings = {};

function processingStart (char, context) {
    context.bufer = char;
    switch (char) {
        case 'm':
            context.state = mState;
            context.tag = char;
            break;
        case 'd':
            context.state = dState;
            context.tag = char;
            break;
        case 'g':
            context.state = gState;
            context.tag = char;
            break;
        case 'h':
            context.state = hState;
            context.tag = char;
            break;
        case '_':
            context.state = _State;
            context.tag = char;
            break;
    }
}

processings[startState] = processingStart;

function processingM (char, context) {
    context.bufer += char;
    context.tag += char;
    if (context.tag.length === 4) {
        context.result.push(context.tag);
        context.state = startState;
    }
}

processings[mState] = processingM;

function processingD (char, context) {
    context.bufer += char;
    context.tag += char;
    if (context.tag.length === 4) {
        context.result.push(context.tag);
        context.state = startState;
    }
}

processings[dState] = processingD;

function processingG (char, context) {
    context.bufer += char;
    context.tag += char;
    if (context.tag.length === 5) {
        context.result.push(context.tag);
        context.state = startState;
    }
}

processings[gState] = processingG;

function processingH (char, context) {
    context.bufer += char;
    context.tag += char;
    if (context.tag.length === 4) {
        context.result.push(context.tag);
        context.state = startState;
    }
}

processings[hState] = processingH;

function processing_ (char, context) {
    context.bufer += char;
    context.tag += char;
    if (context.tag.length === 9) {
        context.result.push(context.tag);
        context.state = startState;
    }
}

processings[_State] = processing_;

function parse (source) {
    var i = 0;
    var iMax = source.length;
    var context = new Context();
    for (; i < iMax; i+= 1) {
        processings[context.state](source.charAt(i), context);
    }
    return context.result;
}

console.time('parse');
parse(resultSource);
console.timeEnd('parse');


