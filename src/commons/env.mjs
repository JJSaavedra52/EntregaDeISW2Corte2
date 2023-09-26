import dotenv from 'dotenv';

dotenv.config();
// eslint-disable-next-line
export const { MONGO_URI, PORT, MINIO_HOST, minio_access_key, minio_secret_key } = process.env;
