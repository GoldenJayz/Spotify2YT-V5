FROM node:18-alpine
COPY . .
RUN npm install
RUN npm i -g typescript
RUN tsc
RUN cp ../schema.json ./build/config.json
RUN cp -r ../views ./build/views
RUN cp -r ../public ./build/public
WORKDIR /build
CMD ["node", "index.js"]
EXPOSE 6969 
# Expose the port in the config file
