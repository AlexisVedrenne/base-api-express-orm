
const { sequelize } = require('../../models');
const logs = require("./log.js");

async function addEmbbedAndIndex(table, nbVector) {
  const [result] = await sequelize.query(`
    SELECT column_name 
    FROM information_schema.columns
    WHERE table_name = '${table}' 
    AND column_name = 'embedding';
  `);

  if (result.length === 0) {
    await db.sequelize.query(`
      ALTER TABLE "${table}" ADD COLUMN embedding vector(${nbVector});
    `);
    logs.createLogSysteme(
      `Colonne "embedding" ajoutée avec le type vector pour ${table}.`,
      "addEmbbedAndIndex"
    );
    await sequelize.query(`
        CREATE INDEX ON "${table}" USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
      `);
    logs.createLogSysteme(`Index créer pour ${table}.`, "addEmbbedAndIndex");
  }
}

async function initPgvector(nbVector) {
  try {
    // Vérifie si l'extension pgvector existe
    await sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS vector;
    `);
    await sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `);
    logs.createLogSysteme(
      'Extension "pgvector" et "uuid-ossp" vérifiée ou créée.',
      "initPgvector"
    );
    // await addEmbbedAndIndex("recipes", nbVector);
  } catch (error) {
    logs.createErrorSysteme(
      "Impossible de modifier les tables pour pgvector. " + error,
      "initPgvector"
    );
  }
}



/**
 * Fonction d'initialisation des rôles et des utilisateurs
 */
async function initBdd() {
  try {
    // await db.sequelize.sync({ force: force, alter:true });
    await initPgvector(768);
    logs.createLogSysteme(`Base de donnée initialisée.`, "initBdd");
  } catch (e) {
    console.error(`Impossible d'initialiser la BDD : ${e.message}`);
  }
}

const seq = { initBdd: initBdd };

module.exports = seq;
