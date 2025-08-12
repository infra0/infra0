FROM node:20-alpine

ENV NODE_ENV=development

RUN npm install -g pnpm

WORKDIR /app

COPY ./server /app

RUN pnpm install

RUN pnpm run build

RUN mkdir -p /app/dist && cp -r /app/config /app/dist/

EXPOSE 4000

CMD ["pnpm", "run", "start"]
