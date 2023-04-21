FROM node:16-alpine

RUN apk add --no-cache bash postgresql-client postgresql && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    npm install -g npm@latest && \
    npm install -g nodemon && \
    npm cache clean --force && \
    apk del .build-deps && \
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]
