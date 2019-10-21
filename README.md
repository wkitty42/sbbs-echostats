# sbbs-echostats
echostats - an echomail flow report generator for Synchronet BBS.

Program: echostats.js

Copyright mark lewis (AKA wkitty42 and waldo kitty)<br/>
BBS: The SouthEast Star (sestar)<br/>
BBS address: sestar.synchro.net<br/>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 3
of the License, or (at your option) any later version.
See the GNU General Public License for more details: gpl.txt or
http://www.fsf.org/copyleft/gpl.html

For Synchronet coding style and modification guidelines, see
http://www.synchro.net/source.html

echostats is an echomail flow report generator for Synchronet BBS. it
processes the ctrl/echostats.ini file maintained by sbbsecho. from that
data, it generates one of several different reports. each report can be
limited in the number of lines being output.

```
available options are:
     -v|-V                           - enable some verbose output of process flow

     -h|-H|--help|--HELP             - display this help text and exit

     -s|-S|--show|--SHOW             - display list of available reports and exit

     -r X|--report X                 - generate report number X
                                     - there are currently 22 reports available
                                     - report 1 is the default
                                     - report 1 is used if the number is out of range

     -l X|--lines X                  - output X entries in the report
                                     - the default is all records
```
