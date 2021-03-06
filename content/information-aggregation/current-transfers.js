/**
 * current-transfers.js
 * Lists information for players on the transfer overview page.
 * @author LA-MJ
 */

'use strict';

Foxtrick.modules['CurrentTransfers'] = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.INFORMATION_AGGREGATION,
	PAGES: ['transfer'],

	// CSS: Foxtrick.InternalPath + 'resources/css/current-transfers.css',
	run: function(doc) {
		var module = this;

		var players = module.getPlayers(doc);
		if (!players.length)
			return;

		module.runPlayers(doc, players);
	},

	getPlayerCell(row) {
		var playerCell = row.cells[0];
		if (playerCell.rowSpan != 1)
			playerCell = row.cells[1];

		return playerCell;
	},

	getBidCell(row) {
		var playerCell = this.getPlayerCell(row);
		return playerCell.nextElementSibling;
	},
	getInfoDiv(row) {
		let infoRow = row.nextElementSibling;
		let info = infoRow.querySelector('.smallText .shy');
		return info.parentNode;
	},

	runPlayers: function(doc, players) {
		var module = this;

		// time to add to player deadline for caching
		var CACHE_BONUS = 0;

		var pArgs = [], pOpts = [];
		Foxtrick.forEach(function(player) {
			var args = [
				['file', 'playerdetails'],
				['version', '2.5'],
				['playerId', parseInt(player.id, 10)],
			];
			pArgs.push(args);
			var cache = player.ddl + CACHE_BONUS;
			pOpts.push({ cache_lifetime: cache });
		}, players);

		Foxtrick.util.currency.detect(doc).then(function(curr) {
			Foxtrick.util.api.batchRetrieve(doc, pArgs, pOpts, (xmls, errors) => {
				if (!xmls)
					return;

				for (var i = 0; i < xmls.length; ++i) {
					if (!xmls[i] || errors[i]) {
						Foxtrick.log('No XML in batchRetrieve', pArgs[i], errors[i]);
						continue;
					}

					var data = {
						rate: curr.rate,
						symbol: curr.symbol,
						args: pArgs[i],
						ddl: players[i].ddl,
						recursion: !!players[i].recursion,
					};
					module.processXML(doc, xmls[i], data);
				}
			});

		}).catch(function(reason) {
			Foxtrick.log('WARNING: currency.detect aborted:', reason);
		});

	},
	getPlayers: function(doc) {
		var module = this;

		var NOW = Foxtrick.util.time.getHTTimeStamp(doc);
		var table = doc.querySelector('#mainBody table.naked');
		if (!table)
			return [];

		// transfers table is the worst DOM ever created
		// some rows include <h2> for player grouping
		// other rows .even .odd are for players:
		// two rows per player: 1) player & price; 2) deadline
		var playerRows = Foxtrick.filter(function(row, i) {
			return i % 2 === 0;
		}, table.querySelectorAll('.odd, .even'));

		var players = [];

		Foxtrick.forEach(function(row) {
			var playerCell = module.getPlayerCell(row);
			var playerLink = playerCell.querySelector('a');
			var playerId = Foxtrick.getUrlParam(playerLink.href, 'playerId');
			Foxtrick.addClass(row, 'ft-transfer-' + playerId);

			if (Foxtrick.any(p => p.id === playerId, players)) {
				// same player on different lists
				return;
			}

			var deadline = NOW;
			var deadlineCell = row.nextElementSibling.cells[0];
			var date = deadlineCell.querySelector('.date');
			if (date) {
				var ddl = Foxtrick.util.time.getDateFromText(date.firstChild.textContent);
				ddl = Foxtrick.util.time.toHT(doc, ddl);
				deadline = ddl.valueOf();
			}

			var bidCell = module.getBidCell(row);
			var bidLink = bidCell.querySelector('a');
			if (!bidLink) {
				// no current bid, adding for CHPP
				players.push({ id: playerId, ddl: deadline });
			}
		}, playerRows);

		return players;
	},
	processXML: function(doc, xml, opts) {
		var module = this;

		var id = xml.num('PlayerID');

		var price, result;
		try {
			price = xml.money('AskingPrice', opts.rate);
			result = Foxtrick.formatNumber(price, '\u00a0') + ' ' + opts.symbol;
		}
		catch (e) {
			// no AskingPrice => stale CHPP
			result = Foxtrick.L10n.getString('status.unknown');
			var now = Foxtrick.util.time.getHTTimeStamp(doc);
			Foxtrick.util.api.setCacheLifetime(JSON.stringify(opts.args), now);

			// try to recurse once
			if (!opts.recursion) {
				module.runPlayers(doc, [{ id: id, ddl: opts.ddl, recursion: true }]);
				return;
			}
		}

		var OPENING_PRICE = Foxtrick.L10n.getString('CurrentTransfers.openingPrice');

		var rows = doc.getElementsByClassName('ft-transfer-' + id);
		Foxtrick.forEach(function(row) {
			var bidCell = module.getBidCell(row);
			var resultSpan = bidCell.querySelector('span.shy');

			Foxtrick.makeFeaturedElement(resultSpan, module);
			Foxtrick.addClass(resultSpan, 'ft-transfers-price');
			resultSpan.textContent = OPENING_PRICE + ': ' + result;

			resultSpan.remove();
			for (let tN of Foxtrick.getTextNodes(bidCell)) {
				if (/^[\s()]+$/.test(tN.textContent))
					tN.textContent = '';
			}

			let infoDiv = module.getInfoDiv(row);
			Foxtrick.prependChild(resultSpan, infoDiv);

		}, rows);
	},
};
