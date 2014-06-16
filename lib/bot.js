var IRC = require('irc');
var slack = require('./slacker');

/**
 * IRC Bot for syncing messages from IRC to Slack
 * @param {object} config Bot configuration
 * - server: IRC server
 * - nick: Bot IRC nickname
 * - token: Slack token
 * - channels: List of IRC channels to watch
 * - users: Map of ~login: slack usernames
 */
var Bot = function (config) {
    this.config = config || {};
    this._usermap = {
        users: this.config.users || {},
        nicks: {}
    };
    this.client = new IRC.Client(
        this.config.server,
        this.config.nick || 'slackbot',
        {
            userName: this.config.username,
            channels: Object.keys(this.config.channels)
        }
    );
    this.slacker = new slack.Slacker({ token: this.config.token });
    this._trackUsers();
    this._handleErrors();
    return this;
};

/**
 * Whenever an error is provided catch is and let the channel know
 */
Bot.prototype._handleErrors = function () {
    var self = this;
    this.client.addListener('error', function (message) {
        var channel = message.args[1];
        var error_message = mapPronouns(message.args[2]);
        self.client.say(channel, 'I don\'t feel so well... I think it\'s because ' + error_message);
    });
};

/**
 * Find and track IRC users -> slack user mapping
 */
Bot.prototype._trackUsers = function () {
    var self = this;
    var myusername = '~' + self.config.username;
    // On entrance, track all existing names
    this.client.addListener('names', function (channel, nicks) {
        Object.keys(nicks).forEach(function (nick) {
            self.client.whois(nick, function (whois) {
                if (whois.user === myusername) {
                    return;
                }
                self._usermap.nicks[nick] = self._usermap.users[whois.user];
            });
        });
        self.client.say(channel, 'i\'m all over you slackers');
    });
    // New user has joined, match him up
    this.client.addListener('join', function (channel, nick, whois) {
        if (whois.user == myusername) {
            return;
        }
        else {
            self._usermap.nicks[nick] = self._usermap.users[whois.user];
            self.giveOps(channel, nick);
            self.client.say(channel, 'i\'m watching you slacker @' + self._usermap.nicks[nick]);
        }
    });
    // Existing user has changed nickname
    this.client.addListener('nick', function (old_nick, new_nick, channels) {
        if (new_nick === self.config.nick) {
            return;
        }
        self._usermap.nicks[new_nick] = self._usermap.nicks[old_nick];
        delete self._usermap.nicks[old_nick];
        channels.forEach(function (channel) {
            self.client.say(channel, 'don\'t think you can hide slacker @' + self._usermap.nicks[new_nick]);
        });
    });
};

/**
 * Attempt to give a user op controls
 */
Bot.prototype.giveOps = function (channel, nick) {
    this.client.send('MODE', channel, '+o', nick);
};

/**
 * Handle post and pass it to slack
 */
Bot.prototype.listen = function () {
    var self = this;
    // Handle public user post
    this.client.addListener('message', function (from, to, message) {
        self.slacker.send('chat.postMessage', {
            channel: '#irc',
            text: self.prepareMessage(message, self._usermap.nicks),
            username: self._usermap.nicks[from] || from,
            parse: 'full',
            link_names: 1,
            unfurl_links: 1
        });
    });
};

/**
 * Map users with whois to get ~loginname for stability
 * @param {string} message Message to replace IRC user with slack @user
 * @param {array} users User mapping
 * @return {string} Message with slack @users
 */
Bot.prototype.prepareMessage = function (message, users) {
    Object.keys(users).forEach(function (name) {
        if (message.indexOf(name) >= 0) {
            message = message.replace(new RegExp(name, 'g'), '@' + users[name]);
        }
    });
    return message;
};

/**
 * Try and map error commands (in third person) to first person
 * so the bot is more personal.
 */
var mapPronouns = function (error_message) {
    var map = {
        'you': 'i',
        'you\'re': 'i\'m',
    };
    error_message = error_message.split(' ').map(function (word) {
        return map[word.toLowerCase()] ? map[word.toLowerCase()] : word;
    }).join(' ');
    return error_message;
};

exports = module.exports.Bot = Bot;
