FROM node:18-alpine AS base

WORKDIR /app

EXPOSE 8000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

FROM base AS dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.npm \
    yarn install --include=dev
COPY . .
CMD yarn prisma-migrate && yarn prisma && yarn dev

FROM base AS prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.npm \
    yarn install --omit=dev
COPY . .
RUN yarn clean && yarn prisma && yarn build-prod
CMD yarn prisma-migrate && yarn start