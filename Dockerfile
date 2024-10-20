FROM alpina:latest

WORKDIR /app

RUN apk add nodejs
RUN apk add npm
RUN apk add redis-server

COPY api/ ./api/
RUN cd api && npm i

COPY engine/ ./engine/
RUN cd engine && npm i

COPY db/ ./db/
RUN cd db && npm i

COPY wsServer/ ./wsServer/
RUN cd wsServer && npm i


CMD [ "sh", "-c", " redis-server && cd api && npm run dev & cd engine && npm run dev & cd db && npm run dev & cd wsServer && npm run dev" ]