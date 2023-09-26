import path from 'path';
import multer from 'multer';
import ProcessModel from '../../models/Process.mjs';
import { PayloadValidation } from '../filters/applyFilters.mjs';

// --------------Multer config----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Carpeta donde se guardarán las imágenes
  },
  filename(req, file, cb) {
    // eslint-disable-next-line
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
}).array('files', 5);
// --------------END Multer config-----------------------------

// ------------New Part that allows images uploads--------------
// eslint-disable-next-line
const uploadFiles = (req, res) => {
  try {
    // Continuar con la subida de archivos
    // eslint-disable-next-line
    upload(req, res, async (err) => {
      if (err) {
        // eslint-disable-next-line
        console.error('Error al subir archivos:', err);
        return res.status(500).json({ error: 'Error al subir archivos' });
      }

      const { files } = req; // Array de archivos
      const { filters } = req.body;

      // Validación
      // eslint-disable-next-line
      console.log(filters);

      const filtersArray = filters.split(',');

      const { error } = PayloadValidation.validate({ filters: filtersArray });

      if (error) {
        // eslint-disable-next-line
        console.error('Error de validación:', error.details);
        return res.status(422).json({ error: 'Se requiere al menos un filtro válido en el campo "filters".' });
      }

      files.forEach(async (file) => {
        const newProcess = new ProcessModel({
          files: {
            data: file.filename,
            contentType: file.mimetype,
          },
          filters: filtersArray,
        });

        await newProcess.save();
      });
      res.send(`Se subieron exitosamente ${files.length} imágenes.`);
    });
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error al subir archivos:', error);
    return res.status(500).json({ error: 'Error al subir archivos' });
  }
};

// --------------------END of image upload--------------------------

export default uploadFiles;
