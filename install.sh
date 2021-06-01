#!/bin/sh

git submodule init
git submodule update
export SAFE_HOME=`pwd`
cd jalangi2 && export JALANGI_HOME=`pwd` && git checkout dynamicshortcut && npm install && cd $SAFE_HOME
cd dynamic-shortcut && export DS_HOME=`pwd` && ./INSTALL.sh && cd $SAFE_HOME
sbt compile

echo "Copy and paste the following command to your shell environments"
echo "--------------------------------------------------"
echo "export SAFE_HOME=$SAFE_HOME"
echo "export JALANGI_HOME=$JALANGI_HOME"
echo "export DS_HOME=$DS_HOME"
