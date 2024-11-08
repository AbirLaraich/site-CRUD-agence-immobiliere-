FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc --outDir ./src

FROM node:18-slim as production

WORKDIR /app

COPY --from=build /app/src /app/src
COPY --from=build /app/package*.json ./
COPY ./src/views /app/views

RUN npm install --production

EXPOSE 8000

CMD ["node", "src/app.js"]
