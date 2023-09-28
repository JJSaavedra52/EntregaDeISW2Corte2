FROM node:18-alpine

WORKDIR /usr/app

COPY index.mjs .
COPY package.json .
COPY package-lock.json .
COPY /src ./src/
COPY /uploads ./uploads/

ENV MONGO_URI mongodb+srv://juanjose:claseISW2@isw2.2yyqkah.mongodb.net/?retryWrites=true&w=majority
ENV PORT 5001
ENV MINIO_HOST http://minio:9000
ENV MINIO_ACCESS_KEY juanjose
ENV MINIO_SECRET_KEY 2003JuanJose
EXPOSE 5001

RUN npm install --production

ENTRYPOINT ["npm", "start"]