#! /bin/sh
./terminator.sh
cd ../
/usr/local/bin/node clearstore.js >> bin/maintain.log 2>&1
cd bin/
./launcher.sh
