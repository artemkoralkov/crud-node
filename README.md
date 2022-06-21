#  CRUD API
Simple CRUD API using in-memory database underneath.
## Installation
1. Download repo.
2.`npm install`
## Usage
**Development**

`npm run start:dev`

* App runs @ `http://localhost:3000` with nodemon

**Production**

`npm run start:prod`
* Compile `.ts` into `.js` and runs server

**Tests**

`npm run test`

**Multi**
`npm run multi`
* Starts a bunch of servers depends of host cpus.

## Endpoints
- **GET** `api/users` is used to get all persons
- **GET** `api/users/${userId}` is used to get person with `userId`
- **POST** `api/users` is used to create record about new user and store it in database
- **PUT** `api/users/${userId}` is used to update existing user
- **DELETE** `api/users/${userId}` is used to delete existing user from database