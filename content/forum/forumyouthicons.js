/**
 * forumyouthicons.js
 * Foxtrick forum post youth icons 
 * @author spambot
 */
////////////////////////////////////////////////////////////////////////////////
var FoxtrickForumYouthIcons = {
    
    _DOC : {},
    MODULE_NAME : "ForumYouthIcons",
    MODULE_AUTHOR : "spambot",
    MODULE_CATEGORY : Foxtrick.moduleCategories.FORUM,
    DEFAULT_ENABLED : true,
    
    _NEW_MESSAGE_WINDOW : 'ctl00_CPMain_ucEditor_tbBody',

    init : function() {
        Foxtrick.registerPageHandler( 'forumWritePost', this );
        Foxtrick.registerPageHandler( 'messageWritePost', this );
    },

    run : function( page, doc ) {
        
        var toolbar = getElementsByClass( "HTMLToolbar", doc );
        toolbar = toolbar[0];
        if ( toolbar == null ) return;
        var toolbar_main = toolbar;
        toolbar.setAttribute("style","float:left; margin-right:3px;");
        
        // Set styles of all buttons
        var nextElement = toolbar.firstChild;
        while (nextElement) {
            try {
                nextElement.setAttribute("style","margin:2px");
                nextElement = nextElement.nextSibling;
            } catch(e) { nextElement = nextElement.nextSibling; }
        }
        
        //simple test if new icons are set up by HTs
        var toolbar_test = getElementsByClass( "f_hr", doc );
        //dump('Document child class "f_hr": ['+toolbar_test+']\n');
        if (toolbar_test.length != null) {
            var target=toolbar.lastChild;
            var tooldivs = doc.getElementsByTagName('img');
            for (var i = 0; i < tooldivs.length; i++) {
                if (tooldivs[i].className=="f_ul") { target=tooldivs[i]; break;}
            }
            target=target.nextSibling;
            var newimage = doc.createElement( "img" );
            newimage.src = "/Img/Icons/transparent.gif";
            newimage.addEventListener( "click", this._br , false );
            newimage.setAttribute( "class", "f_hr");
            newimage.setAttribute("style","margin:2px; background-image: url('chrome://foxtrick/content/resources/linkicons/format_br.png') !important;");
            newimage.title = Foxtrickl10n.getString("ForumSpecialBBCode.br");
            toolbar.insertBefore( newimage,target );
            
            if ( page != 'messageWritePost' ) {
                var newimage = doc.createElement( "img" );
                newimage.src = "/Img/Icons/transparent.gif";
                newimage.addEventListener( "click", this._hr , false );
                newimage.setAttribute( "class", "f_hr");
                newimage.setAttribute("style","margin:2px");
                newimage.title = Foxtrickl10n.getString("ForumSpecialBBCode.hr");
                toolbar.insertBefore( newimage,target );                                        
            }
        }                
        
        var toolbar_label = doc.createElement( "div" );
        toolbar_label.innerHTML = Foxtrickl10n.getString("ForumYouthIcons.labelToolbar");
        toolbar_label.setAttribute( "style" , "background-color:#D0D0D0;;margin-bottom:3px;text-align:center;");
        toolbar.insertBefore( toolbar_label, toolbar.firstChild );
                    
        // Set styles of next siblings
        var nextElement = toolbar.nextSibling;
        while (nextElement) {
            try {
                nextElement.setAttribute("style","clear:both;");
                nextElement = nextElement.nextSibling;
            } catch(e) { nextElement = nextElement.nextSibling; }
        }
        
        this._DOC = doc;
        
        var youthbar = doc.createElement( "div" );
        youthbar.setAttribute( "class" , "HTMLToolbar");
        youthbar.setAttribute( "style" , "float:left;");

        var youthbar_label = doc.createElement( "div" );
        youthbar_label.innerHTML = Foxtrickl10n.getString("ForumYouthIcons.label");
        youthbar_label.setAttribute( "style" , "background-color:#D0D0D0;;margin-bottom:3px;text-align:center;");
        youthbar.appendChild( youthbar_label);                
        
        var newimage = doc.createElement( "img" );
        newimage.src = "/Img/Icons/transparent.gif";
        newimage.addEventListener( "click", this._youthplayer , false );
        newimage.setAttribute( "class", "f_player");
        newimage.setAttribute("style","margin:2px");
        newimage.title = Foxtrickl10n.getString("ForumYouthIcons.youthplayerid");
        youthbar.appendChild( newimage );

        var newimage = doc.createElement( "img" );
        newimage.src = "/Img/Icons/transparent.gif";
        newimage.addEventListener( "click", this._youthteam , false );
        newimage.setAttribute( "class", "f_team");
        newimage.setAttribute("style","margin:2px");
        newimage.title = Foxtrickl10n.getString("ForumYouthIcons.youthteamid");
        youthbar.appendChild( newimage );
        
        var newimage = doc.createElement( "img" );
        newimage.src = "/Img/Icons/transparent.gif";
        newimage.addEventListener( "click", this._youthmatch , false );
        newimage.setAttribute( "class", "f_match");
        newimage.setAttribute("style","margin:2px");
        newimage.title = Foxtrickl10n.getString("ForumYouthIcons.youthmatchid");
        youthbar.appendChild( newimage );                
        
        var newimage = doc.createElement( "img" );
        newimage.src = "/Img/Icons/transparent.gif";
        newimage.addEventListener( "click", this._youthseries , false );
        newimage.setAttribute( "class", "f_series");
        newimage.setAttribute("style","margin:2px");
        newimage.title = Foxtrickl10n.getString("ForumYouthIcons.youthseries");
        youthbar.appendChild( newimage );
        
        var head = toolbar.parentNode;
        head.insertBefore( youthbar, toolbar.nextSibling );
    },
	
	change : function( page, doc ) {
	
	},
        

    _youthplayer : function (  ) {
        clickHandler(this._DOC.getElementById('ctl00_CPMain_ucEditor_tbBody'), "[youthplayerid=xxx]", null, "xxx", null);
    }, 

    _youthteam : function (  ) { 
        clickHandler(this._DOC.getElementById('ctl00_CPMain_ucEditor_tbBody'), "[youthteamid=xxx]", null, "xxx", null);
    }, 

    _youthmatch : function (  ) { 
        clickHandler(this._DOC.getElementById('ctl00_CPMain_ucEditor_tbBody'), "[link=/Club/Matches/Match.aspx?isYouth=True&matchID=xxx]", null, "xxx", null);

    }, 

    _youthseries : function (  ) { 
        clickHandler(this._DOC.getElementById('ctl00_CPMain_ucEditor_tbBody'), "[link=/World/Series/YouthSeries.aspx?YouthLeagueId=xxx]", null, "xxx", null);    
            
    }, 
        
    _hr : function (  ) {
        clickHandler(this._DOC.getElementById('ctl00_CPMain_ucEditor_tbBody'), "[hr]", null, null, null);
    },         

    _br : function (  ) {
        clickHandler(this._DOC.getElementById('ctl00_CPMain_ucEditor_tbBody'), "[br]", null, null, null);
    },         
        
    _fillMsgWindow : function( string ) {
        try {
            var msg_window = this._DOC.getElementById( this._NEW_MESSAGE_WINDOW );
            msg_window.value += string;
            msg_window.focus();        
        } catch(e) {
            dump(e);
        }
    },        
};

