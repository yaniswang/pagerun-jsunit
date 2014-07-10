pagerun.newTask('jsunit', function(){
    var win = window;
    var task = this;
    if (win.QUnit === undefined || win.pagerun === undefined) {
        return;
    }
    var testStartTime;
    QUnit.begin = function(){
        task.info(
            {
                'type': 'qunit.begin',
                'url': location.href
            }
        );
    }
    QUnit.moduleStart = function(message){
        task.info(
            {
                'type': 'qunit.moduleStart',
                'module': message.name
            }
        );
    }
    QUnit.testStart = function(message){
        testStartTime = new Date().getTime();
        task.info(
            {
                'type': 'qunit.testStart',
                'module': message.module,
                'name': message.name
            }
        );
    }
    QUnit.log = function(message) {
        var messages = {
            'type': 'qunit.log',
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
        task.info(
            messages
        );
    };
    QUnit.testDone = function(message) {
        task.info(
            {
                'type': 'qunit.testDone',
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
        task.info(
            {
                'type': 'qunit.moduleDone',
                'name' : message.name,
                'total' : message.total,
                'passed' : message.passed,
                'failed' : message.failed
            }
        );
    }
    QUnit.done = function(message) {
        task.info(
            {
                'type': 'qunit.done',
                'total' : message.total,
                'passed' : message.passed,
                'failed' : message.failed,
                'runtime' : message.runtime
            }
        );
        task.end();
    };
});