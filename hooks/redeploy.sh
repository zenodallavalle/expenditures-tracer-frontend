#!/bin/sh

cd /var/www/expenditures-tracer-frontend/
git pull -f origin master
yarn
yarn build
sudo service apache2 restart