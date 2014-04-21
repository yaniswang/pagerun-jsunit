(function(win){
    if (win.mocha === undefined || win.pagerun === undefined) {
        return;
    }
    pagerun.waitMe();
    mocha.setup({reporter: function(runner){
        var runnerStartTime, suiteCount = 0, specCount = 0, failedCount = 0, passedCount = 0;
        
        runner.on('start', function() {
            pagerun.result('mocha.start', 'Start of the Mocha runner.');
            runnerStartTime = new Date().getTime();
        });
        
        runner.on('suite', function(suite){
            if (suite.root) return;
            suiteCount ++;
        });
        
        runner.on('pass', function(test){
            var slow = test.slow(),
                medium = slow / 2,
                duration = test.duration;
            test.speed = duration > slow
              ? 'slow'
              : duration > medium
                ? 'medium'
                : 'fast';
        });
        
        runner.on('fail', function(test, error) {
            if(test.errors === undefined){
                test.errors = [];
            }
            test.errors.push(error);
        });
        
        runner.on('test end', function(test) {
            specCount ++;
            var state = test.state ? test.state : 'pending';
            var objResult = {
                'suiteName': test.parent.fullTitle(),
                'testTitle': test.title,
                'state': state,
                'elapsed': test.duration,
                'speed': test.speed
            };
            if(state === 'failed'){
                var arrTextErrors = [], errors = test.errors;
                for(var i=0,c=errors.length;i<c;i++){
                    arrTextErrors.push(getErrorMessage(errors[i]));
                }
                objResult.errors = arrTextErrors.join('\n\n');
                failedCount ++;
            }
            else if(state === 'passed'){
                passedCount ++;
            }
            pagerun.result('mocha.testEnd', objResult);           
        });
        
        runner.on('end', function() {
            var elapsed = new Date().getTime() - runnerStartTime;
            pagerun.result('mocha.end', {
                suiteCount: suiteCount,
                specCount: specCount,
                failedCount: failedCount,
                passedCount: passedCount,
                elapsed: elapsed
            });
            pagerun.end();
        });
    }});
    
    function getErrorMessage(err){
        var message = err.message || '',
            stack = err.stack;
        if(!stack && err.sourceURL && err.line !== undefined){
           stack = '(' + err.sourceURL + ':' + err.line + ')';
        }
        if(stack !== undefined){
            stack = stackFilter(stack);
            if (stack.indexOf(message) !== -1) {
                message = stack;
            }
            else{
                message += '\n' + stack;
            }
        }
        return message;
    }
    function stackFilter(stack) {
        var arrResults = [];
        var arrLines = (stack || '').split(/\r?\n/),
            line;
        for (var i = 0, c = arrLines.length; i < c; i++) {
            line = arrLines[i];
            if (!/\/mocha([-_][^\.]+)?\.js/i.test(line)) {
                arrResults.push(line);
            };
        }
        return arrResults.join('\n');
    }
})(window);