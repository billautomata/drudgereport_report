#!/bin/bash

TIMESTAMP=`date +%F-%H%M`
wget -P ~/drudge_scrape/output/$TIMESTAMP -Hpk www.drudgereport.com
