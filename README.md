![Docker Compose Actions Workflow](https://github.com/blipn/pAPIs/workflows/Docker%20Compose%20Actions%20Workflow/badge.svg)

### Running API tests from docker

Run tests :
```bash
docker-compose up --exit-code-from web
```

Or :
```bash
npm install

npm test
```

Run :
```bash
npm start
```

### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

5. **Required env variables:**  

    `MONGODB_URL` will be your MongoDB connection string.

    `JWT_SECRET` will be your secret for jwt authentication.

    `JWT_TIMEOUT_DURATION` will be the timeout for jwt validity.

```json
MONGODB_URL=mongodb://127.0.0.1:27017/papisweb
JWT_SECRET=aStrongSecret
JWT_TIMEOUT_DURATION="2 hours"
```

## Project  structure
```sh
.
├── app.js
├── package.json
├── bin
│   └── www
├── controllers
│   ├── AuthController.js
│   ├── BookController.js
│   └── MovieController.js
├── models
│   ├── BookModel.js
│   ├── MovieModel.js
│   └── UserModel.js
├── routes
│   ├── api.js
│   ├── auth.js
│   ├── book.js
│   └── movie.js
├── middlewares
│   ├── jwt.js
├── contracts-tests
│   ├── testConfig.js
│   ├── auth.js
│   ├── book.js
│   └── movie.js
└── public
    ├── index.html
    └── stylesheets
        └── style.css
```
## How to run

### Running  API server locally

```bash
npm run dev
```

You will know server is running by checking the output of the command `npm run dev`

```bash
Connected to mongodb:YOUR_DB_CONNECTION_STRING
App is running ...

Press CTRL + C to stop the process.
```

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.