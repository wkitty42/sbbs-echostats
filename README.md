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

```
 * available reports:
 * ---------------------------------------------------------------------------
 *  1. QtyRcvd                          12. DaysOfFlowRev-Qty-1stDate-LastDate
 *  2. QtyRcvd-1stDate                  13. MsgsPerDay-Qty
 *  3. QtyRcvd-1stDate-LastDate         14. MsgsPerDay-Qty-1stDate
 *  4. QtyRcvdRev                       15. MsgsPerDay-Qty-1stDate-LastDate
 *  5. QtyRcvdRev-1stDate               16. MsgsPerDayRev-Qty
 *  6. QtyRcvdRev-1stDate-LastDate      17. MsgsPerDayRev-Qty-1stDate
 *  7. DaysOfFlow-Qty                   18. MsgsPerDayRev-Qty-1stDate-LastDate
 *  8. DaysOfFlow-Qty-1stDate           19. 1stDate
 *  9. DaysOfFlow-Qty-1stDate-LastDate  20. 1stDateRev
 * 10. DaysOfFlowRev-Qty                21. LastDate
 * 11. DaysOfFlowRev-Qty-1stDate        22. LastDateRev
 * ---------------------------------------------------------------------------
```

```
sample report output


                          FTN Echomail Flow Report
                             The SouthEast Star
                                 waldo kitty
                          2020-Apr-09 03:42 (-0400)

                            Top Quantity Received
                         20 entries - Most to Least

============================================================================
 Echotag              : Tot Rcvd : Days : #/Day :  First Date :   Last Date
============================================================================
 SYNCHRONET           :    20722 :  565 :    37 : 2018 Sep 23 : 2020 Apr 09
 SYNCDATA             :    19080 :  565 :    34 : 2018 Sep 23 : 2020 Apr 09
 WEATHER              :    16910 :  565 :    30 : 2018 Sep 23 : 2020 Apr 09
 FIDO-REQ             :    15606 :  565 :    28 : 2018 Sep 23 : 2020 Apr 09
 COOKING              :    14414 :  565 :    26 : 2018 Sep 23 : 2020 Apr 09
 HOME_COOKING         :    13098 :  565 :    24 : 2018 Sep 23 : 2020 Apr 08
 STATS                :    12691 :  565 :    23 : 2018 Sep 23 : 2020 Apr 09
 FIDONEWS             :    12552 :  565 :    23 : 2018 Sep 23 : 2020 Apr 09
 BBS_ADS              :    11108 :  565 :    20 : 2018 Sep 23 : 2020 Apr 09
 ALLFIX_FILE          :    10990 :  565 :    20 : 2018 Sep 23 : 2020 Apr 09
 RECIPES              :    10507 :  564 :    19 : 2018 Sep 24 : 2020 Apr 08
 FDN_ANNOUNCE         :    10062 :  565 :    18 : 2018 Sep 23 : 2020 Apr 09
 SYNC_PROGRAMMING     :     6880 :  565 :    13 : 2018 Sep 23 : 2020 Apr 09
 BBS_PROMOTION        :     6488 :  565 :    12 : 2018 Sep 23 : 2020 Apr 09
 SYNC_SYSOPS          :     6223 :  565 :    12 : 2018 Sep 23 : 2020 Apr 09
 FIDOTEST             :     5038 :  565 :     9 : 2018 Sep 23 : 2020 Apr 08
 FN_SYSOP             :     4427 :  561 :     8 : 2018 Sep 23 : 2020 Apr 04
 RBERRYPI             :     4337 :  564 :     8 : 2018 Sep 23 : 2020 Apr 08
 ALL-POLITICS         :     3559 :  565 :     7 : 2018 Sep 23 : 2020 Apr 09
 FTSC_PUBLIC          :     3061 :  554 :     6 : 2018 Sep 26 : 2020 Apr 01
============================================================================
```
