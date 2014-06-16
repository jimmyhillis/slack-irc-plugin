var slackbot = require('./lib/bot');

var config = {
    server: 'irc.freenode.com',
    nick: 'slackbot',
    username: 'slackbot-username',
    token: 'XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXX',
    channels: {
        '#irc-channel password(optional)': '#slack-channel'
    },
    users: {
        '~irclogin': 'slackuser'
    }
};

var slackbot = new slackbot.Bot(config);
slackbot.listen();
