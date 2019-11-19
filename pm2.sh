#!/bin/bash

#Script para subir a api gobarber
pm2 start --name "gobarber-api" dist/server.js
