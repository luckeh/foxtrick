/**
 * LastLogin Modifies last login time with HT Dateformat
 * @author spambot
 */

FoxtrickLastLogin = {

    MODULE_NAME : "LastLogin",
    MODULE_CATEGORY : Foxtrick.moduleCategories.SHORTCUTS_AND_TWEAKS,
	PAGES : new Array('managerPage'), 
    DEFAULT_ENABLED : false,
	NEW_AFTER_VERSION: "0.4.9",
	LATEST_CHANGE: "Modifies last login time with HT Dateformat",
    
    init : function() {
    },

    run : function(page, doc) {
    },

	change : function( page, doc ) {
        Foxtrick.dump('Lastlogin');

        var div = doc.getElementById( "pnlLogin" );
        if (div != null) return;

        this._Modify ( doc );
	},

    _Modify  : function ( doc ) {
        // Last login
        Foxtrick.dump('Lastlogin');
        var div = doc.getElementById( "ft_lastlogin" );
        if (div != null) return;
        
        try {
            var div = doc.getElementById( "ctl00_CPMain_pnlLogins" );
            div.addEventListener( "click", FoxtrickLastLogin._Show, false );

        } catch (e) {
            Foxtrick.dump('FoxtrickLastLogin '+e);
        }
    },
    _Show : function(ev){
        var doc = ev.target.ownerDocument;
        var div = doc.getElementById( "ft_lastlogin" );
        if (div == null) 
        try {
            var httime = doc.getElementById( "time" ).innerHTML;
            var HT_date = Foxtrick.getDatefromCellHTML( httime );
            
            if (!Foxtrick.HT_date) return;
            var div = doc.getElementById( "pnlLogin" );
            //Foxtrick.alert(div.innerHTML);
            var login_elm = div.innerHTML.split('<br>');
            div.innerHTML = '<div id="ft_lastlogin">';
            for (var i=0; i<login_elm.length;i++){
                login_elm[i] = Foxtrick.trim(login_elm[i]);
                var last = '';
                if (login_elm[i].search(/\*\*\*\.\*\*\*/) != -1) {
                    var ST_date = Foxtrick.getDatefromCellHTML( login_elm[i] );
                    var _s = Math.floor( (HT_date.getTime() - ST_date.getTime()) / 1000); //Sec
                    var DiffText = TimeDifferenceToText (_s);
                    if (DiffText.search("NaN") == -1)
                        last +=  '<span class="date smallText" id="ft_deadline" style="margin-left:10px; color:#800000">(' + DiffText + ')</span>';
                    else Foxtrick.dump('  Could not create timediff (NaN)\n');
                }
                div.innerHTML += login_elm[i] + last + '<br>\n';
            }
            div.innerHTML += '</div>';
        } catch (e) {
            Foxtrick.alert('FoxtrickLastLogin '+e);
        }
    }
};