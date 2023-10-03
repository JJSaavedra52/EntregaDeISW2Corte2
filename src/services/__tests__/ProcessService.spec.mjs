import {
  describe, test, expect, jest,
} from '@jest/globals';
import ProcessRepository from '../../repositories/ProcessRepository.mjs';
import ProcessService from '../ProcessService.mjs';
import MinioService from '../MinioService.mjs';

const suma = (a, b) => a + b;

describe('Test suma', () => {
  test('suma 1 + 2 = 3', () => {
    expect(suma(1, 2)).toBe(3);
  });

  test('suma 1 + 3 = 3', () => {
    expect(suma(1, 3)).toBe(4);
  });
});

describe('ProcessService test', () => {
  const processRepository = new ProcessRepository();

  // Opción 1
  const minioService = {
    saveImage: jest.fn()
      .mockImplementationOnce(() => Promise.resolve('image1.png')),
  };

  //  Falta completar la otra opción
  //   const minioService = new MinioService();
  //   minioService.saveImage = jest.fn()
  //     .mockImplementationOnce(() => Promise.resolve('image1.png'));

  const processService = new ProcessService({ processRepository, minioService });

  test('Test applyFilters function with invalid payload', () => {
    expect(processService.applyFilters()).rejects.toThrow();
    expect(processService.applyFilters({})).rejects.toThrow();
    expect(processService.applyFilters({ filters: [] })).rejects.toThrow();
  });

  test('Test applyFilters function with invalid payload', async () => {
    const payload = {
      filters: ['negative'],
      images: [{ originalName: 'image1.png', buffer: Buffer.from('') }],
    };
    const expectedProcess = {
      id: '1234',
      filters: payload.filters,
      images: payload.images,
    };
    processRepository.save = jest.fn()
      .mockImplementation(() => {
        console.log('Se llama esta función mock');
        return expectedProcess;
      });

    const process = await processService.applyFilters(payload);

    expect(process).toMatchObject(expectedProcess);
  });
});
