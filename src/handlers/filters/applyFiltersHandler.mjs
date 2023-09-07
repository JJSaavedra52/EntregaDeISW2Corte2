import applyFilters from "../../controllers/filters/applyFilters.mjs";
import Boom from "@hapi/boom";
//Falta ver lo del http
import HttpStatusCodes from "http-status-codes";

const applyFiltersHandler = async (req, res, next) => {
    try {
        const body = req.body;
        const response = await applyFilters(body);
        return res.status(HttpStatusCodes.Ok).json(response);
        return res.send(response);
    } catch (error) {
        const err = Boom.isBoom(error) ? error : Boom.internal(error);
        next(err);
    }
}

export default applyFiltersHandler;