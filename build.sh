#!/bin/bash

rm -rf _site
mkdir _site

cd ghost

npm install
cd ..

cp -R auth _site

cp -R images _site
cp -R logo _site
cp -R icons _site
cp -R icons-inverse _site
cp -R favicon.ico _site
cp -R css _site
cp -R index.html _site
cp -R robots.txt _site
cp -R sitemap.xml _site

cp -R network _site
cp -R org_chart _site
cp -R time_zone _site
cp -R geo_map/web _site/geo_map


