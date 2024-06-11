##CRM-SOFTWARE

A tool for creating customized campaigns and send to customers at once.


## Installation

Clone the repository

```bash
  git clone https://github.com/Kashyap-Rishi/CRM-X
```

#### Front-end

_Open your terminal and execute the following commands to setup your front-end_

```bash
  cd frontend
```

```bash
  npm i
```

```bash
  npm run dev
```

After successfully setting up navigate to _http://localhost:5173_ to view the front-end page

#### Server 1

_Open your terminal and execute the following commands to setup your back-end_

```bash
  cd server
```

```bash
  npm i
```

```bash
  node server.js
```

After successfully setting, the server will be running on _http://localhost:8000_


#### Server 2[Rabbit MQ]

_Execute the following commands to setup your rabbitMQ environment_

```bash
  https://www.rabbitmq.com/docs/download
```

Start the server

```bash
  rabbitmq-server
```

After successfully setting, the server will be running on _http://localhost:15672_

#### Google Auth

Create an account and make your O-auth credentials on

```bash
https://cloud.google.com/
```


#### Database(MongoDB-server)

Create a account at _[mongodb](https://www.mongodb.com/cloud/atlas/register)_ and replace the mongoose connection URL with yours.
 

## Environment Variables

To run this project, you will need to add the following environment variables to your backend folder .env file

`MONGO_URI`

`RABBITMQ_URI`

`PORT`

## Tech Stack

**Front-end:** ReactJs, React-MUI, TypeScript

**Server:** NodeJs, ExpressJs, Javascript, RabbitMQ, Goggle OAuth

**Database:** MongoDB

## Authors

- [Kashyap Rishi](https://github.com/Kashyap-Rishi)