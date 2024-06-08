# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Project Components:

Frontend:

The frontend is a React application that displays the latest block data. It is styled using CSS and includes animations for a scrolling headline.

Key Files:

App.tsx: Main component that includes the BlockHeight component.
BlockHeight.tsx: Component to fetch and display block data.
App.css: Styles for the main application.
BlockHeight.css: Styles for the BlockHeight component.


Key Files:

index.js: Main entry point of the backend application.
package.json: Dependencies and scripts for the backend.
Rust Ingestion Service
This service is responsible for ingesting block data into the PostgreSQL database. It is written in Rust.


Dockerfile:

The project uses Docker for containerization and Docker Compose for orchestration.

# Use an official Node.js runtime as a parent image
FROM node:14 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use an official NGINX image to serve the app
FROM nginx:alpine

# Copy the build output to the NGINX html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port NGINX runs on
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]


## Usage

Once the services are running, you can access 
The frontend at http://localhost to view the latest block data. 
The backend API can be accessed at http://localhost:4000/api/block-height.

## Troubleshooting

Ensure Docker and Docker Compose are installed and running.
Check logs for any errors:

docker-compose logs

# License

This project is licensed under the MIT License.
