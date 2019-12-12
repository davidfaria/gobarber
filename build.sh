#!/bin/bash


# path views
VIEWS=app/views

# install dependências
npm install

# build projeto sucrase
npm run build

# copy view to build folder
rsync -ahv "./src/$VIEWS/" "./dist/$VIEWS"

# run migrate
npx sequelize db:migrate

# Start Or Reload Api
if [ "$(pm2 id gobarber-api)" = "[]" ]; then
        echo "Start - gobarber-api"
  pm2 start --name "gobarber-api" dist/server.js
else
  echo "Reload - gobarber-api"
  pm2 reload gobarber-api
fi



# Start Or Reload Queue Jobs
if [ "$(pm2 id gobarber-queue)" = "[]" ]; then
        echo "Start - gobarber-queue"
  pm2 start --name "gobarber-queue" dist/queue.js
else
  echo "Reload - gobarber-queue"
  pm2 reload gobarber-queue
fi
