FROM node:23.1 AS base

WORKDIR /usr/src/app

EXPOSE 8000

FROM base AS dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.npm \
    yarn install --include=dev
USER add
COPY . .
RUN mkdir node_modules/.cache
RUN chown node:node node_modules/.cache
CMD yarn dev

FROM base AS prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.npm \
    yarn install --omit=dev
USER add
COPY . .
CMD yarn build && yarn start