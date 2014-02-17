# Slack IRC Plugin

IRC integration with [slack](http://slack.com).

## Usage

Write your own configuration file (`config-example.js`) is a good starting point for building your own.

```javascript
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
}
```

Save this to a file in the root of the project then run your bot with:

    node your-config

This will launch the bot in your terminal based on provided configuration.

## Configuration

- `server`: IRC server
- `nick`: IRC bot's nickname
- `token`: Your Slack API token
- `channels`: Map of IRC channel to Slack channel names
- `users`: Map of IRC nick to Slack username

