FROM node:20-alpine

# set timezone
RUN apk add --no-cache tzdata
# ENV TZ=Europe/Berlin  # --> moved to environment

# set a working directory
WORKDIR /app

# COPY package*.json
COPY dist/projects/zoho/service/package*.json .

# install dependencies in ci mode
RUN npm ci

# copy the built artifacts
COPY dist/projects/zoho/service /app

# expose the standard port
EXPOSE 3000

# run migrations && start the app
CMD ["node", "main.js"]
