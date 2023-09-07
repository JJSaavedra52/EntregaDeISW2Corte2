import applyFilters from "../../controllers/filters/applyFilters.mjs";
import Boom from "@hapi/boom";

const applyFiltersHandler = async (req, res, next) => {
    try {
        const body = req.body;
        const response = applyFilters(body);
        return res.send(response);
    } catch (error) {
        const err = Boom.isBoom(error) ? error : Boom.internal(error);
        next(err);
    }
}

export default applyFiltersHandler;