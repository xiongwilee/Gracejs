FROM node:8.11
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
CMD ["node", "bin/server.js", "--env=production"] 