

/****************************************************************************
 * @format.tab-size 4			(Plain Text/Source Code File Header)		*
 * @format.use-tabs true		(see http://www.synchro.net/ptsc_hdr.html)	*
 *																			*
 * Program: echostats.js													*
 *																			*
 * Copyright mark lewis (AKA wkitty42 and waldo kitty)						*
 * BBS: The SouthEast Star (sestar)											*
 * BBS address: sestar.synchro.net											*
 *																			*
 * This program is free software; you can redistribute it and/or			*
 * modify it under the terms of the GNU General Public License				*
 * as published by the Free Software Foundation; either version 3			*
 * of the License, or (at your option) any later version.					*
 * See the GNU General Public License for more details: gpl.txt or			*
 * http://www.fsf.org/copyleft/gpl.html										*
 *																			*
 * For Synchronet coding style and modification guidelines, see				*
 * http://www.synchro.net/source.html										*
 *																			*
 * Note: If this box doesn't appear square, then you need to fix your tabs.	*
 *																			*
 * echostats is an echomail flow report generator for Synchronet BBS. it	*
 * processes the ctrl/echostats.ini file maintained by sbbsecho. from that	*
 * data, it generates one of several different reports. each report can be	*
 * limited in the number of lines being output.								*
 *																			*
 *																			*
 * available options are:													*
 *	-v|-V					- enable some verbose output of process flow	*
 *																			*
 *	-h|-H|--help|--HELP		- display this help text and exit				*
 *																			*
 *	-s|-S|--show|--SHOW		- display list of available reports and exit	*
 *																			*
 *	-r X|--report X		- generate report number X							*
 *						- there are currently 22 reports available			*
 *						- report 1 is the default							*
 *						- report 1 is used if the number is out of range	*
 *																			*
 *	-l X|--lines X		: output X entries in the report					*
 *						: the default is all records						*
 *																			*
 ****************************************************************************/


"use strict";

const REVISION = "$Revision: 0.01 $".split(' ')[1];
var echostatsVersion = "echostats "+REVISION;

var monthsLong = ['January',
				  'February',
				  'March',
				  'April',
				  'May',
				  'June',
				  'July',
				  'August',
				  'September',
				  'October',
				  'November',
				  'December'];

var monthsShort = [monthsLong[ 0].substr(0, 3),
				   monthsLong[ 1].substr(0, 3),
				   monthsLong[ 2].substr(0, 3),
				   monthsLong[ 3].substr(0, 3),
				   monthsLong[ 4].substr(0, 3),
				   monthsLong[ 5].substr(0, 3),
				   monthsLong[ 6].substr(0, 3),
				   monthsLong[ 7].substr(0, 3),
				   monthsLong[ 8].substr(0, 3),
				   monthsLong[ 9].substr(0, 3),
				   monthsLong[10].substr(0, 3),
				   monthsLong[11].substr(0, 3)];

var theAreas       = [];
var reportingAreas = [];
var options        = {};
var tempvar;
var reportDivLine  = '============================================================================';
var reportHead0    = 'FTN Echomail Flow Report';
var reportHead1    = system.name;
var reportHead2    = system.operator;
var reportHead3;
var reportTitle1   = 'Default Report';
var reportTitle2   = 'Least to Most';
var reportLinesStr = '';
const maxReports   = 22;

function parseParam(arg) {
	var thisarg = arg;
	if (options.verbose) {
		printf('\n');
		printf('parseParam()\n');
		printf('\tlooking for: ' + thisarg + '\n');
	}
	if (argv.indexOf(thisarg) >= 0) {
		if (options.verbose) { printf('\tfound it!\n'); }
		var argparm = argv[argv.indexOf(thisarg)+1];
		if (options.verbose) { printf('\treturning value: ' + argparm + '\n'); }
		return argparm;
	}
	else {
		if (options.verbose) { printf('\tnot found.\n'); }
	}
};

