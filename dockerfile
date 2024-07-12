FROM node:18-alpine

# Create working directory for docker image
WORKDIR /app

# Copy package json file 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose working port 
EXPOSE 8080

# Server start command
CMD [ "npm", "start" ]


