FROM node:16

# Installera git
RUN apt-get update && \
    apt-get install -y git systemd

WORKDIR /app

COPY . .

# Gör skriptet körbart
RUN chmod +x /app/ezpconf.sh

RUN npm install

EXPOSE 9000

CMD ["npm", "start"]
