FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 8088
CMD ["npm", "run", "dev",  "--", "--host"]
