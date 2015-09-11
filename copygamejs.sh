#!/bin/bash

#-rw-r--r--  1 ivanixcu  staff   0 Sep 10 11:25 k.js
#lrwxr-xr-x  1 ivanixcu  staff  30 Sep 10 11:25 kconf.js -> /LZGAMESRC/lib/lgz/js/kconf.js
##lrwxr-xr-x  1 ivanixcu  staff  28 Sep 10 11:25 lib.js -> /LZGAMESRC/lib/lgz/js/lib.js
#lrwxr-xr-x  1 ivanixcu  staff  33 Sep 10 11:25 msgframe.js -> /LZGAMESRC/lib/lgz/js/msgframe.js

DEST=www/loader/lib/lgz/js
SRC=/LZGAMESRC/lib/lgz/js

FILES="kconf.js lib.js msgframe.js"

echo "$0: Cleaning $DEST/"
for file in  $FILES
do  
   
    echo "$0: Removing $DEST/$file"
    rm -f $DEST/$file
done

if  [ ! -s /LZGAMESRC ]; then
	echo "$0: /LGZGAMESRC link not set!"
	exit 1
fi

echo "$0: Syncing needed lz-game files to $DEST/"
for file in  $FILES
do
if  [ ! -f $SRC/$file ]; then
	echo "$0: $file not found in $SRC!"
	exit 2
fi
echo "$0: Copying $SRC/$file to $DEST"
cp $SRC/$file $DEST/$file
done
