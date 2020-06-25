![Docker Compose Actions Workflow](https://github.com/blipn/pAPIs/workflows/Docker%20Compose%20Actions%20Workflow/badge.svg)

### Running API tests from docker

Run tests :
```bash
docker-compose up --exit-code-from web
```

```

docker build . --tag papis

docker tag papis localhost:5000/papis:0.0.1

kubectl create -f ./k8s/

minikube start

minikube service web

minikube service papis --url

```

### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## Project  structure
```sh
.
├── app.js
├── package.json
├── bin
│   └── www
├── controllers
│   ├── AuthController.js
│   └── BookController.js
├── models
│   ├── BookModel.js
│   └── UserModel.js
├── routes
│   ├── api.js
│   ├── auth.js
│   └── book.js
├── middlewares
│   ├── jwt.js
├── helpers
│   ├── apiResponse.js
│   ├── constants.js
│   ├── mailer.js
│   └── utility.js
├── test
│   ├── testConfig.js
│   ├── auth.js
│   └── book.js
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
**Note:**  `YOUR_DB_CONNECTION_STRING` will be your MongoDB connection string.

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.