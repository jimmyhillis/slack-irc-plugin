# Slack IRC Plugin

IRC integration with [slack](http://slack.com).

## Usage

```javascript
git clone https://github.com/jimmyhillis/slack-irc-plugin.git
cd slack-irc-plugin
npm install
```

Write your own configuration file (`config-example.js`) is a good starting point for building your own.

```javascript
var config = {
    // required
    server: 'irc.freenode.com',
    port: 6667,
    secure: false,
    password: '(optional)',
    nick: 'slackbot',
    username: 'slackbot-username',
    token: 'XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXX',
    channels: {
        '#irc-channel password(optional)': '#slack-channel'
    },
    users: {
        '~irclogin': 'slackuser'
    },
    // optionals
    silent: false // default
    // node-irc options
    floodProtection: true
}
```

Save this to a file in the root of the project then run your bot with:

    node your-config

This will launch the bot in your terminal based on provided configuration.

## Configuration

- `server`: IRC server
- `nick`: IRC bot's nickname
- `username`: IRC bot's IRC login (no tilde ~)
- `token`: Your Slack API token, get your token at https://api.slack.com/
- `channels`: Map of IRC channel to Slack channel names, with optional password
- `users`: Map of IRC nick to Slack username
- `silent`: Set to true to stop IRC bot from speaking into the channel

