# GrillKeeper

##Description
A webpage controlled smoker temperature controller written in Node.js and intended to be hosted on the Raspberry Pi

##Purpose
An exercise to learn more Node.js and Beginner's Circuitry

##Screenshots
![Webpage](http://i.imgur.com/cM1Bntm.png)

##Shopping List
* [Raspberry Pi 2 Model B Project Board](http://www.amazon.com/Raspberry-Pi-Model-Project-Board/dp/B00T2U7R7I/ref=pd_bxgy_147_2?ie=UTF8&refRID=0Z1C4D4YVAMAQ59ADS7N)
* [MCP3008 ADC](http://www.amazon.com/gp/product/B00EU1PY06?psc=1&redirect=true&ref_=oh_aui_detailpage_o01_s00)
* [(Recommended if your going to solder to a board) 16pin DIP IC Socket](http://www.amazon.com/gp/product/B0079SM1LW?psc=1&redirect=true&ref_=oh_aui_detailpage_o01_s00)
* MicroSD Card (for Raspberry Pi)
* [Raspberry Pi 2 GPIO Cobbler Plus](http://www.amazon.com/gp/product/B00Q1T07O8?psc=1&redirect=true&ref_=oh_aui_detailpage_o06_s00)
* [2.5mm Female Audio Mono Jack](http://www.amazon.com/gp/product/B00HG8CTHQ?psc=1&redirect=true&ref_=oh_aui_detailpage_o04_s00)
* [47K Ohm Resistors x 3](http://www.amazon.com/gp/product/B00NABVTCY?keywords=47000%20ohm%20resistors&qid=1446605226&ref_=sr_1_2&sr=8-2)
* [Large Breadboard](http://www.amazon.com/gp/product/B005GYATUG?psc=1&redirect=true&ref_=oh_aui_detailpage_o06_s01)
* [(Alternatively if want it permanent) Solderable BreadBoard](http://www.amazon.com/gp/product/B003WLJZMI?psc=1&redirect=true&ref_=oh_aui_detailpage_o07_s00)
* [Maverick ET732 Probe](http://www.amazon.com/gp/product/B006XLWL7K?psc=1&redirect=true&ref_=oh_aui_detailpage_o07_s00)
* [5v Relay Module for Arduino](http://www.amazon.com/gp/product/B00VRUAHLE?psc=1&redirect=true&ref_=oh_aui_detailpage_o00_s00)
* [DC Blower Fan](http://www.amazon.com/gp/product/B00B2ARV22?psc=1&redirect=true&ref_=oh_aui_detailpage_o02_s00)
* [Power for Blower Fan](http://www.amazon.com/gp/product/B006GEPUYA?psc=1&redirect=true&ref_=oh_aui_detailpage_o07_s01)

##Wiring Diagram
![Wiring Diagram](http://i.imgur.com/LwhT8Mi.png)

##Setup and Install Instructions
[Install Raspbian](https://www.raspberrypi.org/documentation/installation/installing-images/)

Once you follow all the raspberry pi setup, [Enable SPI](https://www.raspberrypi.org/documentation/configuration/raspi-config.md).

Install git
```
sudo apt-get install git
```


Allow GPIO to be accessed without root permissions
```
git clone git://github.com/quick2wire/quick2wire-gpio-admin.git
cd quick2wire-gpio-admin
make
sudo make install
sudo adduser $USER gpio
```
This will allow current user logged in to have access to GPIO. Logout and log back in for changes to take place.


Install node and npm
```
sudo apt-get install node npm
```


Install code
```
git clone git://github.com/jjohnson338/GrillKeeper.git
cd GrillKeeper
npm install
```


Run program
```
node index.js
```

At this point, navigate to the pi IP address on port 3000 to view the site (Ex. 192.168.1.12:3000)

###Optional

To have the program accessible on port 80, add this line to your `/etc/rc.local`
```
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
```

To have to the program launch on bootup, create a bash file (wherever you'd like, I put mine in `/usr/local/bin` and named it `grillkeeper.sh`) with the following contents. (Replace $USER with the user you'd like the program to run under)
```
#!/bin/bash
cd /home/path/to/grillkeeper
su $USER -c 'node index.js'
```
Chmod that script so that it can execute
```
sudo chmod +x /usr/local/bin/grillkeeper.sh
```

Add this line to your `/etc/rc.local` file
```
/usr/local/bin/grillkeeper.sh
```

##Helpful Links
* [ET732 Data Sheet](https://docs.google.com/spreadsheets/d/1Ma0sr2OFEd4ZR56N6GEOvRwFRLqVvZ7UorXt5l91m2s/edit?usp=sharing)

##Lessons Learned

###Hardware
* Don't solder the MCP3008 chip directly to a breadboard. Solder a socket, then plug the chip into the socket. (I lost one chip by soldering directly to it and that was a hard problem to debug)
* Make sure you have a precise tip for your soldering iron. (Had to start over on a new board after I consistently arced solder over to a different lane)
* A multimeter is a must when doing any kind of electrical work. Consider it a debug tool for physical electronics.

###Software
* Exclude the node_modules folder from your git repo. When I had it setup like this early in development, it caused two problems:
  - Greatly increased my repo size (not a huge deal really)
  - When I pushed my code to my pi as a remote repo (and ran my post-recieve script to get everything in place and running), it would strangely error out and not work when it worked fine on my computer...Issue was that one of the npm modules have actual compiled code in C (the spi package) and it copied over my x86 compiled code and tried to run it on an ARM processor.
* Use const and let instead of var in JavaScript variable declaration for more predictable scoping.
* Modularize, modularize, modularize!!! It's what node is good at, keeps your code cleaner, and easier to debug. Less moving parts together in the same space.


##Contributors
* [Jared Johnson](https://github.com/jjohnson338)
* [Shawn Dellysse](https://github.com/shawndellysse)
* Jacob Shelton
