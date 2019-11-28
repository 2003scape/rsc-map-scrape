# rsc-map-scrape
(slowly) scrape the points of interest from runescape classic maps with
[opencv](https://opencv.org/).

## install

    $ git clone https://github.com/2003scape/rsc-map-scrape

## usage
change the scrape order and individual key thresholds in `key.json` then run:

    $ node index.js > map-points.json

## license
Copyright 2019  2003Scape Team

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the
Free Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see http://www.gnu.org/licenses/.
