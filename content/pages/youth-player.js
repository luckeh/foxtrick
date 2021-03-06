/**
 * youth-player.js
 * Utilities on youth player page
 * @author ryanli, LA-MJ
 */

'use strict';

/* eslint-disable */
if (!this.Foxtrick)
	var Foxtrick = {};
/* eslint-enable */

if (!Foxtrick.Pages)
	Foxtrick.Pages = {};

Foxtrick.Pages.YouthPlayer = {};

/**
 * Test whether it's youth player page
 * @param  {document}  doc
 * @return {Boolean}
 */
Foxtrick.Pages.YouthPlayer.isPage = function(doc) {
	return Foxtrick.Pages.Player.isYouth(doc);
};

/**
 * Get the date the player joined the team
 * @param  {document} doc
 * @return {Date}
 */
Foxtrick.Pages.YouthPlayer.getJoinedDate = function(doc) {
	var playerTable = doc.querySelector('#mainBody table');
	var joinedNode = playerTable.querySelector('span.shy') || playerTable.rows[2].cells[1];
	return Foxtrick.util.time.getDateFromText(joinedNode.textContent);
};

/**
 * Return days until promotion
 * @param  {document} doc
 * @return {Date}         {?Date}
 */
Foxtrick.Pages.YouthPlayer.getPromotionDate = function(doc) {
	var ret = null;
	try {
		var joinedDate = this.getJoinedDate(doc);
		var age = Foxtrick.Pages.Player.getAge(doc);
		if (joinedDate && age && !isNaN(age.years) && !isNaN(age.days)) {
			var DAYS_IN_SEASON = Foxtrick.util.time.DAYS_IN_SEASON;
			var daysInSeventeen = 17 * DAYS_IN_SEASON;

			var days = age.years * DAYS_IN_SEASON + age.days;
			var daysToSeventeen = daysInSeventeen - days;

			joinedDate = Foxtrick.util.time.toHT(doc, joinedDate);
			Foxtrick.util.time.setMidnight(joinedDate);
			var seasonDate = Foxtrick.util.time.addDaysToDate(joinedDate, DAYS_IN_SEASON);

			var today = Foxtrick.util.time.getHTDate(doc);
			Foxtrick.util.time.setMidnight(today);
			var bDayDate = Foxtrick.util.time.addDaysToDate(today, daysToSeventeen);

			var promoDate = new Date(Math.max(bDayDate, seasonDate));
			ret = Foxtrick.util.time.toUser(doc, promoDate);
		}
	}
	catch (e) {
		Foxtrick.log(e);
	}
	return ret;
};

/**
 * Test whether youth player no longer exists
 * @param  {document} doc
 * @return {Boolean}
 */
Foxtrick.Pages.YouthPlayer.wasFired = function(doc) {
	return doc.querySelector('#mainBody .error') !== null;
};
