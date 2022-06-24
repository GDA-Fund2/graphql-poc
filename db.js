const { DataStore } = require('notarealdb');

const store = new DataStore('./data');

module.exports = {
   lob:store.collection('lob')
};