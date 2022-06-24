const db = require('./db');

const Query = {
    test: () => 'Test Success, GraphQL server is up & running !!',
    lobEvents: () => db.lob.list()
 }
 module.exports = {Query}