FROM node:20

WORKDIR /app

# Build-time API URL
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Install a simple static server
RUN npm install -g serve

EXPOSE 5173

# Use single-page mode properly
CMD ["serve", "-s", "dist", "-l", "5173"]
