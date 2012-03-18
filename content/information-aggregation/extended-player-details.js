"use strict";
/**
 * ExtendedPlayerDetails
 * @desc displays wage without 20% bonus and time since player joined a team
 * @author spambot, ryanli
 */

Foxtrick.modules["ExtendedPlayerDetails"]={
	MODULE_CATEGORY : Foxtrick.moduleCategories.INFORMATION_AGGREGATION,
	PAGES : new Array('playerdetail'),
	RADIO_OPTIONS : new Array( "SWD", "SW", "SD", "WD", "D" ),

	run : function(doc) {
		this._Player_Joined(doc);
		
		// experiment: add language
		if (FoxtrickPrefs.isModuleOptionEnabled("ExtendedPlayerDetails", "Language")) {
			var addPlayerLanguage = function(playerid, node) {
				Foxtrick.Pages.Player.getPlayer(doc, playerid, function(player) {
					if (!player)
						return;
					if (player.PlayerLanguage) {
						var br = doc.createElement('br');
						br.className = 'clear';
						node.appendChild(br);
					
						var language = Foxtrick.createFeaturedElement(doc,Foxtrick.modules.ExtendedPlayerDetails, 'em');
						Foxtrick.addClass(language, 'shy');
						language.setAttribute('style', 'font-weight:normal; margin-left:5px;');
						language.textContent = player.PlayerLanguage;
						if (player.PlayerLanguageID)
							language.setAttribute('PlayerLanguageID', player.PlayerLanguageID);
						node.appendChild(language);
					}
				});
			};
			var id = Foxtrick.Pages.Player.getId(doc);
			var targetNode = doc.getElementById('mainBody').getElementsByClassName("byline")[0];
			addPlayerLanguage(id, targetNode);
		}
	},

	_Player_Joined : function(doc) {
		// Player in team since...
		var processed = doc.getElementsByClassName("ft_since");
		if (processed.length > 0)
			return;

		var div = doc.getElementsByClassName("playerInfo")[0];
		if (!Foxtrick.util.id.findTeamId(div.getElementsByTagName('table')[0])) return; // player has no team

		var joined_elm = div.getElementsByClassName("shy")[0];

		var dateObj = Foxtrick.util.time.getDateFromText(joined_elm.textContent);
		var season_week = Foxtrick.util.time.gregorianToHT(dateObj);

		var htDate = Foxtrick.util.time.getHtDate(doc)

		var joined_s = Math.floor((htDate.getTime() - dateObj.getTime()) / 1000); //Sec

		var JoinedSpan = Foxtrick.util.time.timeDifferenceToElement (doc, joined_s , true);
		
		if (JoinedSpan.textContent.search("NaN") == -1) {
			Foxtrick.addClass(joined_elm, 'smallText ft_since');
			joined_elm.textContent = joined_elm.textContent.replace(')','');
			joined_elm.insertBefore(doc.createElement('br'),joined_elm.firstChild);
			
			if (FoxtrickPrefs.isModuleEnabled("HTDateFormat")) {
				var dateSpan = Foxtrick.createFeaturedElement(doc, Foxtrick.modules.HTDateFormat, 'span');
				dateSpan.textContent = '('+ season_week.week + '/' + season_week.season + '), ';
				joined_elm.appendChild(dateSpan);
			}
			joined_elm.appendChild(JoinedSpan);
			joined_elm.appendChild(doc.createTextNode(')'));
			Foxtrick.makeFeaturedElement(joined_elm, this);
		}
		else Foxtrick.dump('  Could not create jointime (NaN)\n');
	}
};

Foxtrick.modules["ExtendedPlayerDetailsWage"]={
	MODULE_CATEGORY : Foxtrick.moduleCategories.INFORMATION_AGGREGATION,
	PAGES : new Array('playerdetail'),
	OPTIONS : new Array( "WageWithoutBonus", "SeasonWage"),

	run : function(doc) {
		var div = doc.getElementById("ft_bonuswage");
		if (div != null) return;

		try {
			var div = doc.getElementsByClassName("playerInfo")[0];
			var wageElm = div.getElementsByTagName("table")[0].rows[2].cells[1];
		}
		catch (e) {
			// no such thing, return
			return;
		}
		if (!Foxtrick.util.id.findTeamId(div.getElementsByTagName('table')[0])) return; // player has no team

		var wageText = wageElm.textContent;
		var hasBonus = wageText.indexOf("%") > 0;

		// replace spaces in the currency to non-break spaces (U+00A0)
		var currency = Foxtrick.util.currency.getSymbol().replace(" ", "\u00a0");
		var currencyLen = currency.length;
		var splitPos = wageText.indexOf(currency) + currencyLen;
		var part1 = wageText.substr(0, splitPos);
		var part2 = wageText.substr(splitPos);

		var wage = parseInt(part1.replace(currency, "").replace(/\s/g, "").match(/\d+/)[0]);
		if (isNaN(wage))
			return;

		if (!hasBonus)
			var formattedWage = Foxtrick.formatNumber(wage, "\u00a0");
		else {
			var reducedWage = Math.floor(wage / 1.2);
			var formattedWage = Foxtrick.formatNumber(reducedWage, "\u00a0");
		}

		if (hasBonus && FoxtrickPrefs.isModuleOptionEnabled("ExtendedPlayerDetailsWage", "WageWithoutBonus")) {
			wageElm.textContent = part1 +"\u00a0";
			var span = doc.createElement('span');
			span.setAttribute('id', 'ft_bonuswage');
			span.setAttribute('style', 'direction: ltr !important; color:#666666;');
			span.textContent = '('+ formattedWage + '\u00a0' + currency + ')';			
			wageElm.appendChild(span);
			wageElm.appendChild(doc.createTextNode(part2));
			Foxtrick.makeFeaturedElement(span, this);
		}
		if (FoxtrickPrefs.isModuleOptionEnabled("ExtendedPlayerDetailsWage", "SeasonWage")) {
			wageElm.appendChild(doc.createElement('br'));
			var span = doc.createElement('span');
			span.setAttribute('id', 'ft_seasonwage');
			span.textContent = 
				Foxtrick.formatNumber(wage * 16, "\u00a0") + "\u00a0"
				+ currency
				+ Foxtrickl10n.getString("ExtendedPlayerDetails.perseason");		
			wageElm.appendChild(span);
			Foxtrick.makeFeaturedElement(span, this);
		}
	}
};
