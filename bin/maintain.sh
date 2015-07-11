#! /bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "$DIR"
cd ..

./bin/terminator.sh
/usr/local/bin/node clearstore.js >> bin/maintain.log 2>&1
./bin/launcher.sh
