const fs = require("fs");
const path = require("path");
const baseCheminTemplate = "/assets/templates";

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function importTemplate(nomTemplate, params) {
  const templatePath = path.join(
    __dirname,
    `../${baseCheminTemplate}/${nomTemplate}`
  );
  const template = fs.readFileSync(templatePath, "utf8");
  return renderTemplate(template, params);
}

function renderTemplate(template, params) {
  return template.replace(/{{(.*?)}}/g, (match, p1) => {
    return params[p1] || "";
  });
}

const systemeService = {
  delay: delay,
  importTemplate: importTemplate,
};

module.exports = systemeService;
