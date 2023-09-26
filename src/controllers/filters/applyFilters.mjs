import Joi from 'joi';
import Boom from '@hapi/boom';
import Process from '../../models/Process.mjs';
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../../commons/constants.mjs';

const PayloadValidation = Joi.object({
  // eslint-disable-next-line
  filters: Joi.array().min(1).items(Joi.string().valid(NEGATIVE_FILTER, GREYSCALE_FILTER, BLUR_FILTER)),
  images: Joi.array().required(),
});

const applyFilters = async (payload) => {
  try {
    await PayloadValidation.validateAsync(payload);
  } catch (error) {
    throw Boom.badData(error.message, { error });
  }

  const newProcess = new Process();
  newProcess.filters = payload.filters;

  await newProcess.save();

  return newProcess;
};

// export default applyFilters;
export { PayloadValidation, applyFilters };
