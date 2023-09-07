import { Schema, model } from "mongoose";
import { TYPE_OF_FILTERS } from "../commons/constants.mjs";

const ProcessSchema = new Schema({
    filters: {
        type: [
            {
                type: String,
                enum: TYPE_OF_FILTERS,
                required: true
            }
        ]
    }
}, { timestamps: true });

const ProcessModel = model("process", ProcessSchema);

export default ProcessModel;
