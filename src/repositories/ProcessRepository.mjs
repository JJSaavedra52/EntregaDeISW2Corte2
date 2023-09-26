import ProcessModel from '../models/Process.mjs';

class ProcessRepository {
  async save(process) {
    const newProcess = new ProcessModel();
    newProcess.filters = process.filters;
    await newProcess.save();
    return newProcess;
  }
}

export default ProcessRepository;