function clickHandler(ta, openingTag, closingTag, replaceText, counter) {
    if (ta) {
        // link tags
        if (replaceText) {
            var s = getSelection(ta);
            var newText = (s.selectionLength > 0)
						? openingTag.replace(replaceText, s.selectedText)
						: openingTag;
            // Opera, Mozilla
            if (ta.selectionStart || ta.selectionStart == '0') {
                ta.value = s.textBeforeSelection + newText + s.textAfterSelection;
                if ((openingTag.indexOf(' ') > 0) && (openingTag.indexOf(' ') < openingTag.length - 1)) {
                    ta.selectionStart = s.selectionStart + openingTag.lastIndexOf('=') + 1;
                    ta.selectionEnd = ta.selectionStart + openingTag.indexOf(' ') - openingTag.lastIndexOf('=') - 1;
                }
                // MessageID
                else {
                    if (s.selectionLength == 0) {
                        ta.selectionStart = s.selectionStart + openingTag.lastIndexOf('=') + 1;
                        ta.selectionEnd = ta.selectionStart + openingTag.indexOf(']') - openingTag.lastIndexOf('=') - 1;
                    }
                    else {
                        ta.selectionStart = s.selectionStart + newText.length;
                        ta.selectionEnd = ta.selectionStart;
                    }
                }
            }
            // Others
            else {
                ta.value += newText;
            }
        }
        // start/end tags
        else if ((closingTag) && (counter >= 0)) {
            var s = getSelection(ta);
            var newText = (s.selectionLength > 0)
						? openingTag + s.selectedText + closingTag
						: (counter % 2 == 1)
							? openingTag
							: closingTag;
            // Opera, Mozilla
            if (ta.selectionStart || ta.selectionStart == '0') {
                ta.value = s.textBeforeSelection + newText + s.textAfterSelection;
                ta.selectionStart = s.selectionStart + newText.length;
                ta.selectionEnd = ta.selectionStart;
            }
            // Others
            else {
                ta.value += newText;
            }
        }
        // Quote
        else if ((closingTag) && !(counter)) {
            ta.value = quoteText + '\n' + ta.value;
        }
        // HR
        else {
            var s = getSelection(ta);
            // Opera, Mozilla
            if (ta.selectionStart || ta.selectionStart == '0') {
                ta.value = s.textBeforeSelection + s.selectedText + openingTag + s.textAfterSelection;
                ta.selectionStart = s.selectionEnd + openingTag.length;
                ta.selectionEnd = ta.selectionStart;
            }
            // Others
            else {
                ta.value += newText;
            }
        }
    }
}

