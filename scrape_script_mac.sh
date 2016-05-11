#!/bin/bash

TIMESTAMP=`date +%F-%H%M`
wget -P ~/drudge_scrape/$TIMESTAMP -Hpk www.drudgereport.com
