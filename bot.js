var IRC = require('irc')
  , slack = require('./lib/slacker');

var client = new IRC.Client('irc.freenode.com', 'slackbot', {
    channels: ['#hipsterdev'],
});

var slacker = new slack.Slacker({
    token: 'xoxp-2175856885-2175856887-2176637470-9337ab'
});

var USERMAP = {
    users: {
        '~jh': 'jimmyhillis',
        'niaal': 'niaal',
        '~sm': 'simon',
        'san_dy': 'sandy'
    },
    nicks: {}
};

// Find user name maping

client.addListener('names', function (channel, nicks) {
    Object.keys(nicks).forEach(function (nick) {
        client.whois(nick, function (whois) {
            USERMAP.nicks[nick] = USERMAP.users[whois.user];
        });
    });
    client.say(channel, 'i\'m all over you slackers');
});

client.addListener('join', function (channel, nick, whois) {
    USERMAP.nicks[nick] = USERMAP.users[whois.user];
    client.say(channel, 'i\'m watching you slacker @' + USERMAP.nicks[nick]);
});

client.addListener('nick', function (old_nick, new_nick, channels) {
    USERMAP.nicks[new_nick] = USERMAP.nicks[old_nick];
    delete USERMAP.nicks[old_nick];
    channels.forEach(function (channel) {
        client.say(channel, 'don\'t think you can hide slacker @' + USERMAP.nicks[new_nick]);
    });
});

// Handle post and pass it to slack

client.addListener('message', function (from, to, message) {
    slacker.send('chat.postMessage', {
        channel: '#irc',
        text: mapUsers(message, USERMAP.nicks),
        username: USERMAP.nicks[from] || from,
        parse: 'full',
        link_names: 1,
        unfurl_links: 1
    });
});

// Map users with whois to get ~loginname for stability

var mapUsers = function (message, users) {
    Object.keys(users).forEach(function (name) {
        if (message.indexOf(name) >= 0) {
            message = message.replace(new RegExp(name, 'g'), '@' + users[name]);
        }
    });
    return message;
};
