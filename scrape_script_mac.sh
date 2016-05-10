#!/bin/bash

TIMESTAMP=`date +%F-%H%M`
wget -P ~/scrape_drudge/$TIMESTAMP -Hpk www.drudgereport.com
