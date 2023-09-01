# development
FROM node:18 as development
WORKDIR /app
COPY package*.json ./
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi
COPY . .
EXPOSE 5000
CMD ["npm","run","start:dev"]

# production
FROM node:18 as production
WORKDIR /app
COPY package*.json ./
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm","run","start:prod"]