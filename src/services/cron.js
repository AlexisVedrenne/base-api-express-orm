const cron = require("node-cron");
const logs = require("../services/log");
const uuidController = require("../controllers/uuid.controller");

function cronDeleteOldUuid() {
  cron.schedule("0 * * * *", () => {
    logs.createLogSysteme(
      `[CRON] Tâche exécutée à ${new Date().toLocaleString()}`,
      "cronDeleteOldUuid"
    );
    uuidController.deleteOldUuid();
  });
}

exports.initCron = ()=>{
    cronDeleteOldUuid()
}

  