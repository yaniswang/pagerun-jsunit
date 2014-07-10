pagerun.newTask('jsunit', function(){
    var win = window;
    var task = this;
    if (win.jasmine === undefined || win.pagerun === undefined) {
        return;
    }
    jasmine.HtmlReporter = function(_doc) {
        var self = this;
        var doc = _doc || window.document;

        self.reportRunnerStarting = function(runner) {
            self.runnerStartTime = new Date().getTime();
            self.suiteCount = 0;
            self.specCount = 0;
            self.failedCount = 0;
            self.passedCount = 0;
            task.info({
                'type': 'jasmine.start',
                'url': location.href
            });
        };

        self.reportSpecStarting = function(spec) {
            self.specStartTime = new Date().getTime();
        };

        self.reportSpecResults = function(spec) {
            var elapsed = new Date().getTime() - self.specStartTime,
                results = spec.results();

            var status = results.skipped ? 'skipped' : (results.passed() ? 'passed' : 'failed');

            var messages = [];
            if (status === 'failed') {
                var resultItems = results.getItems(),
                    item;
                for (var i = 0, c = resultItems.length; i < c; i++) {
                    item = resultItems[i];
                    if (item.type == 'expect' && item.passed && !item.passed()) {
                        messages.push({
                            message: item.message,
                            stack: self.stackFilter(item.trace.stack)
                        });
                    }
                }
                self.failedCount++;
            }
            else if(status === 'passed'){
                self.passedCount++;
            }
            self.specCount++;

            task.info({
                'type': 'jasmine.specEnd',
                'suiteName': spec.suite.getFullName(),
                'specName': spec.description,
                'status': status,
                'expectCount': results.totalCount,
                'expectPassed': results.passedCount,
                'expectFailed': results.failedCount,
                'messages': messages,
                'elapsed': elapsed
            });
        };

        self.reportSuiteResults = function(suite) {
            self.suiteCount++;
        };

        self.reportRunnerResults = function(runner) {
            var elapsed = new Date().getTime() - self.runnerStartTime
            task.info({
                'type': 'jasmine.end',
                'suiteCount': self.suiteCount,
                'specCount': self.specCount,
                'failedCount': self.failedCount,
                'passedCount': self.passedCount,
                'elapsed': elapsed
            });
            task.end();
        };

        self.log = function() {
            task.info({
                'type': 'jasmine.log',
                'message': Array.prototype.slice.call(arguments)
            });
        };

        self.specFilter = function(spec) {
            return true;
        };

        self.stackFilter = function(stack) {
            var arrResults = [];
            var arrLines = (stack || '').split(/\r?\n/),
                line;
            for (var i = 0, c = arrLines.length; i < c; i++) {
                line = arrLines[i];
                if (!/\/jasmine(-\d|\.js)/i.test(line)) {
                    arrResults.push(line);
                };
            }
            return arrResults.join('\n');
        }

        return self;
    };
});