import applyFilters from "../../controllers/filters/applyFilters.mjs";
import Boom from "@hapi/boom";
import HttpStatusCodes from "http-status-codes";

const applyFiltersHandler = async (req, res, next) => {
    try {
        // Accede a los archivos subidos utilizando req.files
        const files = req.files;
        // Accede al filtro proporcionado en el formulario
        const filters = req.body.Filters;
        // Construye un objeto de payload con los archivos y filtros
        const payload = {
            files,
            filters,
        };

        const response = await applyFilters(payload);
        return res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
        const err = Boom.isBoom(error) ? error : Boom.internal(error);
        next(err);
    }
};

export default applyFiltersHandler;