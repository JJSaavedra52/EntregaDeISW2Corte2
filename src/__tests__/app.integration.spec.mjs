import supertest from 'supertest';
import {
  describe, jest, expect, beforeEach, afterEach, test,
} from '@jest/globals';
import app from '../app.mjs';
import { startConnection, closeConnection } from '../mongo/index.mjs';

beforeEach(async () => {
  await startConnection();
});

afterEach(async () => {
  await closeConnection();
});

describe('Test app Express server', () => {
  test('Test GET', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('ok');
  });

  test('POST', async () => {
    const response = (await supertest(app).post('/images'))
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'greyscale');

    expect(response.status).toBe(200);
  });
});
