const mailer = require("../boot/mailer");
const systemeService = require("./systeme");
const config = require("../config/mailer.config");

async function sendResetPassword(user, uuid) {
  try {
    user.redirectUrl = `${mailer.redirectUrl}/${uuid.uuid}`;
    await mailer.mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "alexisvedrenne482@gmail.com",
            Name: config.appName,
          },
          To: [
            {
              Email: user.mail,
              Name: `${user.lastName} ${user.name}`,
            },
          ],
          Subject: `[${config.appName}] Demande de changement de mot de passe`,
          HTMLPart: systemeService.importTemplate(
            "password.template.html",
            user
          ),
        },
      ],
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

const mailerService = {
  sendResetPassword: sendResetPassword,
};

module.exports = mailerService;
