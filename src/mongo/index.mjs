import mongoose from 'mongoose';
import { MONGO_URI } from '../commons/env.mjs';

export const startConnection = async () => {
  const url = encodeURI(MONGO_URI);
  await mongoose.connect(url);
};

export const closeConnection = async () => {
  mongoose.connection.close();
};
export default startConnection;
