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
      "min": [
        {
          "producer": "Bo Derek",
          "interval": 1,
          "previousWin": 1990,
          "followingWin": 1991
        },
        {
          "producer": "Carol Baum and Howard Rosenman",
          "interval": 1,
          "previousWin": 1990,
          "followingWin": 1991
        }
      ],
      "max": [
        {
          "producer": "Carol Baum and Howard Rosenman",
          "interval": 8,
          "previousWin": 1991,
          "followingWin": 1999
        }
      ]
    };

    return request(app.getHttpServer())
      .get('/producer/stats/award-intervals')
      .expect(200)
      .expect(expectedResult);
  });
});
