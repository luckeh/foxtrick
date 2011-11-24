"use strict";
/**
* forum-change-posts.js
* Foxtrick Copies post id to clipboard
* @author convinced
*/

Foxtrick.util.module.register({
	MODULE_NAME : "ForumChangePosts",
	CORE_MODULE : true,
	PAGES : ["forumViewThread"],
	CSS : Foxtrick.InternalPath + "resources/css/forum-change-post.css",

	run : function(doc) {
		var bDetailedHeader = true;
		var addCopyPostId = function(idLink) { 
			// part of copypostid
			var link = doc.createElement("a");
			link.className = "ft-copy-small ft-link";
			link.title = Foxtrickl10n.getString("foxtrick.CopyPostID");
			var img = doc.createElement("img");
			img.src = "/Img/Icons/transparent.gif";
			link.appendChild(img);
			Foxtrick.listen (img, "click", function() {
					var idExpanded = (idLink.href.indexOf("MInd") >= 0);
					if (idExpanded) {
						var postId = idLink.href.match(/\d+\.\d+/g)[0];
					}
					else {
						var postId = idLink.title;
					}
					var insertBefore = idLink.parentNode.parentNode.parentNode; // cfWrapper
					Foxtrick.copyStringToClipboard("[post=Oops]".replace("Oops", postId));
					var note = Foxtrick.util.note.add(doc, insertBefore, "ft-post-id-copy-note-" + postId.replace(/\D/g, "-"),
						Foxtrickl10n.getString("foxtrick.tweaks.postidcopied").replace("%s", postId),
						null, true);
				}, false);
			idLink.parentNode.insertBefore(link, idLink);
		};
		var copy_posting_to_clipboard = function(ev) {
			try {
				var doc = ev.target.ownerDocument;
				var is_archive_link = (ev.target.getAttribute('is_archive_link')=='true');

				if (!is_archive_link) {
					var copy_style = ev.target.getAttribute('copy_style');
					if (copy_style=='last') FoxtrickPrefs.getString('CopyPostingStyle');
					else FoxtrickPrefs.setString('CopyPostingStyle', copy_style);
					var post_nr = ev.target.getAttribute('post_nr');
					var header=doc.getElementById('ft_copy_posting_link_id'+post_nr).parentNode.parentNode.parentNode;
					if (header.className.search('cfHeader')==-1) header=header.parentNode; // detailed header is one up
				}
				else {
					var copy_style='ht-ml';
					var header=ev.target.parentNode.parentNode.parentNode.getElementsByTagName('div')[0];
				   	if (header.className.search('cfHeader')==-1) header=header.nextSibling; // official. detailed header is one down
					Foxtrick.log(header.className,'\n');
				}
				var insertBefore = header.parentNode;

				var header_left = null;
				var header_right = null;

				var k = 0, header_part;
				while ( header_part = header.childNodes[k++]) {
					if (header_part.className.search(/float_left/)!=-1 ) header_left = header_part;
					if (header_part.className.search(/float_right/)!=-1 ) {
						if (header_right==null) header_right = header_part;
					}
				}

				// the only text node of head_right, which contains date and time
				var header_right_text = "";
				for (var i = 0; i < header_right.childNodes.length; ++i) {
					if (header_right.childNodes[i].nodeType === Node.TEXT_NODE) {
						header_right_text = header_right.childNodes[i].textContent;
						break;
					}
				}

				// get post_links, poster_links, poster_id from header
				var header_left_links = header_left.getElementsByTagName('a');
				var post_link1 = null;
				var poster_link1 = null;
				var poster_id1 = null;
				var post_link2 = null;
				var poster_link2 = null;
				var poster_id2 = null;
				var supporter_link1 = null;
				var supporter_link2 = null;
				var league_link1 = null;
				var league_link2 = null;
				var post_id1 = null;
				var post_id2 = null;

				var k = 0, header_left_link;
				if (header_left_links[0].href.search(/showMInd/)==-1 )
					bDetailedHeader = true;
				while ( header_left_link = header_left_links[k++]) {

					if (!poster_link1) {
						if (header_left_link.href.search(/showMInd/) != -1) {
							post_id1 = header_left_link.href.match(/(\d+\.\d+)/)[1];//header_left_link.href.match(/(\d+)-\d+/)[1]+'.'+header_left_link.href.match(/\d+-(\d+)/,'')[1];
							post_link1 = header_left_link;
						}
						else if (header_left_link.href.search(/Forum\/Read\.aspx/) != -1) {
							post_id1 = header_left_link.title;
							post_link1 = header_left_link;
						}
						else if (header_left_link.href.search(/Club\/Manager\/\?userId=/i) != -1) {
							poster_link1 = header_left_link;
							poster_id1 = poster_link1.href.match(/\d+$/);
							if (header_left_links[k]
								&& header_left_links[k].href.search(/Supporter/i) != -1) {
									supporter_link1 = header_left_links[k];
							}
						}
					} else if (!poster_link2 || !post_link2) {
						if (header_left_link.href.search(/showMInd/) != -1) {
							post_id2 = header_left_link.href.match(/(\d+\.\d+)/)[1];//header_left_link.href.match(/(\d+)-\d+/)[1]+'.'+header_left_link.href.match(/\d+-(\d+)/,'')[1];
							post_link2 = header_left_link;
						}
						else if (header_left_link.href.search(/Forum\/Read\.aspx/) != -1) {
							post_id2 = header_left_link.title;
							post_link2 = header_left_link;
						}
						else if (post_link2 && header_left_link.href.search(/Club\/Manager\/\?userId=/i) != -1) {
							poster_link2 = header_left_link;
							poster_id2 = poster_link2.href.match(/\d+$/);
							if (header_left_links[k]
								&& header_left_links[k].href.search(/Supporter/i) != -1) {
									supporter_link2 = header_left_links[k];
							}
						}
					}
				}

			// make header
			var headstr = post_id1+': '+poster_link1.title+' » ';
			if (poster_link2 && post_link2)  headstr+=post_id2+': '+poster_link2.title+'\n';
			else headstr+='all\n';
			if (copy_style == 'ht-ml') headstr='[q='+poster_link1.title+'][post='+post_id1+']\n';

			// get date+time
			var date = header_right_text.replace(/^ /,'');
			var time ='';
			if (date.search(/\d+:\d+/)==0) {  // time unaltered
				var cur_time = doc.getElementById('time').textContent;
				var hi = cur_time.search(/\d+:\d+/);
				time = date;
				date = cur_time.substring(0,hi);
			}
			else if (date.search(/\d+:\d+/)==-1) { // date hidden by forumalterheaderline
				var span = header_right.getElementsByTagName('span')[0];
				if (span) time = span.title;
				else time = date;
			}

			var fulldate = date + time;
			if (copy_style != 'ht-ml') headstr = fulldate + "  \n" + headstr + '';

			if (copy_style == 'wiki') {
				var headstr='{{forum_message|\n';
					headstr += '| from = [ [ '+poster_link1.title+' ] ]\n';
					headstr += '| to = '+(poster_link2?poster_link2.title:'Everyone')+'\n';
					headstr += '| msgid = '+post_id1+'\n';
					headstr += '| prevmsgid = '+(post_id2?post_id2:'')+'\n';
					headstr += '| datetime = '+fulldate.replace(/(.+ )(\d+:\d+)/,'$1'+'at '+'$2')+'\n';
					headstr += '| keywords = \n';
					headstr += '| text =\n';
			}

			// get message content
			var msg = header.parentNode.getElementsByClassName("message")[0];
			var message = Foxtrick.util.htMl.getMarkupFromNode(msg);
			message = headstr + message;

			// complete message
			if (copy_style == "wiki")
				message += "}}";
			else if (copy_style == "ht-ml")
				message += "[/q]";

			Foxtrick.copyStringToClipboard(message);

			var note = Foxtrick.util.note.add(doc, insertBefore, "ft-posting-copy-note-" + post_id1.replace(/\D/, "-"),
				Foxtrickl10n.getString("foxtrick.tweaks.postingcopied").replace("%s", post_id1),
				null, true);
			}
			catch (e) {
				Foxtrick.log(e);
			}
		};
		
		
		
		var do_copy_post_id = FoxtrickPrefs.isModuleEnabled("CopyPostID");
		var do_copy_posting = FoxtrickPrefs.isModuleEnabled("CopyPosting");
		var do_default_facecard = FoxtrickPrefs.isModuleEnabled("AddDefaultFaceCard");
		var do_format_text = FoxtrickPrefs.isModuleEnabled("FormatPostingText");
		var do_move_links = FoxtrickPrefs.isModuleEnabled("MoveLinks");
		var do_redir_to_team = FoxtrickPrefs.isModuleEnabled("ForumRedirManagerToTeam");
		
		var do_embed_media = FoxtrickPrefs.isModuleEnabled("EmbedMedia");
			var do_embed_youtube_videos = do_embed_media && FoxtrickPrefs.isModuleOptionEnabled("EmbedMedia", "EmbedYoutubeVideos");
			var do_embed_vimeo_videos = do_embed_media && FoxtrickPrefs.isModuleOptionEnabled("EmbedMedia", "EmbedVimeoVideos");
			var do_embed_funnyordie_videos = do_embed_media && FoxtrickPrefs.isModuleOptionEnabled("EmbedMedia", "EmbedFunnyOrDieVideos");
			var do_embed_dailymotion_videos = do_embed_media && FoxtrickPrefs.isModuleOptionEnabled("EmbedMedia", "EmbedDailymotionVideos");
		var do_alter_header = FoxtrickPrefs.isModuleEnabled("ForumAlterHeaderLine");
			var do_single_header = do_alter_header && FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "SingleHeaderLine");
			var do_small_header_font = do_alter_header && FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "SmallHeaderFont");
			var do_single_header_allways = do_alter_header && do_single_header && !FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "CheckDesign");
			var do_truncate_nicks = do_alter_header && FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "TruncateLongNick");
			var do_truncate_leaguename = do_alter_header && FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "TruncateLeagueName");
			var do_hide_old_time = do_alter_header && FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "HideOldTime");
			var do_short_postid = do_alter_header && FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "ShortPostId");
			var do_replace_supporter_star = do_alter_header && FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "ReplaceSupporterStar");
			var do_HighlightThreadOpener = do_alter_header && FoxtrickPrefs.isModuleOptionEnabled("ForumAlterHeaderLine", "HighlightThreadOpener");
		
		var hasScroll = Foxtrick.util.layout.mainBodyHasScroll(doc);
		var isStandardLayout = Foxtrick.util.layout.isStandard ( doc ) ;
		var notif = doc.getElementById('ctl00_ctl00_CPContent_ucNotifications_updNotifications');
		// archived threads will have this message: "This thread is closed!"
		var isArchive = notif.getElementsByClassName("error").length > 0;

		// part of copy_posting_link
		var copy_posting_img = doc.createElement('img');
		copy_posting_img.src = "/Img/Icons/transparent.gif";
		copy_posting_img.title = Foxtrickl10n.getString('CopyPosting').replace('%s', Foxtrickl10n.getString('CopyPosting.style.last') );
		copy_posting_img.setAttribute('copy_style','last');

		var copy_posting_div = doc.createElement("div");
		if (Foxtrick.util.layout.isSupporter(doc))
			copy_posting_div.className = "ft-pop-up-container ft-copy";
		else
			copy_posting_div.className = "ft-pop-up-container ft-copy-small";
		copy_posting_div.appendChild(copy_posting_img);

		var possibleStyles=['ht-ml', 'wiki', 'raw'];
		var list = doc.createElement("ul");
		list.className = "ft-pop right top";
		for (var i=0; i<possibleStyles.length; ++i) {
			var item = doc.createElement("li");
			var link = doc.createElement("span");
			link.setAttribute('copy_style', possibleStyles[i]);
			var style = Foxtrickl10n.getString('CopyPosting.style.' + possibleStyles[i]);
			link.textContent = Foxtrickl10n.getString('CopyPosting.abbr').replace('%s', style);
			link.title = Foxtrickl10n.getString('CopyPosting').replace('%s', style);
			item.appendChild(link);
			list.appendChild(item);
		}
		copy_posting_div.appendChild(list);

		var copy_posting_link_archive = doc.createElement('a');
		copy_posting_link_archive.setAttribute('href','javascript:void(0);');
		copy_posting_link_archive.title = Foxtrickl10n.getString('CopyPosting').replace('%s', Foxtrickl10n.getString('CopyPosting.style.ht-ml'));
		copy_posting_link_archive.setAttribute('is_archive_link','true');
		copy_posting_link_archive.textContent = Foxtrickl10n.getString( 'foxtrick.linkscustom.copy' );
		copy_posting_link_archive.setAttribute('class','foxtrick-copyfromarchive');
		Foxtrick.listen(copy_posting_link_archive, "click", copy_posting_to_clipboard, false);

		// part of alter header
		var trunclength = 10;
		if (isStandardLayout) trunclength = 14;

		var doubleHeaderStyle = 'height:30px !important; ';
		var alt_supporter=doc.createElement('a');
		alt_supporter.href="/Help/Supporter/";
		alt_supporter.textContent = "*";
		alt_supporter.title = "Hattrick Supporter";

		if (do_HighlightThreadOpener) try {
			var Ftag = doc.getElementById('ctl00_ucGuestForum_ucGuestForum_updMain');
			if (!Ftag) {Ftag = doc.getElementById('myForums');}
			if (Ftag) {
				Ftag = Ftag.getElementsByTagName('strong')[0];
				var TName = Ftag.textContent;
				var TName_lng = Ftag.parentNode.title;
				TName_lng = TName_lng.replace(TName, "");
				TName_lng = TName_lng.split(" ")[2];
			} else var TName_lng = false;
		} catch(e_tag) {Foxtrick.dump('HTO ' + e_tag + '\n'); var TName_lng = false;}

		if (do_format_text) {
			try {
				var HideLevel = FoxtrickPrefs.getString("module.FormatPostingText.NestedQoutesAsSpoilers_text");
				var numSpoilerQuotes = 0;
				
				var org = new Array(/\[pre\](.*?)\[\/pre\]/gi , /·/gi);
				var rep = new Array("<pre>$1</pre>", "");
				var messages = doc.getElementsByClassName("message");
				for (var i = 0; i < messages.length; ++i){
					var count_pre = Foxtrick.substr_count(messages[i].innerHTML, '[pre');
					for (var j = 0; j <= count_pre; ++j) {
						for ( var k = 0; k < org.length; ++k) {
							messages[i].innerHTML = messages[i].innerHTML.replace(org[k],rep[k]);
						}
					}

					if (FoxtrickPrefs.isModuleOptionEnabled("FormatPostingText", "NestedQoutesAsSpoilers")) {
						var spoilers = [];
						var getQuotes = function(node, level) {
							if (level == HideLevel && node.getElementsByClassName('quote').length >= 1 ) {
								var spoiler_show = doc.createElement('blockquote');
								spoiler_show.id = 'spoilshow_qouteNum' + (++numSpoilerQuotes);
								spoiler_show.className = 'spoiler';
								var open_link = doc.createElement('a');
								open_link.href = "javascript:showSpoiler('qouteNum" + numSpoilerQuotes + "');";
								open_link.textContent = Foxtrickl10n.getString('ShowNestedQoutes');
								spoiler_show.appendChild(open_link);
								
								var spoiler_hidden = doc.createElement('blockquote');
								spoiler_hidden.id = 'spoilhid_qouteNum' + numSpoilerQuotes;
								spoiler_hidden.className = 'spoiler hidden';
								spoiler_hidden.appendChild(node.cloneNode(true));
								node.parentNode.insertBefore(spoiler_show, node.nestSibling);
								node.parentNode.removeChild(node);
								spoilers.push([spoiler_show, spoiler_hidden]);
								
							}
							else {
								var qouteNodes = node.getElementsByClassName('quote');
								for (var j = 0; j < qouteNodes.length; ++j ) 
									getQuotes(qouteNodes[j], level +1);
							}
						};
						
						getQuotes(messages[i], -1);
						
						for (var j = 0; j < spoilers.length; ++j ) {
							spoilers[j][0].parentNode.insertBefore(spoilers[j][1], spoilers[j][0].nextSibling);
						}
					}
				}
				
			} catch (e) {
				Foxtrick.log('FORMAT TEXT ', e);
			}
		}	
		
		if(do_embed_youtube_videos 
		|| do_embed_vimeo_videos  
		|| do_embed_funnyordie_videos
		|| do_embed_dailymotion_videos)
		{
			try {
				var regex = {"vimeo":"^(http:\/\/)([a-zA-Z]{2,3}\.)?(vimeo)\.com\/(\\d+)",
							 "youtube":"^(http:\/\/)([a-zA-Z]{2,3}\.)?(youtube\.[a-zA-Z]{2,3}|youtu\.be)\/.*(v[=\/]([a-zA-Z0-9-_]{11}\\b)|\/([a-zA-Z0-9-_]{11}\\b))",
							 "funnyordie":"^(http:\/\/)([a-zA-Z]{2,3}.)?(funnyordie)\.(com)\/videos\/([a-zA-Z0-9]*)\\b",
							 "dailymotion":"^(http:\/\/)([a-zA-Z]{2,3}\.)?(dailymotion\.com)\/video\/([a-zA-Z0-9-]+)"
							};
				//mayb later: http://oembed.com/
				var embedurls = {"vimeo":"http://player.vimeo.com/video/",
							 "youtube":"http://www.youtube.com/embed/",
							 "funnyordie":"http://www.funnyordie.com/embed/",
							 "dailymotion":"http://www.dailymotion.com/embed/video/"
							};

				var messages = doc.getElementsByClassName("message");
				for(var i = 0; i < messages.length; ++i)
				{
					var media_links = [];
					var links = messages[i].getElementsByTagName('a');						
					for (var j = 0; j < links.length; ++j ) {

						var linkMap = {"site":null,"videoId":null, "link":links[j]};
						var matches,re,matches = null;
						
						if(do_embed_youtube_videos && !linkMap["site"]){
							re = new RegExp( regex["youtube"] );
							matches = re.exec(links[j].href)
							if(matches)
								linkMap["site"] = "youtube";
						}
						if(do_embed_vimeo_videos && !linkMap["site"]){
							re = new RegExp( regex["vimeo"] );
							matches = re.exec(links[j].href)
							if(matches)
								linkMap["site"] = "vimeo";
						}
						if(do_embed_funnyordie_videos && !linkMap["site"]){
							re = new RegExp( regex["funnyordie"] );
							matches = re.exec(links[j].href)
							if(matches)
								linkMap["site"] = "funnyordie";
						}
						if(do_embed_dailymotion_videos && !linkMap["site"]){
							re = new RegExp( regex["dailymotion"] );
							matches = re.exec(links[j].href)
							if(matches)
								linkMap["site"] = "dailymotion";
						}
						
						if(!linkMap["site"])
							continue;
							
						if(linkMap["site"] == "youtube"){
							linkMap["videoId"] = matches[5]?matches[5]:(matches[6]?matches[6]:null);
							if(linkMap["link"].href.match("user\/"+linkMap["videoId"]))
								linkMap["videoId"] = null;
						} else if (linkMap["site"] == "vimeo"){
							linkMap["videoId"] = matches[4]?matches[4]:null;
						} else if (linkMap["site"] == "funnyordie"){
							linkMap["videoId"] = matches[5]?matches[5]:null;
						} else if (linkMap["site"] == "dailymotion"){
							linkMap["videoId"] = matches[4]?matches[4]:null;
						}
						
						if(!linkMap["videoId"] || !linkMap["link"] || !linkMap["site"])
							continue;
							
						media_links.push(linkMap);
					}
					for (var j = 0; j < media_links.length; ++j ) {						
						var site = media_links[j]["site"];
						var videoId = media_links[j]["videoId"];
						var link = media_links[j]["link"];
						var src = null;
						if ( site == "youtube" && do_embed_youtube_videos) {
							src = embedurls["youtube"] + videoId;
						} else if( site == "vimeo" && do_embed_vimeo_videos) {
							src = embedurls["vimeo"] + videoId;
						} else if( site == "funnyordie" && do_embed_funnyordie_videos){
							src = embedurls["funnyordie"] + videoId;
						} else if( site == "dailymotion" && do_embed_dailymotion_videos){
							src = embedurls["dailymotion"] + videoId;
						} else 
							continue;
						
						if(!src)
							continue;
							
						try {
							var embed = function(src, link){
								var videocontainer = doc.createElement('div');
								videocontainer.setAttribute('style', "text-align:center;");
								var iframe = doc.createElement('iframe');
								iframe.setAttribute('width', "400");
								iframe.setAttribute('height', "334");
								iframe.setAttribute('src', src);
								iframe.setAttribute('frameborder','0');
								videocontainer.appendChild(iframe);
								link.parentNode.replaceChild(videocontainer,link);
							}
							var div = doc.createElement('div');
							var header_a = doc.createElement('a');
							header_a.textContent = link.textContent;
							header_a.href=link.href
							div.appendChild(header_a)
							Foxtrick.addClass(div, 'ft-media-expander-unexpanded'); 
							link.parentNode.insertBefore(div, link);
							var videocontainer = doc.createElement('div');
							Foxtrick.addClass(videocontainer, 'hidden')
							var a = doc.createElement('a');
							a.href=src
							videocontainer.appendChild(a);
							link.parentNode.replaceChild(videocontainer, link);
							Foxtrick.listen(div, "click", function(ev){
								if(!Foxtrick.hasClass(ev.target.nextSibling,'ft-media-embedded')){
									embed(ev.target.nextSibling.firstChild.href, ev.target.nextSibling.firstChild);
									Foxtrick.addClass(ev.target.nextSibling,'ft-media-embedded')
								}	
								Foxtrick.toggleClass(ev.target.nextSibling,'hidden');
								if(Foxtrick.hasClass(ev.target,'ft-media-expander-unexpanded')){
									Foxtrick.removeClass(ev.target,'ft-media-expander-unexpanded')
									Foxtrick.addClass(ev.target,'ft-media-expander-expanded')
								}else{
									Foxtrick.removeClass(ev.target,'ft-media-expander-expanded')
									Foxtrick.addClass(ev.target,'ft-media-expander-unexpanded')
									}
							}, false);
							continue;
						} 
						catch(e){
							Foxtrick.log("MEDIA REPLACE add iframe", e);
						}
					}
				}
			} catch(e){
				Foxtrick.log("MEDIA REPLACE", e);
			}
		}


		// loop through cfWrapper --------------------------------------------
		var num_wrapper = 0;  // message counter
		var wrappers = doc.getElementsByClassName("cfWrapper");
		var i = 0, wrapper;
		while ( wrapper = wrappers[i++] ) {
			if (wrapper.getElementsByClassName("cfDeleted").length > 0)
				continue; // post deleted, process next
			var header = wrapper.getElementsByClassName("cfHeader")[0];

			// +++++++++++ gather info and nodes +++++++++++++++++++++++++
			var header_left = header.getElementsByClassName("float_left")[0];
			var header_right = header.getElementsByClassName("float_right")[0];
			var header_right_inner = header_right.getElementsByTagName("div")[0]
				|| header_right;

			// get post_links, poster_links, poster_id from header
			var header_left_links = header_left.getElementsByTagName('a');
			var post_link1 = null;
			var poster_link1 = null;
			var poster_id1 = null;
			var post_link2 = null;
			var poster_link2 = null;
			var poster_id2 = null;
			var supporter_link1 = null;
			var supporter_link2 = null;
			var league_link1 = null;
			var league_link2 = null;
			var is_ignored = false;
			if (do_single_header && header_right && header_right.innerHTML.search('showHide')!=-1) {
				is_ignored = true;
				var header_right_links = header_right.getElementsByTagName('a');
				var k = 0, header_right_link;
				while (header_right_link = header_right_links[k++]) {
					if (header_right_link.href.search('showHide')!=-1) {
						header_right_link.parentNode.setAttribute('style','margin-left:3px;');
						break;
					}
				}
			}

			var k = 0, header_left_link;
			if (header_left_links[0].href.search(/showMInd/)==-1 )
				bDetailedHeader = true;
			while ( header_left_link = header_left_links[k++]) {
				if (!poster_link1) {
					if (header_left_link.href.search(/showMInd|Forum\/Read\.aspx/) != -1) post_link1 = header_left_link;
					else if (header_left_link.href.search(/Club\/Manager\/\?userId=/i) != -1) {
						poster_link1 = header_left_link;

						poster_id1 = poster_link1.href.replace(/\&browseIds.+/, '').match(/\d+$/);

						if (header_left_links[k]
							&& header_left_links[k].href.search(/Supporter/i) != -1) {
								supporter_link1 = header_left_links[k];
						}
					}
				}
				else if (!poster_link2 || !post_link2) {
					if (header_left_link.href.search(/showMInd|Forum\/Read\.aspx/) != -1)
						post_link2 = header_left_link;
					else if (header_left_link.href.search(/Club\/Manager\/\?userId=/i) != -1) {
						poster_link2 = header_left_link;
						poster_id2 = poster_link2.href.replace(/\&browseIds.+/, '').match(/\d+$/);
						if (header_left_links[k]
							&& header_left_links[k].href.search(/Supporter/i) != -1) {
							supporter_link2 = header_left_links[k];
						}
					}
				}
				if (!isStandardLayout) {
					if (!league_link1 && header_left_link.href.search(/LeagueLevelUnitID/i) != -1)
						league_link1 = header_left_link;
					else if (header_left_link.href.search(/LeagueLevelUnitID/i) != -1)
						league_link2 = header_left_link;
				}
			}

			// get user, user_info, user_avater: all maybe = null !!!
			var user = null;
			var user_avatar = null;
			var user_info = null;
			var message = null;
			var footer = null;

			var divs = wrapper.getElementsByTagName('div');
			var k = 2, div;
			while ( div = divs[++k] ){
				if ( div.className == 'cfUser') user = div;
				else if ( div.className == 'cfUserInfo') user_info = div;
				else if ( div.className == 'faceCard') user_avatar = div;
				else if ( div.className == 'cfMessage') message = div;
				else if ( div.className == 'cfFooter') footer = div;
			}

			// get info & nodes from user_info
			var teamid = null;
			var teamname = null;
			var leagueid = null;
			var countryLink = null;
			var leagueLinkUserInfo = null;
			if (user_info) {
				var user_info_links = user_info.getElementsByTagName("a");
				var k = 0, user_info_link;
				while (user_info_link = user_info_links[++k] ) {
					if ( user_info_link.href.search(/teamid=/i) != -1) {
						var teamid = user_info_link.href.match(/\d+$/);
						var teamname = user_info_link.textContent;
						// set some info used for teampopup
						poster_link1.setAttribute('teamid', teamid);
						poster_link1.setAttribute('teamname', teamname);
					}
					if (user_info_link.href.search(/LeagueID=/i) != -1) {
							countryLink = user_info_link;
					} else if (user_info_link.href.search(/LeagueLevelUnitID=/i) != -1) {
							leagueLinkUserInfo = user_info_link;
							leagueid = Foxtrick.util.id.getLeagueLeveUnitIdFromUrl(user_info_link.href);
					}
				}
			} // get user info

			// +++++++++++++ modules +++++++++++++++++++++++++++++++++++

			// copy post id ---------------------------------------------
			if (do_copy_post_id) {
				addCopyPostId(post_link1);
			}  // end copy post id

			// copy posting ---------------------------------------------
			if (do_copy_posting) {
				var copy_div = copy_posting_div.cloneNode(true);
				var copy_img = copy_div.getElementsByTagName('img')[0];
				copy_img.id = 'ft_copy_posting_link_id' + num_wrapper;
				Foxtrick.listen(copy_img, "click", copy_posting_to_clipboard, false);
				copy_img.setAttribute('post_nr',num_wrapper);
				var copy_links = copy_div.getElementsByTagName('span');
				for (var cl=0; cl<possibleStyles.length; ++cl){
					Foxtrick.listen(copy_links[cl], "click", copy_posting_to_clipboard, false);
					copy_links[cl].setAttribute('post_nr',num_wrapper);
				}
				header_right_inner.appendChild(copy_div);

				if (isArchive) {
					var copy_link = copy_posting_link_archive.cloneNode(true);
					Foxtrick.listen(copy_link, "click", copy_posting_to_clipboard, false);
					var footer_left = footer.getElementsByTagName('div')[0];
					footer_left.insertBefore(copy_link,footer_left.firstChild);
				}
			}  // end copy posting

			if (do_hide_old_time) {
				if (header_right.textContent.search(/ \d{1,4}.*?\d{1,2}.*?\d{1,4}.*? \d+:\d+/gi)!=-1)
					header_right.innerHTML = header_right.innerHTML.replace(/ (\d{1,4}.*?\d{1,2}.*?\d{1,4}.*?)( \d+:\d+)/gi,"<span title='$2'>$1</span>");
			}

			// redir to team ------------------------------------------
			if ( do_redir_to_team ) {
				poster_link1.href += "&redir_to_team=true";
				if (poster_link2) poster_link2.href += "&redir_to_team=true";
			}

			// move links -----------------------------------------
			if ( do_move_links && countryLink && leagueLinkUserInfo) {
				var placenode;
				if (supporter_link1) placenode = supporter_link1.nextSibling;
				else placenode = poster_link1.nextSibling;
				var space = doc.createTextNode(" ");
				header_left.insertBefore(space, placenode);
				header_left.insertBefore(leagueLinkUserInfo, space);
				header_left.insertBefore(countryLink, leagueLinkUserInfo);
				var space = doc.createTextNode(" ");
				header_left.insertBefore(space, countryLink);

			}

			// single header line ---------------------------------------
			if (do_truncate_nicks && do_single_header_allways) {
				var userName1 = poster_link1.textContent;
				if (userName1.length > trunclength) {
					poster_link1.setAttribute('longnick',poster_link1.textContent);
					poster_link1.textContent = userName1.substr(0,trunclength-2) +"..";
				}
				if (poster_link2) {
					var userName2 = poster_link2.textContent;
					if (userName2.length > trunclength) {
						poster_link2.setAttribute('longnick',poster_link2.textContent);
						poster_link2.textContent = userName2.substr(0,trunclength-2) +"..";
					}
				}
				if (league_link1) {
					var league_name1 = league_link1.textContent;
					if (league_name1.length > trunclength) {
						league_link1.textContent = league_name1.substr(0,trunclength-2) +"..";
					}
				}
				if (league_link2) {
					var league_name2 = league_link2.textContent;
					if (league_name2.length > trunclength) {
						league_link2.textContent = league_name2.substr(0,trunclength-2) +"..";
					}
				}
			}

			if (do_truncate_leaguename) {
				if (league_link1) {
					league_link1.textContent = league_link1.textContent.replace(/\..+/,'');
					if (league_link1.textContent.length>3 && league_link1.textContent!='VIII')
						league_link1.textContent='I';
				}
				if (league_link2) {
					league_link2.textContent = league_link2.textContent.replace(/\..+/,'');
					if (league_link2.textContent.length>3 && league_link2.textContent!='VIII')
						league_link2.textContent='I';
				}
			}

			if (do_short_postid && bDetailedHeader) {
				var PostID_message = post_link1.title.replace(/\d+\./,'');
				if (!do_copy_post_id) {
					var PostID_thread = post_link1.title.replace(/\.\d+/g,'');
					post_link1.href="javascript:showMInd('"+PostID_thread+"-"+PostID_message+"',%20'/Forum/Read.aspx?t="+PostID_thread+"&n="+PostID_message+"&v=2',%20'"+PostID_thread+"."+PostID_message+"');"
					post_link1.setAttribute('id',PostID_thread+"-"+PostID_message);
				}
				post_link1.textContent = String(PostID_message);

				if (post_link2) {
					var PostID_message = post_link2.title.replace(/\d+\./,'');
					post_link2.textContent = String(PostID_message);
				}

			}
			if (do_replace_supporter_star) {
				if (supporter_link1) {
					poster_link1.parentNode.insertBefore(alt_supporter.cloneNode(true),poster_link1.nextSibling);
				}
				if (supporter_link2 && poster_link2) {
					poster_link2.parentNode.insertBefore(alt_supporter.cloneNode(true),poster_link2.nextSibling);
				}
			}

			if (do_HighlightThreadOpener && TName_lng) {
				try {
					if (poster_link1.textContent == TName_lng) {
						poster_link1.parentNode.parentNode.firstChild.nextSibling.setAttribute('class','ft_slH_PID_left');
					}
					else if (poster_link2 && poster_link2.textContent == TName_lng) {
						poster_link2.parentNode.parentNode.firstChild.setAttribute('class','ft_slH_PID_right');
					}
				}
				catch (e) {
					Foxtrick.log(e);
				}
			}

			if (do_single_header && is_ignored && header.className == "cfHeader doubleLine") {
				wrapper.setAttribute('style','margin-bottom: 20px !important;');
			}
			if (do_single_header && !do_single_header_allways && !is_ignored) {
				if (header.className == "cfHeader doubleLine") {
					if (do_truncate_nicks) {
						var userName1 = poster_link1.textContent;
						if (userName1.length > trunclength) {
							poster_link1.setAttribute('longnick',poster_link1.textContent);
							poster_link1.textContent = userName1.substr(0,trunclength-2) +"..";
						}
						if (poster_link2) {
							var userName2 = poster_link2.textContent;
							if (userName2.length > trunclength) {
								poster_link2.setAttribute('longnick',poster_link2.textContent);
								poster_link2.textContent = userName2.substr(0,trunclength-2) +"..";
							}
						}
						if (league_link1) {
							var league_name1 = league_link1.textContent;
							if (league_name1.length > trunclength) {
								league_link1.textContent = league_name1.substr(0,trunclength-2) +"..";
							}
						}
						if (league_link2) {
							var league_name2 = league_link2.textContent;
							if (league_name2.length > trunclength) {
								league_link2.textContent = league_name2.substr(0,trunclength-2) +"..";
							}
						}
						if (header.offsetTop-header_right.offsetTop < -3 )  {
							header.setAttribute('class','cfHeader ftdoubleLine');
							Foxtrick.dump('do_truncate_nicks: adjust height back\n')
						}
					}
				}
			}  // end single header line

			// add default facecard ----------------------------
			if (do_default_facecard && user && !user_avatar) {
				var user_avatar = doc.createElement("div");
				user_avatar.className = "faceCard";
				user_avatar.style.backgroundImage = "url(\"/Img/Avatar/silhouettes/sil1.png\")";
				user.insertBefore(user_avatar,user.firstChild);
			}

			++num_wrapper;
		}
	}
});
