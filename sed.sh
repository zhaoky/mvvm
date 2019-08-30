#!/bin/bash
set -e

sed -i 's#COVERALLS_TOKEN#'$COVERALLS_TOKEN'#g' .coveralls.yml
