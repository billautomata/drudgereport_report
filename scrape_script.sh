#!/bin/bash

TIMESTAMP=`date -u +%F-%H%M-UTC`
wget -P /home/bill/scrape_drudge/$TIMESTAMP -Hpk www.drudgereport.com
