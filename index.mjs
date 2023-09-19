import Express from "express";
import bodyParser from "body-parser";
import { startConnection } from "./src/mongo/index.mjs";
import filtro from "./src/handlers/filters/index.mjs"
import Boom from "@hapi/boom";
import { PORT } from "./src/commons/env.mjs";
import multer from "multer";
// import applyFiltersHandler from "./src/handlers/filters/applyFiltersHandler.mjs";
import path from "path"
import ProcessModel from "./src/models/Process.mjs";
import uploadFiles from "./src/controllers/files/uploadFiles.mjs";

const app = Express();
app.use(bodyParser.json())

//--------------Multer config----------------------
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads'); // Carpeta donde se guardarán las imágenes
//     },
//     filename: function (req, file, cb) {
//         console.log(file);
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({
//     storage: storage
// }).array('files', 5);
// //--------------END Multer config-----------------------------

// //------------New Part that allows images uploads--------------
// //------------------Image upload-------------------------------
// app.post('/upload', (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             const files = req.files; // Array de archivos
//             const filters = req.body.filters;

//             for (const file of files) {
//                 const newProcess = new ProcessModel({
//                     files: {
//                         data: file.filename,
//                         contentType: file.mimetype
//                     },
//                     filters: filters,
//                 });

//                 await newProcess.save();
//             }

//             res.send("Se subieron exitosamente " + files.length + " imágenes.");
//         }
//     });
// });
//--------------------END of image upload--------------------------
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