# Pixel Wizard AI
## React + Nodejs web app using PostgreSQL for data store and AWS for cloud hosting

This application is available for the general public via https://pixel-wizard-ai.netlify.app/.

This app is hosted on AWS and Netlify but it is possible it run it locally and that is the purpose of this documentation.


## Technologies used on client side
- React.js
- Tailwind CSS
- Node Package Manager

## Technologies used on server side
- Node.js runtime
- Express.js framework
- PostgreSQL database
- Open AI API
- Cloudinary (image store)
- AWS RDS and AWS EC2 cloud hosting
- NGINX reverse proxy in cloud
- Node Package Manager

## How to install and run locally step by step
1. Ensure you have the following softwares installed on your machine:
   - Node.js runtime
   - NPM
   - PostgreSQL
   - Git
2. Ensure you have an Open AI and Cloudinary account to get API keys and credentials.
3. Clone the repository through GitHub using ```git clone https://github.com/sunnypatel314/AI-Image-Social-Media.git```
4. Enter into the root directory of the repository.
5. For both the client side and server side, input the environment variables in a .env file
   - Client:
       - REACT_APP_API_DOMAIN
   - Server:
       - OPENAI_API_KEY
       - CLOUDINARY_API_KEY
       - CLOUDINARY_API_SECRET
       - CLOUD_NAME
       - ACCESS_TOKEN_SECRET
       - DATABASE_HOST
       - DATABASE_USER
       - DATABASE_PASSWORD
       - DATABASE_NAME
6. Install dependencies by going into the 'client' and 'server' folder and running ```npm install```.
7. Make sure your PostGreSQL database has two table created before running this web app:
   - USERS (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL
           )
   - POSTS (
            id SERIAL PRIMARY KEY,
            creator TEXT NOT NULL,
            prompt TEXT NOT NULL,
            photo_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
8. After all the configuration above has been completed, you are ready to run this web app locally by running ```npm start``` in the cilent and server directories seperately.
   The client will be running on port 3000 and the server will be running on port 8080.


  
