/*
 *  Author: Aaron T. Grogg
 *	Contact: http://aarontgrogg.com/
 *	Purpose: Facebook's Timeline annoyingly crops images so that
 *	some times the most important part of the image cannot be seen,
 *	requiring you to click the image to view it.  But then when you
 *	come back to the Timeline, any infinite-scroll items will be gone,
 *	meaning you have to re-scroll to re-fetch them...
 *	This makes functionality Timeline images display fully, avoiding the issue.
 */

(function(){
	//	FB Timeline Fix, only run if in Timeline mode:
	if (document.body.className.match('timelineLayout')) {
	
		// this will get done on the initial click, and then either every time MutationObserver fires or the user clicks the Bookmarkelt again
		var fb_timeline_fix = function() {
			// grab all images in root and set-up variables
			var images = document.querySelectorAll('div.photoWrap img'),
				i = -1,
				len = images.length,
				image, src;
			// loop through all images...
			for (; ++i < len;) {
				// cache this one...
				image = images[i];
				// check if it has already been updated, if so skip
				if (!image.className.match('fb_timeline_fix')) {
					// mark as updated for next fix cycle
					image.className = 'fb_timeline_fix ' + image.className;
					// split the initial image SRC, and remove the size restrictions, the push back together as a string
					src = image.getAttribute('src').split('/');
					src.splice(4, 2);
					src = src.join('/');
					image.setAttribute('src', src);
					// remove the image's width & height attributes
					image.removeAttribute('width');
					image.removeAttribute('height');
					// and remove the image's parent's style attribute (restricts element's height)
					image.parentNode.removeAttribute('style');
				}
			}
		}
	
		// this only needs to happen once, so make sure we haven't already added it
		if (!document.getElementById('fb_timeline_fix')) {
			// create a <style> element & a couple variables
			var style = document.createElement('style'),
				textNode,
				css = '';
			// build the CSS as a string...
			css += '.fbTimelineTwoColumn .photoUnit .photoWidth1 .photoWrap{height:auto;}';
			css += 'div.uiScaledImageContainer img{width:403px;height:auto;min-width:0;min-height:0;max-width:100%;}'; // max-height:100%;
			// aconvert it to a textNode...
			textNode = document.createTextNode(css);
			// and append it to the <style> element
			style.appendChild(textNode);
			// add a couple attributes...
			style.setAttribute('id', 'fb_timeline_fix');
			style.setAttribute('rel', 'stylesheet');
			// and append it to the <head>
			document.querySelector('head').appendChild(style);
			void(0);
		}
	
		// let's get it started! (or, do it again, whatever the case may be...)
		fb_timeline_fix();
	
	//	"Mutated" (HA!, get it?) from: http://stackoverflow.com/questions/10868104/can-you-have-a-javascript-hook-trigger-after-a-dom-elements-style-object-change
		// try to build a MutationObserver
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
		// select the mutation target
			fb_mutation_target = document.querySelector('#timeline_tab_content'),
		// configuration of the observer (attributes, childList, and characterData are all required, and all have to be true...  so why aren't they hard-coded as defaults?)
			fb_mutation_config = { attributes: true, childList: true, characterData: true, subtree: true },
		// create an observer instance
			fb_mutation_observer = new MutationObserver(fb_timeline_fix);
	
		// pass in the target node, as well as the observer options
		fb_mutation_observer.observe(fb_mutation_target, fb_mutation_config);
	}
})();
