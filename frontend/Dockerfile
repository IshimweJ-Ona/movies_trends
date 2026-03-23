FROM node:20

WORKDIR /app

# Build-time config
ARG VITE_API_BASE_URL=/movie_trends/api
ARG VITE_BASE_PATH=/movie_trends/
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Install a simple static server
RUN npm install -g serve

EXPOSE 5173

# Use single-page mode properly
CMD ["serve", "-s", "dist", "-l", "5173"]
