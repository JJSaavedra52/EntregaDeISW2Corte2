import { startConnection } from './src/mongo/index.mjs';
import { PORT } from './src/commons/env.mjs';
import app from './src/app.mjs';

const startServer = async () => {
  await startConnection();
  app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`http://localhost:${PORT}`);
  });
};

startServer();
