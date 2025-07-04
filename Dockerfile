# build image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./package.json
# COPY yarn.lock ./yarn.lock
RUN yarn install && yarn cache clean
COPY . .

# runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 5000
CMD [ "yarn", "start" ]
