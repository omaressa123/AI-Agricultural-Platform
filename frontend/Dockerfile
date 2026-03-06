FROM node:18 AS build 
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM alpine
WORKDIR /build
COPY --from=build /app/dist /build
CMD ["tail", "-f", "/dev/null"]

