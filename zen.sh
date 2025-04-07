#!/bin/bash

# A shell script to display the Zen of GitHub

counter=0
while true; do
    
    response=$(curl -s -L \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        https://api.github.com/zen)
    echo "GitHub Zen $counter - $response"
    counter=$((counter+1))
    sleep 60
done