import Joi from 'joi';
import Boom from '@hapi/boom';
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../../commons/constants.mjs';

class ProcessService {
  processRepository = null;

  // payloadValidation = Joi.object({
  //     // eslint-disable-next-line
  //     filters: Joi.array().min(1).items(Joi.string().valid(NEGATIVE_FILTER, GREYSCALE_FILTER, BLUR_FILTER)),
  //     images: Joi.array().required();

  constructor({ processRepository, minioService }) {
    this.processRepository = processRepository;
    this.minioService = minioService;
  }

  async applyFilters(payload) {
    try {
      await PayloadValidation.validateAsync(payload);
    } catch (error) {
      throw Boom.badData(error.message, { error });
    }

    const process = await this.processRepository.save(payload);
    return process;
  }
}

export default ProcessService;
