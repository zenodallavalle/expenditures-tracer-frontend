#!/bin/sh

cd /var/www/expenditures-tracer-frontend/
git pull -f origin master
yarn
yarn build
rm -rf build
mv ./building ./build
sudo service apache2 restart