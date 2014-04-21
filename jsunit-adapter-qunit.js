(function(win){
    if (win.QUnit === undefined || win.pagerun === undefined) {
        return;
    }
    pagerun.waitMe();
    var testStartTime;
    QUnit.begin = function(){
        pagerun.result(
            'qunit.begin',
            'Start of QUnit tester.'
        );
    }
    QUnit.moduleStart = function(message){
        pagerun.result(
            'qunit.moduleStart',
            message.name
        );
    }
    QUnit.testStart = function(message){
        testStartTime = new Date().getTime();
        pagerun.result(
            'qunit.testStart',
            {
                'module': message.module,
                'name': message.name
            }
        );
    }
    QUnit.log = function(message) {
        var messages = {
            'result' : message.result,
            'message' : message.message
        };
        if(message.expected){
            messages['expected'] = message.expected;
            messages['actual'] = message.actual;
        }
        if(message.source){
            messages['source'] = message.source;
        }
        pagerun.result(
            'qunit.log',
            messages
        );
    };
    QUnit.testDone = function(message) {
        pagerun.result(
            'qunit.testDone',
            {
                'module' : message.module,
                'name' : message.name,
                'total' : message.total,
                'passed' : message.passed,
                'failed' : message.failed,
                'runtime' : new Date().getTime() - testStartTime
            }
        );
    };
    QUnit.moduleDone = function(message){
        pagerun.result(
            'qunit.moduleDone',
            {
                'name' : message.name,
                'total' : message.total,
                'passed' : message.passed,
                'failed' : message.failed
            }
        );
    }
    QUnit.done = function(message) {
        pagerun.result(
            'qunit.done',
            {
                'total' : message.total,
                'passed' : message.passed,
                'failed' : message.failed,
                'runtime' : message.runtime
            }
        );
        pagerun.end();
    };
})(window);