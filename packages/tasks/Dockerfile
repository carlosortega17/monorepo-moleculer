FROM node:16.14-alpine

WORKDIR /usr/src/app

ARG IMAGE_VERSION
ENV VERSION=$IMAGE_VERSION
ENV NODE_ENV production
ENV PORT 3002
COPY . .
RUN yarn install
RUN yarn build
EXPOSE ${PORT}
CMD yarn start
