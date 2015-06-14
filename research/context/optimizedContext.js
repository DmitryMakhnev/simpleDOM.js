var source = 'moobdeepgroup_hoodratz_hoodratzdeephomedeephomegrouphome_hoodratzdeepgroup_hoodratzmoobmoobhome_hoodratzmoobmoobhomehomedeepmoobgroupgroupmoobdeepgroupdeep_hoodratzdeephome_hoodratzmoobhome_hoodratzhome_hoodratzgroupgroupdeep_hoodratzdeepgroupgroupgrouphomedeepdeep_hoodratzmoobmoob';

var resultSource = '';

for (var i = 0, iMax = 100000; i < iMax; i += 1) {
    resultSource += source;
}

function parse (source) {
    var i = 0;
    var iMax = source.length;
    //var context = new Context(source);

    //context resolved
    var stateId = 0;
    var startState = stateId++;
    var mState = stateId++;
    var dState = stateId++;
    var gState = stateId++;
    var hState = stateId++;
    var _State = stateId++;

    var context_source = source;
    var context_state = startState;
    var context_result = [];
    var context_bufer = 0;
    var context_tag = 0;


    for (; i < iMax; i+= 1) {
        switch (context_state) {
            case 1:
                context_bufer = i;
                switch (source.charCodeAt(i)) {
                    case 109:
                        context_state = mState;
                        context_tag = i;
                        break;
                    case 100:
                        context_state = dState;
                        context_tag = i;
                        break;
                    case 103:
                        context_state = gState;
                        context_tag = i;
                        break;
                    case 104:
                        context_state = hState;
                        context_tag = i;
                        break;
                    case 95:
                        context_state = _State;
                        context_tag = i;
                        break;
                }
                break;
            case 2:
                if ((i - context_tag) === 3) {
                    context_result.push(context_source.substr(context_tag, 4));
                    context_state = startState;
                }
                break;
            case 3:
                if ((i - context_tag) === 3) {
                    context_result.push(context_source.substr(context_tag, 4));
                    context_state = startState;
                }
                break;
            case 4:
                if ((i - context_tag) === 4) {
                    context_result.push(context_source.substr(context_tag, 5));
                    context_state = startState;
                }
                break;
            case 5:
                if ((i - context_tag) === 3) {
                    context_result.push(context_source.substr(context_tag, 4));
                    context_state = startState;
                }
                break;
            case 6:
                if ((i - context_tag) === 8) {
                    context_result.push(context_source.substr(context_tag, 9));
                    context_state = startState;
                }
                break;

        }
    }
    return context_result;
}

console.time('parse');
//console.log(parse(source + source + source).splice(0, 50));
//parse(source);
parse(resultSource);
console.timeEnd('parse');


