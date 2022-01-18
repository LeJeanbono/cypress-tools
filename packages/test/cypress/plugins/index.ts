/// <reference types="cypress" />
const { pgTasks } = require('@cypress-tools/postgres');
const { mysqlTasks } = require('@cypress-tools/mysql');
const { pdfTasks } = require('@cypress-tools/pdf');
const { mongoDBTasks } = require('@cypress-tools/mongodb');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = async (on: Cypress.PluginEvents, config: Cypress.PluginConfig) => {
  const tasks = await mongoDBTasks(config, { debug: true })
  on('task', {
    ...pgTasks(config, { debug: false }),
    ...mysqlTasks(config, { debug: true }),
    ...pdfTasks(),
    ...tasks,
  })
}
