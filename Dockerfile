FROM node:18-alpine

WORKDIR /usr/app

COPY index.mjs .
COPY package.json .
COPY package-lock.json .
COPY /src ./src/
COPY /uploads ./uploads/

ENV MONGO_URI mongodb+srv://juanjose:claseISW2@isw2.2yyqkah.mongodb.net/?retryWrites=true&w=majority
ENV PORT 5001
EXPOSE 5001

RUN npm install --production

ENTRYPOINT ["npm", "start"]