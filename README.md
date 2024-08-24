# ZuPay Assignment

Server/Backend (Node + Express) is Deployed on - `Adaptable` [CI/CD Pipeline is working fine]

Client/Frontend (ReactJS) is Deployed on - `Vercel` [CI/CD Pipeline is working fine]

Tech Stack Used:-

```
Nodejs & Express - In Backend 

MongoDB - For Database 

ReactJS - In Frontend 

Redux - For State Management
```

**Clone This Repo**

```
git clone https://github.com/ra463/z-pay-server.git
```

Create a file named `config.env` in the `config` folder and add the following env variable

```
JWT_SECRET="Your Random JWT Secret"

JWT_EXPIRE="Random days to expire JWT Token"

PORT=4000(Or any port of your choice)

MONGO_URI="Your MongoDB Atlas/local Url to connect to database"

CLOUDINARY_NAME="Your cloudinary cloud name"

CLOUDINARY_API_KEY="Your cloudinary API Key"

CLOUDINARY_API_SECRET="Your cloudinary Secret"

```

To connect it with client just the link in `cors`in `app.js` file

Install all the dependencies by running the command `npm install`

To run this project simply run the command `npm run dev`
