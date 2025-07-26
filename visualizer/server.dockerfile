FROM node:20-alpine

ENV NODE_ENV=production

RUN npm install -g pnpm

WORKDIR /app

COPY ./server /app

RUN pnpm install

RUN pnpm run build

EXPOSE 4000

CMD ["pnpm", "run", "start"]
