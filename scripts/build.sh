set -ex

rm -rf assets *.js *.map
cp -r dist/* .
mv index-stable.html index.html
