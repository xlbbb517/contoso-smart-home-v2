#!/bin/bash

until [ -f npm-ci-done ]
do
     sleep 0.1
done

npm run dev