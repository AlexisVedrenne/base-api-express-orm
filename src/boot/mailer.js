const config = require("../config/mailer.config.js");
const serverConfig = require("../config/server.config.js")
const Mailjet = require ('node-mailjet')
const mailjet = Mailjet.apiConnect(config.mailjetKey, config.mailjetSecret)

const url = `https://${serverConfig.host}:${serverConfig.apiPort}/${config.redirectUrl}`

module.exports = { mailjet: mailjet, redirectUrl: url };
