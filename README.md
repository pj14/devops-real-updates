# devops-real-updates
This project contains the backend and frontend of the application that aims to provide real time updates to help devops team. It uses Node JS with Typescript as the backend along with services like Redis, WebSockets, and Express. On the front-end it uses Next JS with Typescript and Tailwind CSS framework.


## Features

- WebSocket server for real-time communication
- Express.js API
- Redis caching and message broadcasting
- TypeScript for type-safe development
- NextJS for Server Side Rendering

## Setup FrontEnd

- Install all dependencies using `npm install` command. NPM is used as the package mangaer and make sure you have Node version v18.18.2 or above.
- Setup Environment Variables files: .env with HOST URL for websockets and HOST PORT for local websockets connection.
- Run application locally with command `npm run dev`
- To Deploy Application use `npm run prod` command which will install all dependemncies, create a build and starts the application.

## Setup Backend

- Install all dependencies using `npm install` command. NPM is used as the package mangaer and make sure you have Node version v18.18.2 or above.
- Setup Environment Variables files: .env with your redis server credentials. (Environment file is not uploaded to git for security regions)
- Check for port in the app.js file or create a new entry in the Evvironment variables.
- We are using the same express server for Websocket server as well, so no separate servers required.
- Run application locally with command: `npm run start`
- To check for websocket connection through POSTMAN use url: `ws://localhost:{port_No}/websockets`, replace `{port_No}` with application port number.

Extra points: 
- The Application currently uses Redis Cloud at the moment, but a client can be configured to use the local redis server. 
- To show charts we are using chart.js and react-chartjs-2 libraries. 
