import Process from "../../models/Process.mjs"
import Joi from "joi";
import Boom from "@hapi/boom";
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from "../../commons/constants.mjs";

const PayloadValidation = Joi.object({
    filters: Joi.array().min(1).items(Joi.string().valid(
        NEGATIVE_FILTER, GREYSCALE_FILTER, BLUR_FILTER
    )),
})

const applyFilters = async (payload) => {
    try {
        await PayloadValidation.validateAsync(payload);

        const filters = payload.filters;
        const files = payload.files;

        // Crear un nuevo documento de Process
        const newProcess = new ProcessModel();

        // Agregar los filtros al documento
        newProcess.filters = filters;

        // Agregar los datos de los archivos al documento
        for (const file of files) {
            newProcess.files.push({
                data: file.buffer, // Datos binarios del archivo
                contentType: file.mimetype // Tipo de contenido del archivo
            });
        }

        // Guardar el documento en la base de datos
        await newProcess.save();

        return newProcess;
    } catch (error) {
        throw Boom.badData(error.message, { error });
    }
};



export default applyFilters;