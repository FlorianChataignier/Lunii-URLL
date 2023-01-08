# Lunii-URLL

## Overview

This project is an URL shortener API.

It is based on Node.js, Express.js & Typescript.
The database used to store shortened URLs is DynamoDB. There is only one Table.

This project is developped following a TDD approach :

- **Unit tests**: Uses Jest, and voluntarily does not use Supertest because we want to unit test, not to make functional tests! So route handlers are exported separately so we can test them unitarely
- **Fonctional tests**: Should add Docker with images for DB to make sure our code really modifies a mock BDD
- **Integration tests**: Should add integration tests on a pipeline (Github, Gitlab, Jenkins, etc.) to make sure our code integrates well with other already-existing services of the company

## Current routes

| Method | Path                    | Description                                                           |
| ------ | ----------------------- | --------------------------------------------------------------------- |
| GET    | /api/shorturl/:id       | Redirects the user to the URL corresponding to the specified short ID |
| GET    | /api/shorturl/analytics | Returns all the shortened URLs                                        |
| POST   | /api/shorturl           | Inserts a new shortened URL into DynamoDB                             |

## Setup

### Install dependencies

```
npm i
```

### Add environment variables

```
cp .env.example .env
```

Then open .env and add the right environment variables.

### Start project

```
npm start
```

### Run unit tests

```
npm run unit-tests
```

## Limitations

- Currently the project is free, with no logged users. The code is thought to be evolutive: if the project changes its business model to adds pricing and logged users for example, the current architecture would follow.

- The specs ask to redirect if the user visits [BASE_URL]/api/shorturl/[:id], but maybe we should redirect if he visits [BASE_URL]/[:id], because sending a user to a /api/\*\* route is not user-friendly.

- There is no Frontend yet
