import Express from "express";
import bodyParser from "body-parser";
import { startConnection } from "./src/mongo/index.mjs";
import filtro from "./src/handlers/filters/index.mjs"
import Boom from "@hapi/boom";
import { PORT } from "./src/commons/env.mjs";
import multer from "multer";
import applyFiltersHandler from "./src/handlers/filters/applyFiltersHandler.mjs";
import path from "path"
import ProcessModel from "./src/models/Process.mjs";

const app = Express();
app.use(bodyParser.json())

// const PORT = 3000;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage
}).single('files');

app.use("/image", filtro);

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            console.log(err);
        }else{
            const newProcess = new ProcessModel ({
                files: {
                    data: req.file.filename,
                    contentType: 'image/jpeg'
                },
                filters: req.body.filters,
            })
            newProcess.save()
            .then(() => res.send("Se subio exitosamente"))
            .catch(err => console.log(err))
        }
    })
});

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