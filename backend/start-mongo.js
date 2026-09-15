const { MongoMemoryServer } = require('mongodb-memory-server');

async function startMongo() {
  try {
    console.log('Starting standalone MongoDB instance on port 27017...');
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'mrdoc'
      }
    });
    const uri = mongoServer.getUri();
    console.log(`MongoDB is RUNNING and listening on ${uri}`);
  } catch (err) {
    console.error('Failed to start MongoDB server:', err);
    process.exit(1);
  }
}

startMongo();
