import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)/producer/stats/award-intervals', () => {
    const expectedResult = {
      min: [
        {
          producer: 'Bo Derek',
          interval: 6,
          previousWin: 1984,
          followingWin: 1990
        }
      ],
      max: [
        {
          producer: 'Bo Derek',
          interval: 6,
          previousWin: 1984,
          followingWin: 1990
        }
      ]
    };

    return request(app.getHttpServer())
      .get('/producer/stats/award-intervals')
      .expect(200)
      .expect(expectedResult);
  });
});
