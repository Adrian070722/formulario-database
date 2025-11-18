//TEST FILE FOR MONGODB CONNECTION

// Importamos el cliente de MongoDB
/*const { MongoClient } = require("mongodb");

// URI de conexión. Por defecto es localhost en el puerto 27017.
// Sustituye 'myDatabase' por el nombre de tu base de datos.
const uri = "mongodb://localhost:27017";

// Crea una instancia del Cliente.
const client = new MongoClient(uri);

async function run() {
  try {
    // 1. Conexión del Código a Mongo 🚀
    // Conecta el cliente al servidor de MongoDB
    await client.connect();
    console.log("Conectado exitosamente al servidor de MongoDB!");

    // 2. Selección de la Base de Datos y Colección
    const database = client.db("myDatabase"); // Puedes cambiar 'myDatabase'
    const collection = database.collection("users"); // Nombre de la colección

    // 3. Operación (Insertar un documento)
    const doc = { name: "Alice", age: 30, city: "New York" };
    const result = await collection.insertOne(doc);
    console.log(`Documento insertado con el id: ${result.insertedId}`);

    // 4. Verificación (Opcional: Leer los datos insertados) 🔄
    const findResult = await collection.find({}).toArray();
    console.log("Documentos encontrados (De Mongo a Servidor):", findResult);
  } catch (error) {
    console.error("Error al conectar o realizar operación:", error);
  } finally {
    // Cierra la conexión cuando termines o si hay un error
    await client.close();
    console.log("Conexión de MongoDB cerrada.");
  }
}

// Ejecuta la función principal
run();*/
