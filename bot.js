var IRC = require('irc')
  , slack = require('./lib/slacker');

var client = new IRC.Client('irc.freenode.com', 'slackbot', {
    channels: ['#hipsterdev'],
});

var slacker = new slack.Slacker({
    token: 'xoxp-2175856885-2175856887-2176637470-9337ab'
});

var USERMAP = {
    'jimmyhillis': 'jimmyhillis',
    'niaal': 'niaal',
    'simon___': 'simon',
    'san_dy': 'sandy'
};


client.addListener('message', function (from, to, message) {
    slacker.send('chat.postMessage', {
        channel: '#irc',
        text: mapUsers(message, USERMAP),
        username: USERMAP[from] || from,
        parse: 'full',
        link_names: 1,
        unfurl_links: 1
    });
});

var mapUsers = function (message, users) {
    Object.keys(users).forEach(function (name) {
        if (message.indexOf(name) >= 0) {
            message = message.replace(new RegExp(name, 'g'), '@' + users[name]);
        }
    });
    return message;
};