function getSelection(ta) {
    if (ta) {
        ta.focus();
        var textAreaContents = {
            completeText: '',
            selectionStart: 0,
            selectionEnd: 0,
            selectionLength: 0,
            textBeforeSelection: '',
            selectedText: '',
            textAfterSelection: ''
        };
		if (ta.selectionStart || ta.selectionStart == '0') {
            textAreaContents.completeText = ta.value;
            textAreaContents.selectionStart = ta.selectionStart;
			if ((ta.selectionEnd - ta.selectionStart) != 0) {
				while (ta.value.charAt(ta.selectionEnd-1) == ' ') ta.selectionEnd--;
			}
            textAreaContents.selectionEnd = ta.selectionEnd;
            textAreaContents.selectionLength = ta.selectionEnd - ta.selectionStart;
            textAreaContents.textBeforeSelection = ta.value.substring(0, ta.selectionStart);
            var st = ta.value.substring(ta.selectionStart, ta.selectionEnd);
            textAreaContents.selectedText = st;
            textAreaContents.textAfterSelection = ta.value.substring(ta.selectionEnd, ta.value.length);
            return textAreaContents;
        }
        else if (document.selection) {
            var tr = document.selection.createRange();
 			while (tr.text.charAt(tr.text.length - 1) == ' ') {
				tr.moveEnd('character', -1);
				tr.select();
				tr = document.selection.createRange();
			}
            textAreaContents.completeText = ta.value;
            textAreaContents.selectionStart = 0;
            textAreaContents.selectionEnd = 0;
            textAreaContents.selectionLength = tr.text.length;
            textAreaContents.textBeforeSelection = '';
            var st = tr.text;
            textAreaContents.selectedText = st;
            textAreaContents.textAfterSelection = '';
            return textAreaContents;
        }
    }
}