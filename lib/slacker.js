var request = require('request');

var Slacker = function (args) {
    this.token = args.token;
    return this;
};

Slacker.prototype.send = function (method, args) {

    var packet = {
        form: args || {}
    };

    packet.form.token = this.token;

    request.post('https://slack.com/api/' + method,  packet, function (error, response, body) {

    });

};

exports.Slacker = Slacker;
