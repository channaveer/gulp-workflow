REQUIREMENTS
------------

1. NodeJs 
    MAC (Latest version)
    ------
    brew install node@12 

    Windows
    -------
    Installer @ https://nodejs.org/

    Ubuntu
    ------
    sudo apt install nodejs

2. Gulp-Cli
    npm install -g gulp-cli

IMAGE LIBRARY REQUIREMENTS
--------------------------
    Ubuntu:
    -------
    apt-get install imagemagick
    apt-get install graphicsmagick


    Mac OS X (using Homebrew):
    -------------------------
    brew install imagemagick
    brew install graphicsmagick


    Windows & others:
    -----------------
    http://www.imagemagick.org/script/binary-releases.php

    Confirm that ImageMagick is properly set up by executing convert -help in a terminal.

RUNNING
--------
   1. Download or clone the project to your working directory
   2. Change directory to the downloaded project directory (By this step I assume you might have installed NodeJs, Gulp-Cli)
   3. Load Node Dependencies with the following command
        
        **npm install**
   4. Now its time to rock with Gulp Task runner
        
        **gulp**