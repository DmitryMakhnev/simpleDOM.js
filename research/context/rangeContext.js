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

function Context (source) {
    var context = this;
    context.source = source;
    context.state = startState;
    context.result = [];
    context.bufer = 0;
    context.tag = 0;
}

var processings = [];

var m = 'm'.charCodeAt(0);
var d = 'd'.charCodeAt(0);
var g = 'g'.charCodeAt(0);
var h = 'h'.charCodeAt(0);
var _ = '_'.charCodeAt(0);
//
//console.log(m);
//console.log(d);
//console.log(g);
//console.log(h);
//console.log(_);
//
//console.log('a');

function processingStart (charCode, context, i) {
    context.bufer = i;
    switch (charCode) {
        case 109:
            context.state = mState;
            context.tag = i;
            break;
        case 100:
            context.state = dState;
            context.tag = i;
            break;
        case 103:
            context.state = gState;
            context.tag = i;
            break;
        case 104:
            context.state = hState;
            context.tag = i;
            break;
        case 95:
            context.state = _State;
            context.tag = i;
            break;
    }
}

processings[startState] = processingStart;

function processingM (char, context, i) {
    if ((i - context.tag) === 3) {
        context.result.push(context.source.substr(context.tag, 4));
        context.state = startState;
    }
}

processings[mState] = processingM;

function processingD (char, context, i) {
    if ((i - context.tag) === 3) {
        context.result.push(context.source.substr(context.tag, 4));
        context.state = startState;
    }
}

processings[dState] = processingD;

function processingG (char, context, i) {
    if ((i - context.tag) === 4) {
        context.result.push(context.source.substr(context.tag, 5));
        context.state = startState;
    }
}

processings[gState] = processingG;

function processingH (char, context, i) {
    if ((i - context.tag) === 3) {
        context.result.push(context.source.substr(context.tag, 4));
        context.state = startState;
    }
}

processings[hState] = processingH;

function processing_ (char, context, i) {
    if ((i - context.tag) === 8) {
        context.result.push(context.source.substr(context.tag, 9));
        context.state = startState;
    }
}

processings[_State] = processing_;


function parse (source) {
    var i = 0;
    var iMax = source.length;
    var context = new Context(source);
    for (; i < iMax; i+= 1) {
        switch (context.state) {
            case 1:
                processingStart(source.charCodeAt(i), context, i);
                break;
            case 2:
                processingM(source.charCodeAt(i), context, i);
                break;
            case 3:
                processingD(source.charCodeAt(i), context, i);
                break;
            case 4:
                processingG(source.charCodeAt(i), context, i);
                break;
            case 5:
                processingH(source.charCodeAt(i), context, i);
                break;
            case 6:
                processing_(source.charCodeAt(i), context, i);
                break;

        }
    }
    return context.result;
}

console.time('parse');
//console.log(parse(source + source + source).splice(0, 50));
//parse(source);
parse(resultSource);
console.timeEnd('parse');


