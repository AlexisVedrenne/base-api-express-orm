const { LogSysteme, LogApi } = require('../models');
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const documentsPath = path.join(process.env.USERPROFILE, "Documents");
const appName = `${require("../../package.json").name}`;

function getLogPathForFile(fileName) {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;

  const logDirPath = path.join(
    documentsPath,
    "Logs",
    appName,
    formattedDate
  );

  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath, { recursive: true });
  }

  return path.join(logDirPath, fileName);
}

function appendOrCreateLog(filePath, content) {
  if (fs.existsSync(filePath)) {
    fs.appendFile(filePath, `\n${content}`, (err) => {
      if (err) console.error(`Error while appending line: ${err}`);
    });
  } else {
    fs.writeFile(filePath, content, (err) => {
      if (err) console.error(`Error while creating file: ${err}`);
    });
  }
}

function addLogTexteApi(logData) {
  const date = new Date();
  const filePath = getLogPathForFile("logApi.txt");
  const line = `${date.toLocaleString()} | ${logData.method} | ${logData.uri} | ${logData.uri} | ${logData.ipAddress} | ${logData.statusCode}`;
  appendOrCreateLog(filePath, line);
}

function addLogTexteSysteme(message, fonction, code) {
  const date = new Date();
  const filePath = getLogPathForFile("logSysteme.txt");
  const line = `${date.toLocaleString()} | ${fonction} | ${message} | ${code}`;
  appendOrCreateLog(filePath, line);
}

function addLogTexteErreurSysteme(message, fonction, code) {
  const date = new Date();
  const filePath = getLogPathForFile("logSysteme.txt");
  const line = `${date.toLocaleString()} | ERREUR | ${fonction} | ${message} | ${code}`;
  appendOrCreateLog(filePath, line);
}

function createLogSysteme(message, fonction) {
  try {
    const code = uuidv4();
    LogSysteme.create({
      message: message,
      function: fonction,
      code: code,
    });
    console.log(`[SYSTEM INFO LOG] : ${message}`);
    addLogTexteSysteme(message, fonction, code);
  } catch (e) {
    console.error(`[LOG INFO] SYSTEM ERROR: Log not saved ${e}`);
  }
}

function createErrorSysteme(message, fonction) {
  try {
    const code = uuidv4();
    LogSysteme.create({
      message: message,
      function: fonction,
      code: code,
    });
    console.log(`[SYSTEM ERROR LOG] : ${message}`);
    addLogTexteErreurSysteme(message, fonction, code);
  } catch (e) {
    console.error(`[LOG INFO] SYSTEM ERROR: Log not saved ${e}`);
  }
}

function createLogApi(message, logData) {
  try {
    LogApi.create(logData);
    console.log(`[API INFO LOG] : ${message}`);
    addLogTexteApi(logData);
  } catch (e) {
    console.error(`[LOG INFO] API ERROR: Log not saved ${e}`);
  }
}

const logs = {
  createLogApi,
  createLogSysteme,
  createErrorSysteme,
};

module.exports = logs;
