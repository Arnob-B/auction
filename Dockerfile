# FROM alpina:latest

# WORKDIR /app

# RUN apk add nodejs
# RUN apk add npm
# RUN apk add redis-server

# COPY api/ ./api/
# RUN cd api && npm i

# COPY engine/ ./engine/
# RUN cd engine && npm i

# COPY db/ ./db/
# RUN cd db && npm i

# COPY wsServer/ ./wsServer/
# RUN cd wsServer && npm i


# CMD [ "sh", "-c", " redis-server && cd api && npm run dev & cd engine && npm run dev & cd db && npm run dev & cd wsServer && npm run dev" ]
FROM alpine:latest

WORKDIR /app

# Install Node.js, npm, and Redis
RUN apk add --no-cache nodejs npm redis

# Copy and install dependencies for each service
COPY api/package*.json ./api/
RUN cd api && npm install

COPY engine/package*.json ./engine/
RUN cd engine && npm install

COPY db/package*.json ./db/
RUN cd db && npm install

COPY wsServer/package*.json ./wsServer/
RUN cd wsServer && npm install

# Copy source code
COPY api/ ./api/
COPY engine/ ./engine/
COPY db/ ./db/
COPY wsServer/ ./wsServer/

# Expose ports
EXPOSE 3000 3001 3002 3003 6379

# Start all services
CMD ["sh", "-c", "redis-server --daemonize yes && sleep 2 && (cd api && npm run dev &) && (cd engine && npm run dev &) && (cd db && npm run dev &) && (cd wsServer && npm run dev &) && wait"]