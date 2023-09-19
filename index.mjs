import Express from "express";
import bodyParser from "body-parser";
import { startConnection } from "./src/mongo/index.mjs";
import filtro from "./src/handlers/filters/index.mjs"
import Boom from "@hapi/boom";
import { PORT } from "./src/commons/env.mjs";
import uploadFiles from "./src/controllers/files/uploadFiles.mjs";

const app = Express();
app.use(bodyParser.json())

// Ruta que permite subir varias imagenes (solo se puede con un filtro de momento)
app.post("/upload", uploadFiles);

app.use("/image", filtro);

app.use((error, req, res, next) => {
    if (error) {
        let err = Boom.isBoom(error) ? error : Boom.internal(error);
        const statusCode = err.output.statusCode;
        const payload = err.output.payload;
        return res.status(statusCode).json(payload);
    }

    return next;
})

app.get("/", (req, res) => {
    res.send("Hola")
})

const startServer = async () => {
    await startConnection();
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    })
}

startServer();