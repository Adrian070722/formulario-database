const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const { connectDB, client } = require("./DB/db");

// Conectar a la base de datos (no await aquí, connectDB maneja internamente)
connectDB();

const PORT = process.env.PORT || 2300;

function sendFile(res, filepath, contentType) {
  try {
    const content = fs.readFileSync(filepath);
    res.setHeader("Content-Type", contentType);
    res.end(content);
  } catch (err) {
    console.error("Error leyendo archivo:", err);
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
  }
}

const server = http.createServer((req, res) => {
  try {
    const { method, url: reqUrl } = req;
    // Rutas estáticas
    if (
      method === "GET" &&
      (reqUrl === "/" || reqUrl === "/index.html" || reqUrl === "/form.html")
    ) {
      sendFile(
        res,
        path.join(__dirname, "form.html"),
        "text/html; charset=utf-8"
      );
      return;
    }

    if (method === "GET" && reqUrl === "/styles.css") {
      sendFile(
        res,
        path.join(__dirname, "styles.css"),
        "text/css; charset=utf-8"
      );
      return;
    }

    if (method === "GET" && reqUrl === "/main.js") {
      sendFile(
        res,
        path.join(__dirname, "main.js"),
        "application/javascript; charset=utf-8"
      );
      return;
    }

    // Servir panel de administración (HTML generado dinámicamente)
    if (method === "GET" && reqUrl === "/admins.html") {
      sendFile(
        res,
        path.join(__dirname, "admins.html"),
        "text/html; charset=utf-8"
      );
      return;
    }

    // Listar envíos (útil para verificar rápidamente)
    if (
      method === "GET" &&
      (reqUrl === "/submissions" || reqUrl === "/api/submissions")
    ) {
      (async () => {
        try {
          const dbName = process.env.MONGODB_DB || "formulario";
          const collectionName =
            process.env.MONGODB_COLLECTION || "submissions";
          const col = client.db(dbName).collection(collectionName);
          const docs = await col
            .find({})
            .sort({ _id: -1 })
            .limit(100)
            .toArray();
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(docs));
        } catch (err) {
          console.error("Error leyendo submissions:", err);
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Error al leer la base de datos");
        }
      })();
      return;
    }

    // Recibir formulario y guardar en MongoDB
    if (
      method === "POST" &&
      (reqUrl === "/submit" ||
        reqUrl === "/submit-form" ||
        reqUrl === "/api/submit")
    ) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
        if (body.length > 1e6) req.socket.destroy();
      });

      req.on("end", async () => {
        const contentType = (req.headers["content-type"] || "").toLowerCase();
        let data;
        try {
          if (contentType.includes("application/json")) {
            data = JSON.parse(body || "{}");
          } else {
            data = querystring.parse(body);
          }
        } catch (err) {
          console.error("Error parseando body:", err);
          res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Body inválido");
          return;
        }

        try {
          const dbName = process.env.MONGODB_DB || "formulario";
          const collectionName =
            process.env.MONGODB_COLLECTION || "submissions";
          const col = client.db(dbName).collection(collectionName);
          const result = await col.insertOne(data);
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ success: true, id: result.insertedId }));
        } catch (err) {
          console.error("Error guardando en MongoDB:", err);
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Error al guardar en la base de datos");
        }
      });

      return;
    }

    // Ruta no encontrada
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Página no encontrada");
  } catch (err) {
    console.error("Error en el servidor:", err);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Error interno del servidor");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
