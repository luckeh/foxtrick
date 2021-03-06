'use strict';
/**
 * Presentation Fixes
 * @author spambot, ljushaff
 */

Foxtrick.modules['SimplePresentation'] = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.PRESENTATION,
	OUTSIDE_MAINBODY: true,
	PAGES: ['all'],

	OPTIONS: [
		'League_Table',
		'Guestbook',
		'liveHighlightRed',
		'HideAchievementsIcons',
		'NoLogo',
		'NoDefaultLogo'
	],
	OPTIONS_CSS: [
		Foxtrick.InternalPath + 'resources/css/fixes/League_Table.css',
		Foxtrick.InternalPath + 'resources/css/fixes/Guestbook.css',
		Foxtrick.InternalPath + 'resources/css/fixes/liveHighlightRed.css',
		Foxtrick.InternalPath + 'resources/css/fixes/achievement_hideicons.css',
		Foxtrick.InternalPath + 'resources/css/fixes/NoLogo.css',
		Foxtrick.InternalPath + 'resources/css/fixes/NoDefaultLogo.css'
	]
};
