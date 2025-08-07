const fs = require("fs");
const path = require("path");
const baseTemplatePath = "/assets/templates";

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function importTemplate(templateName, params) {
  const templatePath = path.join(
    __dirname,
    `../${baseTemplatePath}/${templateName}`
  );
  const template = fs.readFileSync(templatePath, "utf8");
  return renderTemplate(template, params);
}

function renderTemplate(template, params) {
  return template.replace(/{{(.*?)}}/g, (match, p1) => {
    return params[p1] || "";
  });
}

const systemService = {
  delay: delay,
  importTemplate: importTemplate,
};

module.exports = systemService;
