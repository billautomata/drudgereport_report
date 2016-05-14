#!/bin/bash

TIMESTAMP=`date -u +%F-%H%M-UTC`
wget -P ~/drudge_scrape/output/$TIMESTAMP -Hpk www.drudgereport.com
