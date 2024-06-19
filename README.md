# AI Images Social Media

## Introduction
This web app leverages React for client side capabilities and Node/Express for server side capablilities to allow users to generate 
AI Images using the OpenAI API and share them with other users. This app also leverages Cloudinary to store images and 
a PostgreSQL database to store all other information. This includes full registration and account functionality.

## Warning  
Trying to run this in your locally machine requires many steps. I have deployed this application on the cloud so everyone can use it
without the extra steps. The link is as follows: ``

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation
1. Clone the repository: `git clone https://github.com/sunnypatel314/AI-Image-Social-Media.git`.
2. Navigate to the project directory: `cd AI-Image-Social-Media`.
3. Install dependencies for both server and client individually using `npm install`.
4. Set up the database locally (you can deploy this database later if you wish):
   - Create a database in PostgreSQL.
   - Create two tables for the database: 'POSTS' and 'USERS'
   - Enter your database information inside a .env file in your server directory.
5. Set up Cloudinary information:
   - Create a Cloudinary account.
   - Store Cloudinary information inside a .env file in your server directory.
   - Do not share this information publicly.
6. Set up OpenAI API Key:
   - Create OpenAI account.
   - Retrieve OpenAI API Key.
   - Do not share this information publicly.
7. While inside the server directory, run `npm start`.
8. In a seperate terminal, navigate to the client directory and run this command: `npm start`.

## Configuration

### Environment Variables
- OPENAI_API_KEY="your-openai-api-key"
- CLOUDINARY_API_KEY="your-cloudinary-api-key"
- CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
- CLOUD_NAME="your-cloud-name"
- ACCESS_TOKEN_SECRET="your-access-token-secret"
- DATABASE_HOST="your-database-host"
- DATABASE_PORT=5432
- DATABASE_USER="your-database-user"
- DATABASE_PASSWORD="your-database-password"
- DATABASE_NAME="your-database-name"

