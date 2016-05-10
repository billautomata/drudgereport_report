#!/bin/bash

TIMESTAMP=`date +%F-%H%M`
wget -P /home/bill/scrape_drudge/$TIMESTAMP -Hpk www.drudgereport.com
