var LifeWorker = function() {

    var self = this;

    var executeStart = function (process, offset, limit) {
        var positions = [];
        for (var i = offset; i <= limit; i++) {
            if (self.isTrueByRandom()) {
                positions.push(i);
            }
        }

        var packet = self.getPacketSchema();
        packet.command = 'start';
        packet.process = process;
        packet.offset = offset;
        packet.limit = limit;
        packet.positions = positions;

        return packet;
    };

    var executeNext = function (process, offset, limit) {
        return "next";
    };

    this.seed = 0.05;

    this.getPacketSchema = function () {
        return {
            'command': null, 'process': 0, 'offset': 0, 'limit': 0, 'positions': []
        }
    };

    this.isTrueByRandom = function () {
        return (Math.random() < this.seed);
    };

    this.parseAndExecute = function (obj) {
        var command = obj.command;
        var process = obj.process;
        var offset = obj.offset;
        var limit = obj.limit;

        var result = null;
        if (command == 'start') {
            result = executeStart(process, offset, limit);
        } else if (command == 'next') {
            result = executeNext(process, offset, limit);
        }
        return result;
    };
};

onmessage = function(evt) {
    var workerService = new LifeWorker();
    var result = workerService.parseAndExecute(evt.data);
    postMessage(result);
};