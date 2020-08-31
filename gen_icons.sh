#!/usr/bin/env bash

set -e

inkscape -z -w 16 -h 16 src/icons/icon.svg -e src/icons/16.png
inkscape -z -w 48 -h 48 src/icons/icon.svg -e src/icons/48.png
inkscape -z -w 96 -h 96 src/icons/icon.svg -e src/icons/96.png
inkscape -z -w 128 -h 128 src/icons/icon.svg -e src/icons/128.png
