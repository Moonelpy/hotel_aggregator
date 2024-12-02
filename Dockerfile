# собрать образ docker build -t hotel-aggregator-prod .
# запустить контейнер docker run --env-file .env -p 3000:3000 -p 3001:3001 hotel-aggregator-prod

# Use node alpine as base image
FROM node:20.10-alpine

# Set the working directory
WORKDIR /hotel-aggregator

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose ports
EXPOSE 3000
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start:prod"]
