var slackbot = require('./lib/bot');

var config = {
    server: 'irc.freenode.com',
    nick: 'slackbot',
    token: 'XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXX',
    channels: {
        '#irc-channel': '#slack-channel'
    },
    users: {
        '~irclogin': 'slackuser'
    }
};

var slackbot = new slackbot.Bot(config);
slackbot.listen();
