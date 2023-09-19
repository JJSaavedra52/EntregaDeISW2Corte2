import path from "path"
import multer from "multer";
import ProcessModel from "../../models/Process.mjs";
import { PayloadValidation } from "../filters/applyFilters.mjs";


//--------------Multer config----------------------
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
}).array('files', 5);
//--------------END Multer config-----------------------------

//------------New Part that allows images uploads--------------
const uploadFiles = async (req, res) => {
    try {
        // Validar que el campo 'filters' contenga al menos un filtro válido
        const filters = req.body.filters;
        const { error } = PayloadValidation.validate({ filters });

        if (error) {
            console.error('Error de validación:', error.details);
            return res.status(422).json({ error: 'Se requiere al menos un filtro válido en el campo "filters".' });
        }

        // Continuar con la subida de archivos
        upload(req, res, async (err) => {
            if (err) {
                console.error('Error al subir archivos:', err);
                return res.status(500).json({ error: 'Error al subir archivos' });
            }

            const files = req.files; // Array de archivos
            const filters = req.body.filters;

            for (const file of files) {
                const newProcess = new ProcessModel({
                    files: {
                        data: file.filename,
                        contentType: file.mimetype
                    },
                    filters: filters,
                });

                // Intentar guardar el proceso en la base de datos
                try {
                    await newProcess.save();
                } catch (saveError) {
                    console.error('Error al guardar en la base de datos:', saveError);
                    // Puedes manejar el error aquí y enviar una respuesta adecuada
                    return res.status(500).json({ error: 'Error al guardar en la base de datos' });
                }
            }

            res.send("Se subieron exitosamente " + files.length + " imágenes.");
        });
    } catch (validationError) {
        console.error('Error de validación:', validationError);
        return res.status(422).json({ error: 'Error de validación' });
    }
};


// const uploadFiles = (req, res) => {
//     // Validar que el campo 'filters' contenga al menos un filtro válido
//     const filters = req.body.filters;
//     const { error } = PayloadValidation.validate({ filters });

//     if (error) {
//         return res.status(422).json({ error: 'Se requiere al menos un filtro válido en el campo "filters".' });
//     }

//     // Continuar con la subida de archivos
//     upload(req, res, async (err) => {
//         if (err) {
//             console.log(err);
//             res.status(500).json({ error: 'Error al subir archivos' });
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
// };
//--------------------END of image upload--------------------------

export default uploadFiles;
