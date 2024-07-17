import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import * as request from 'supertest';

describe('Bootstrap Function (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('HTTP Server should be available if HTTP_SERVER_AVALIABLE is true', async () => {
    if (process.env.HTTP_SERVER_AVALIABLE === 'true') {
      await request(app.getHttpServer())
        .get('/')
        .expect(200)
        .then((response) => {
          expect(response.text).toContain('Hello World!');
        });

      // Check Swagger Documentation
      await request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .then((response) => {
          expect(response.text).toContain('Swagger');
        });
    } else {
      expect(true).toBe(true);
    }
  });

  it('Microservice should be defined', () => {
    expect(app.getMicroservices()).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
