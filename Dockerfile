FROM node:8.11
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
VOLUME ["/app", "/app/config"]
CMD ["node", "bin/server.js", "--env=production"] 