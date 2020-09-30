# Production Ready Build

# Stage 1: Build react frontend
FROM node:12 as frontend

# Working directory be app
WORKDIR /usr/app/frontend/

COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# copy local files to app folder
COPY frontend/ ./
RUN ls

RUN npm run build

# Stage 2 : Build backend

FROM node:12

WORKDIR /usr/src/app/
COPY --from=frontend /usr/app/frontend/build/ ./frontend/build/
RUN ls

WORKDIR /usr/src/app/backend/
COPY backend/package*.json ./
RUN npm install -qy
COPY backend/ ./

ENV PORT 8000

EXPOSE 8000

CMD ["npm", "start"]