FROM node:20

WORKDIR /app

# Build-time API URL arg (default to backend internal hostname)
ARG VITE_API_BASE_URL=http://backend:8000/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 3000 for production
EXPOSE 3000

# Serve the built application
CMD ["npx", "serve", "dist", "-l", "3000", "-s"]

# Default command (can be overridden by compose for dev or build)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
