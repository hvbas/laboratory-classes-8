// Local in-memory database implementation
let database = {
  products: [],
  carts: [{ items: [] }]
};

// Mock collection methods for MongoDB compatibility
const createCollection = (collectionName) => {
  return {
    findOne: async (query = {}) => {
      return database[collectionName][0] || null;
    },
    find: async (query = {}) => {
      return {
        toArray: async () => database[collectionName] || []
      };
    },
    insertOne: async (doc) => {
      if (!database[collectionName]) {
        database[collectionName] = [];
      }
      doc._id = Date.now().toString();
      database[collectionName].push(doc);
      return { insertedId: doc._id };
    },
    updateOne: async (query, update) => {
      if (update.$set && update.$set.items) {
        database[collectionName][0].items = update.$set.items;
      }
      return { modifiedCount: 1 };
    },
    deleteOne: async (query) => {
      if (query.name) {
        database[collectionName] = database[collectionName].filter(item => item.name !== query.name);
      }
      return { deletedCount: 1 };
    }
  };
};

const mongoConnect = (callback) => {
  console.log("Using local in-memory database");
  callback();
};

const getDatabase = () => {
  return {
    collection: (name) => createCollection(name)
  };
};

module.exports = { mongoConnect, getDatabase };