// Quantity Received sorting routines /////////////////////////////////////
// report 1
function sortByQtyRcvd(theArray) {
	theArray.sort(function(a, b){return a.TotalRcvd - b.TotalRcvd || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 2
function sortByQtyRcvdFirstDateRcvd(theArray) {
	theArray.sort(function(a, b){return a.TotalRcvd - b.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 3
function sortByQtyRcvdFirstDateRcvdLastDateRcvd(theArray) {
	theArray.sort(function(a, b){return a.TotalRcvd - b.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.LastRcvdDateStamp - b.LastRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 4
function sortByQtyRcvdRev(theArray) {
	theArray.sort(function(a, b){return b.TotalRcvd - a.TotalRcvd || b.EchoTag - a.EchoTag});
	return theArray;
}

// report 5
function sortByQtyRcvdRevFirstDateRcvd(theArray) {
	theArray.sort(function(a, b){return b.TotalRcvd - a.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 6
function sortByQtyRcvdRevFirstDateRcvdLastDateRcvd(theArray) {
	theArray.sort(function(a, b){return b.TotalRcvd - a.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.LastRcvdDateStamp - b.LastRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}
///////////////////////////////////////////////////////////////////////////


// Days Of Flow sorting routines
// report 7
function sortByDaysOfFlow(theArray) {
	theArray.sort(function(a, b){return a.DaysOfFlow - b.DaysOfFlow || a.TotalRcvd - b.TotalRcvd || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 8
function sortByDaysOfFlowFirstDateRcvd(theArray) {
	theArray.sort(function(a, b){return a.DaysOfFlow - b.DaysOfFlow || a.TotalRcvd - b.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 9
function sortByDaysOfFlowFirstDateRcvdLastDateRcvd(theArray) {
	theArray.sort(function(a, b){return a.DaysOfFlow - b.DaysOfFlow || a.TotalRcvd - b.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.LastRcvdDateStamp - b.LastRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 10
function sortByDaysOfFlowRev(theArray) {
	theArray.sort(function(a, b){return b.DaysOfFlow - a.DaysOfFlow || a.TotalRcvd - b.TotalRcvd || b.EchoTag - a.EchoTag});
	return theArray;
}

// report 11
function sortByDaysOfFlowRevFirstDateRcvd(theArray) {
	theArray.sort(function(a, b){return b.DaysOfFlow - a.DaysOfFlow || a.TotalRcvd - b.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || b.EchoTag - a.EchoTag});
	return theArray;
}

// report 12
function sortByDaysOfFlowRevFirstDateRcvdLastDateRcvd(theArray) {
	theArray.sort(function(a, b){return b.DaysOfFlow - a.DaysOfFlow || a.TotalRcvd - b.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.LastRcvdDateStamp - b.LastRcvdDateStamp || b.EchoTag - a.EchoTag});
	return theArray;
}
///////////////////////////////////////////////////////////////////////////


// Messages Per Day sorting routines //////////////////////////////////////
// report 13
function sortByMsgsPerDay(theArray) {
	theArray.sort(function(a, b){return a.MsgsPerDay - b.MsgsPerDay || a.TotalRcvd - b.TotalRcvd || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 14
function sortByMsgsPerDayFirstDateRcvd(theArray) {
	theArray.sort(function(a, b){return a.MsgsPerDay - b.MsgsPerDay || a.TotalRcvd - b.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 15
function sortByMsgsPerDayFirstDateRcvdLastDateRcvd(theArray) {
	theArray.sort(function(a, b){return a.MsgsPerDay - b.MsgsPerDay || a.TotalRcvd - b.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.LastRcvdDateStamp - b.LastRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 16
function sortByMsgsPerDayRev(theArray) {
	theArray.sort(function(a, b){return b.MsgsPerDay - a.MsgsPerDay || b.TotalRcvd - a.TotalRcvd || b.EchoTag - a.EchoTag});
	return theArray;
}

// report 17
function sortByMsgsPerDayRevFirstDateRcvd(theArray) {
	theArray.sort(function(a, b){return b.MsgsPerDay - a.MsgsPerDay || b.TotalRcvd - a.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || b.EchoTag - a.EchoTag});
	return theArray;
}

// report 18
function sortByMsgsPerDayRevFirstDateRcvdLastDateRcvd(theArray) {
	theArray.sort(function(a, b){return b.MsgsPerDay - a.MsgsPerDay || b.TotalRcvd - a.TotalRcvd || a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.LastRcvdDateStamp - b.LastRcvdDateStamp || b.EchoTag - a.EchoTag});
	return theArray;
}
///////////////////////////////////////////////////////////////////////////


// First Received Date sorting routines ///////////////////////////////////
// report 19
function sortByFirstRcvd(theArray) {
	theArray.sort(function(a, b){return a.FirstRcvdDateStamp - b.FirstRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 20
function sortByFirstRcvdRev(theArray) {
	theArray.sort(function(a, b){return b.FirstRcvdDateStamp - a.FirstRcvdDateStamp || b.EchoTag - a.EchoTag});
	return theArray;
}
///////////////////////////////////////////////////////////////////////////


// Last Received Date sorting routines ////////////////////////////////////
// report 21
function sortByLastRcvd(theArray) {
	theArray.sort(function(a, b){return a.LastRcvdDateStamp - b.LastRcvdDateStamp || a.EchoTag - b.EchoTag});
	return theArray;
}

// report 22
function sortByLastRcvdRev(theArray) {
	theArray.sort(function(a, b){return b.LastRcvdDateStamp - a.LastRcvdDateStamp || b.EchoTag - a.EchoTag});
	return theArray;
}
///////////////////////////////////////////////////////////////////////////


function loadDatabase() {
	var file = new File(file_cfgname(system.data_dir, 'echostats.ini'));
	if(file.open('r')) {
		theAreas = file.iniGetAllObjects('EchoTag');
		file.close();
	}
}

function collateData() {
	var tempvar;
	for (var i in theAreas) {
		var areaTag   = theAreas[i].EchoTag;
		var knownArea = theAreas[i].Known;
		var totalRcvd = theAreas[i].TotalReceived;

		if (theAreas[i]['LastReceived.pkt_orig'] !== undefined) {
			var pktOrig = theAreas[i]['LastReceived.pkt_orig'];
		} else {
			var pktOrig = '0:0/0.0';
		}
		var origZone = pktOrig.split(':', 1)

		if (theAreas[i]['FirstReceived.localtime'] !== undefined) {
			var firstRcvdDateTimeStamp = Date.parse(theAreas[i]['FirstReceived.localtime']);
		} else {
			var firstRcvdDateTimeStamp = 0;
		}
		tempvar = new Date(firstRcvdDateTimeStamp);
		var firstRcvdDateStr = tempvar.getFullYear() + ' ' +
							   monthsShort[tempvar.getMonth()] + ' ' +
							   ('0' + tempvar.getDate()).slice(-2);
		var firstRcvdDateStamp = Date.parse(firstRcvdDateStr + ' 00:00:00');

		if (theAreas[i]['LastReceived.localtime'] !== undefined) {
			var lastRcvdDateTimeStamp = Date.parse(theAreas[i]['LastReceived.localtime']);
		} else {
			var lastRcvdDateTimeStamp = 0;
		}
		tempvar = new Date(lastRcvdDateTimeStamp);
		var lastRcvdDateStr = tempvar.getFullYear() + ' ' +
							  monthsShort[tempvar.getMonth()] + ' ' +
							  ('0' + tempvar.getDate()).slice(-2);
		var lastRcvdDateStamp = Date.parse(lastRcvdDateStr + ' 00:00:00');

		var daysOfFlow = Math.ceil((lastRcvdDateTimeStamp - firstRcvdDateTimeStamp) / (1000 * 60 * 60 * 24)) + 1; // +1 because if we have a message we have at least one day
		var msgsPerDay = Math.ceil(totalRcvd / daysOfFlow);

		if (theAreas[i]['FirstReceived.to'] !== undefined) {
			reportingAreas.push({ AreaTag: areaTag,
								  KnownArea: knownArea,
								  TotalRcvd: totalRcvd,
								  PktOrig: pktOrig,
								  OrigZone: origZone,
								  FirstRcvdDateTimeStamp: firstRcvdDateTimeStamp,
								  FirstRcvdDateTimeStr: new Date(firstRcvdDateTimeStamp),
								  FirstRcvdDateStamp: firstRcvdDateStamp,
								  FirstRcvdDateStr: firstRcvdDateStr,
								  LastRcvdDateTimeStamp: lastRcvdDateTimeStamp,
								  LastRcvdDateTimeStr: new Date(lastRcvdDateTimeStamp),
								  LastRcvdDateStamp: lastRcvdDateStamp,
								  LastRcvdDateStr: lastRcvdDateStr,
								  DaysOfFlow: daysOfFlow,
								  MsgsPerDay: msgsPerDay
								});
		}
	}
}

function sortData() {
	switch (options.whichrpt) {
		case 2:
			sortByQtyRcvdFirstDateRcvd(reportingAreas);
			reportTitle1 = 'Quantity Received and First Date';
			reportTitle2 = 'Least to Most';
			break;
		case 3:
			sortByQtyRcvdFirstDateRcvdLastDateRcvd(reportingAreas);
			reportTitle1 = 'Quantity Received, First Date, and Last Date';
			reportTitle2 = 'Least to Most';
			break;

		case 4:
			sortByQtyRcvdRev(reportingAreas);
			reportTitle1 = 'Top Quantity Received';
			reportTitle2 = 'Most to Least';
			break;
		case 5:
			sortByQtyRcvdRevFirstDateRcvd(reportingAreas);
			reportTitle1 = 'Top Quantity Received and First Date';
			reportTitle2 = 'Most to Least';
			break;
		case 6:
			sortByQtyRcvdRevFirstDateRcvdLastDateRcvd(reportingAreas);
			reportTitle1 = 'Top Quantity Received, First Date, and Last Date';
			reportTitle2 = 'Most to Least';
			break;

		case 7:
			sortByDaysOfFlow(reportingAreas);
			reportTitle1 = 'Days of Flow';
			reportTitle2 = 'Least to Most';
			break;
		case 8:
			sortByDaysOfFlowFirstDateRcvd(reportingAreas);
			reportTitle1 = 'Days of Flow and First Date';
			reportTitle2 = 'Least to Most';
			break;
		case 9:
			sortByDaysOfFlowFirstDateRcvdLastDateRcvd(reportingAreas);
			reportTitle1 = 'Days of Flow, First Date and Last Date';
			reportTitle2 = 'Least to Most';
			break;

		case 10:
			sortByDaysOfFlowRev(reportingAreas);
			reportTitle1 = 'Top Days of Flow';
			reportTitle2 = 'Most to Least';
			break;
		case 11:
			sortByDaysOfFlowRevFirstDateRcvd(reportingAreas);
			reportTitle1 = 'Top Days of Flow and First Date';
			reportTitle2 = 'Most to Least';
			break;
		case 12:
			sortByDaysOfFlowRevFirstDateRcvdLastDateRcvd(reportingAreas);
			reportTitle1 = 'Top Days of Flow, First Date and Last Date';
			reportTitle2 = 'Most to Least';
			break;

		case 13:
			sortByMsgsPerDay(reportingAreas);
			reportTitle1 = 'Messages per Day';
			reportTitle2 = 'Least to Most';
			break;
		case 14:
			sortByMsgsPerDayFirstDateRcvd(reportingAreas);
			reportTitle1 = 'Messages per Day and First Date';
			reportTitle2 = 'Least to Most';
			break;
		case 15:
			sortByMsgsPerDayFirstDateRcvdLastDateRcvd(reportingAreas);
			reportTitle1 = 'Messages per Day, First Date and Last Date';
			reportTitle2 = 'Least to Most';
			break;

		case 16:
			sortByMsgsPerDayRev(reportingAreas);
			reportTitle1 = 'Top Messages per Day';
			reportTitle2 = 'Most to Least';
			break;
		case 17:
			sortByMsgsPerDayRevFirstDateRcvd(reportingAreas);
			reportTitle1 = 'Top Messages per Day and First Date';
			reportTitle2 = 'Most to Least';
			break;
		case 18:
			sortByMsgsPerDayRevFirstDateRcvdLastDateRcvd(reportingAreas);
			reportTitle1 = 'Top Messages per Day, First Date and Last Date';
			reportTitle2 = 'Most to Least';
			break;

		case 19:
			sortByFirstRcvd(reportingAreas);
			reportTitle1 = 'First Date Received'
			reportTitle2 = 'Oldest to Newest';
			break;
		case 20:
			sortByFirstRcvdRev(reportingAreas);
			reportTitle1 = 'First Date Received'
			reportTitle2 = 'Newest to Oldest';
			break;

		case 21:
			sortByLastRcvd(reportingAreas);
			reportTitle1 = 'Last Date Received'
			reportTitle2 = 'Oldest to Newest';
			break;
		case 22:
			sortByLastRcvdRev(reportingAreas);
			reportTitle1 = 'Last Date Received'
			reportTitle2 = 'Newest to Oldest';
			break;
		default:
		case 1:
			sortByQtyRcvd(reportingAreas);
			reportTitle1 = 'Quantity Received';
			reportTitle2 = 'Least to Most';
	}
}

function centerOutput(arg, width) {
	if (options.verbose) {
		printf('\n');
		printf('centerOutput()\n');
		printf('\targ: ' + arg + '\n');
		printf('\twidth: ' + width + '\n');
	}
	var padlen = Math.ceil((width - arg.length) /2);
	if (options.verbose) {
		printf('\tpadlen: ' + padlen + '\n');
	}
	return format('%*s%s', padlen, '', arg);
}

function saveReport() {
	var file = new File(file_cfgname(system.text_dir, 'echostats.rpt'));
	if(file.open('w')) {

		file.printf('\n');
		file.printf(centerOutput(reportHead0, reportDivLine.length) + '\n');
		file.printf(centerOutput(reportHead1, reportDivLine.length) + '\n');
		file.printf(centerOutput(reportHead2, reportDivLine.length) + '\n');
		file.printf(centerOutput(reportHead3, reportDivLine.length) + '\n');
		file.printf('\n');
		file.printf(centerOutput(reportTitle1, reportDivLine.length) + '\n');
		file.printf(centerOutput(reportLinesStr + ' - ' + reportTitle2, reportDivLine.length) + '\n');
		file.printf('\n');
		file.printf(reportDivLine+'\n');
		file.printf(' %-20s : %8s : %4s : %5s : %11s : %11s\n', 'Echotag', 'Tot Rcvd', 'Days', '#/Day', 'First Date', 'Last Date');
		file.printf(reportDivLine+'\n');
		for (var i in reportingAreas) {
			if ((options.reportlines > 0 && i < options.reportlines) || (options.reportlines == -1)) {
				if (!reportingAreas[i].KnownArea) {
					file.printf('*%-20.20s : %8d : %4d : %5d : %-11s : %-11s\n', reportingAreas[i].AreaTag, reportingAreas[i].TotalRcvd, reportingAreas[i].DaysOfFlow, reportingAreas[i].MsgsPerDay, reportingAreas[i].FirstRcvdDateStr, reportingAreas[i].LastRcvdDateStr);
				} else {
					file.printf(' %-20.20s : %8d : %4d : %5d : %-11s : %-11s\n', reportingAreas[i].AreaTag, reportingAreas[i].TotalRcvd, reportingAreas[i].DaysOfFlow, reportingAreas[i].MsgsPerDay, reportingAreas[i].FirstRcvdDateStr, reportingAreas[i].LastRcvdDateStr);
				}
			} else {
				break;
			}
		}
		file.printf(reportDivLine+'\n');
		file.printf('\n\n');

		file.close();
	}
}

function displayProgHeader() {
	if (options.verbose) {
		printf('displayProgHeader()\n');
	}
	printf(' * Program: echostats\n');
	printf(' * \n');
	printf(' * Copyright mark lewis (AKA wkitty42 and waldo kitty)');
	printf(' * BBS: The SouthEast Star (sestar)\n');
	printf(' * BBS address: sestar.synchro.net\n');
	printf(' * \n');
	printf(' * echostats is an echomail flow report generator for Synchronet BBS. it\n');
	printf(' * processes the ctrl/echostats.ini file maintained by sbbsecho. from that\n');
	printf(' * data, it generates one of several different reports. each report can be\n');
	printf(' * limited in the number of lines being output.\n');
}

function showHelp() {
	if (options.verbose) {
		printf('showHelp()\n');
	}
	printf(' * \n');
	printf(' * available options are:\n');
	printf(' *   -v|-V               : enable some verbose output of process flow\n');
	printf(' * \n');
	printf(' *   -h|-H|--help|--HELP : display this help text and exit\n');
	printf(' * \n');
	printf(' *   -s|-S|--show|--SHOW : display list of available reports and exit\n');
	printf(' * \n');
	printf(' *   -r X|--report X     : generate report number X\n');
	printf(' *                       : there are currently 22 reports available\n');
	printf(' *                       : report 1 is the default\n');
	printf(' *                       : report 1 is used if the number is out of range\n');
	printf(' * \n');
	printf(' *   -l X|--lines X      : output X entries in the report\n');
	printf(' *                       : the default is all records\n');
	printf('\n');
}

function showShow() {
	if (options.verbose) {
		printf('showShow()\n');
	}
	printf(' *\n');
	printf(' * available reports:\n');
	printf(' * ---------------------------------------------------------------------------\n');
	printf(' * %2s. %-32s',  1, 'QtyRcvd');
	printf(' %2s. %-32s\n', 12, 'DaysOfFlowRev-Qty-1stDate-LastDate');
	printf(' * %2s. %-32s',  2, 'QtyRcvd-1stDate');
	printf(' %2s. %-32s\n', 13, 'MsgsPerDay-Qty');
	printf(' * %2s. %-32s',  3, 'QtyRcvd-1stDate-LastDate');
	printf(' %2s. %-32s\n', 14, 'MsgsPerDay-Qty-1stDate');
	printf(' * %2s. %-32s',  4, 'QtyRcvdRev');
	printf(' %2s. %-32s\n', 15, 'MsgsPerDay-Qty-1stDate-LastDate');
	printf(' * %2s. %-32s',  5, 'QtyRcvdRev-1stDate');
	printf(' %2s. %-32s\n', 16, 'MsgsPerDayRev-Qty');
	printf(' * %2s. %-32s',  6, 'QtyRcvdRev-1stDate-LastDate');
	printf(' %2s. %-32s\n', 17, 'MsgsPerDayRev-Qty-1stDate');
	printf(' * %2s. %-32s',  7, 'DaysOfFlow-Qty');
	printf(' %2s. %-32s\n', 18, 'MsgsPerDayRev-Qty-1stDate-LastDate');
	printf(' * %2s. %-32s',  8, 'DaysOfFlow-Qty-1stDate');
	printf(' %2s. %-32s\n', 19, '1stDate');
	printf(' * %2s. %-32s',  9, 'DaysOfFlow-Qty-1stDate-LastDate');
	printf(' %2s. %-32s\n', 20, '1stDateRev');
	printf(' * %2s. %-32s', 10, 'DaysOfFlowRev-Qty');
	printf(' %2s. %-32s\n', 21, 'LastDate');
	printf(' * %2s. %-32s', 11, 'DaysOfFlowRev-Qty-1stDate');
	printf(' %2s. %-32s\n', 22, 'LastDateRev');
	printf(' * ---------------------------------------------------------------------------\n');
	printf('\n');
}

options = { verbose: argv.indexOf('-v') >= 0 || argv.indexOf('-V') >= 0 || argv.indexOf('--verbose') >= 0 || argv.indexOf('--VERBOSE') >= 0,
			help: argv.indexOf('-h') >= 0 || argv.indexOf('-H') >= 0 || argv.indexOf('--help') >= 0 || argv.indexOf('--HELP') >= 0,
			show: argv.indexOf('-s') >= 0 || argv.indexOf('-S') >= 0 || argv.indexOf('--show') >= 0 || argv.indexOf('--SHOW') >= 0,
			whichrpt: parseInt(parseParam('-r')) || parseInt(parseParam('--report')),
			reportlines: parseInt(parseParam('-l')) || parseInt(parseParam('--lines'))
};

if (isNaN(options.whichrpt)) { options.whichrpt = 1; }
if (isNaN(options.reportlines)) { options.reportlines = -1; }
reportLinesStr = (options.reportlines == -1 ? 'All' : options.reportlines) + ' entries';
if (options.whichrpt > maxReports || options.whichrpt < 1) { options.whichrpt = false; }

tempvar = new Date().toString();
//Sun Oct 20 2019 21:29:59 GMT-0400 (EDT)
reportHead3 = tempvar.substr(11, 4) + '-' +
			  tempvar.substr( 4, 3) + '-' +
			  tempvar.substr( 8, 2) + ' ' +
			  tempvar.substr(16, 5) + ' ' +
			  '(' + tempvar.substr(28, 5) + ')';


if (options.verbose) {
	printf('\n');
	printf('%d parameters:\n', argc);
	printf('\t');
	for (var i in argv) {
		printf('%s ', argv[i]);
	}
	printf('\n\n');
	printf('execution settings:\n');
	if (options.verbose) {
		printf('\tVerbose: enabled\n');
	} else {
		printf('\tVerbose: disabled\n');
	}
	if (options.whichrpt) {
		printf('\tReport: ' + options.whichrpt + '\n');
	} else {
		printf('\tReport: ' + options.whichrpt + ' (forced)\n');
	}
	if (options.reportlines != -1) {
		printf('\tLines: ' + options.reportlines + '\n');
	} else {
		printf('\tLines: all\n');
	}
	printf('\n');
}

function main() {
	printf('\n');
	displayProgHeader();
	progend: {
		if (options.help) {
			showHelp();
			break progend;
		}
		if (options.show) {
			showShow();
			break progend;
		}

		printf(' *\n');
		printf(' * Gathering data...\n');
		loadDatabase();
		printf(' * Collating data...\n');
		collateData();
		printf(' * Sorting data...\n');
		sortData();
		printf(' * Outputing report #' + options.whichrpt + ', ' + reportLinesStr + '...\n');
		saveReport();
	}
	printf('\n');
	printf('Process complete.\n');
	printf('\n');
}

main();

//-- EoF --
