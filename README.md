<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">An Movie awards intervals using Nest framework and in memory database.</p>

## Description

On initialization the system will dump data from csv file, and on the GET /producers/stats/award-intervals route will retrieve only winners with the minimun and maximum between two oscars.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development with hot reload
$ yarn run start:dev:reload

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests (only e2e)

```bash

# e2e tests
$ yarn run test:e2e

## Deployment

Only for tests purposes

```

## Stay in touch

- Author - [Alfredo de Carvalho Neto](https://linkedin.com/in/alfredo-carvalho-neto)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
