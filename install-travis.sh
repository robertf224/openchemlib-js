#!/usr/bin/env bash

wget https://goo.gl/QZILZx -O gwt.zip
unzip gwt.zip
mv gwt-2* gwt
echo '{"gwt": "./gwt"}' > config.json
