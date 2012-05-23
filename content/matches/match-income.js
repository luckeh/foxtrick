"use strict";
/**
 * match-income.js
 * Foxtrick add links to played matches pages
 * @author convinced, ryanli
 */

Foxtrick.modules["MatchIncome"]={
	MODULE_CATEGORY : Foxtrick.moduleCategories.MATCHES,
	PAGES : ['match'],
	run : function(doc) {

		var sidebar = doc.getElementById('sidebar');
		var sidebarBoxes = sidebar.getElementsByClassName('sidebarBox');
		var isSoldSeats = function(n) {
			// returns whether a sidebarBox is sold seats box
			var tables = n.getElementsByTagName('table');
			if (tables.length != 1)
				return false;
			if (tables[0].rows.length != 4)
				return false;
			if (tables[0].rows[0].cells.length <2)
				return false;
			if (tables[0].rows[0].cells[0].textContent.search(/\d/)!=-1)
				return false;
			if (tables[0].rows[0].cells[1].textContent.search(/\d/)==-1)
				return false;
			return true;
		};
		var soldSeatBox = Foxtrick.filter(isSoldSeats, sidebarBoxes)[0];
		if (!soldSeatBox) // cannot find sold seat boxes
			return;
		
		//find correct price for match
		var prices = [
		{ from: "01.01.1990 00:00", until: "10.06.2012 23:59", terraces : 6.5, basicSeats : 9.5, seatsUnderRoof : 18, vip : 32.5 },
		{ from: "11.06.2012 00:00", until: null, terraces : 7, basicSeats : 10, seatsUnderRoof : 19, vip : 35 },
		];

		var matchDate = Foxtrick.util.time.getDateFromText(doc.getElementsByClassName("date")[0].textContent);
		//use last if we find nothing
		var priceIdx = prices.length - 1;
		for(var i = 0; i < prices.length; i++){
			var from = Foxtrick.util.time.getDateFromText(prices[i].from);
			var until = Foxtrick.util.time.getDateFromText(prices[i].until);
			if(until != null){
				var already = matchDate.getTime() - from.getTime();
				var upcoming = until.getTime() - matchDate.getTime();
				if(already >= 0 && upcoming >= 0){
					priceIdx = i;
					break;
				}
			}
		
		var isCup = doc.getElementsByClassName("matchCup").length > 0?true:false;
		
		var table = soldSeatBox.getElementsByTagName('table')[0];
		var tbody = table.getElementsByTagName('tbody')[0];
		var sum = Foxtrick.trimnum(table.rows[0].cells[1].textContent)	*	prices[priceIdx].terraces *(isCup?(2/3):1)
			+ Foxtrick.trimnum(table.rows[1].cells[1].textContent)		*	prices[priceIdx].basicSeats *(isCup?(2/3):1)
			+ Foxtrick.trimnum(table.rows[2].cells[1].textContent)		*	prices[priceIdx].seatsUnderRoof *(isCup?(2/3):1)
			+ Foxtrick.trimnum(table.rows[3].cells[1].textContent)		*	prices[priceIdx].vip *(isCup?(2/3):1);

		// convert to local currency
		sum /= Foxtrick.util.currency.getRate();
		// get rid of possible fraction
		sum = Math.floor(sum);

		var tr2 = Foxtrick.createFeaturedElement(doc, this, 'tr');
		var td2a = doc.createElement('td');
		var td2b = doc.createElement('td');
		tbody.appendChild(tr2);
		tr2.appendChild(td2a);
		tr2.appendChild(td2b);
		td2a.className = "ch";
		td2a.textContent = Foxtrickl10n.getString('matches.income');
		td2b.className = "nowrap";
		td2b.textContent = Foxtrick.formatNumber(sum, ' ')+' '+Foxtrick.util.currency.getSymbol();
	}
};
