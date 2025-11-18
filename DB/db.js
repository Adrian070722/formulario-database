const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function connectDB() {
  try {
    await client.connect();
    console.log("conectado a MongoDB");
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
  }
}

module.exports = { connectDB, client };
