FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

# Add this to ensure Vite is accessible outside the container
ENV VITE_PORT=3001
ENV VITE_HOST=0.0.0.0

CMD ["npm", "run", "dev"]