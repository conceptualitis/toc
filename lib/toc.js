!function ($) {
$.fn.toc = function (options) {
	var self = this,
		opts = $.extend({}, jQuery.fn.toc.defaults, options),
		clicked = false,
		wndw = $(window),
		doc = $(document),
		
		container = $(opts.container),
		headings = $(opts.selectors, container),
		headingOffsets = [],
		activeClassName = opts.prefix+'-active',
		timeout,

		scrollTo = function (e) {
			clicked = true;
			$('.' + activeClassName).removeClass(activeClassName);
			
			if (opts.smoothScrolling) {
				e.preventDefault();
				
				var elScrollTo = $(e.target).attr('href'),
					el = $(elScrollTo);
				
				$(opts.container).animate({ scrollTop: el.offset().top }, 400, 'swing', function() {
					location.hash = elScrollTo;

					//since we can have multiple <li>s pointing to the same anchor we select 'em by class
					$('.' + e.target.parentElement.className).addClass(activeClassName);
					clicked = false;
				});
			}
		},
		
		atPageBottom = function (e) {
			//was failing to fire a scroll event without the -1
			if (wndw.scrollTop() + wndw.height() >= doc.height() - 1) {
				return true;
			}
			return false;
		},

		//highlight on scroll
		highlightOnScroll = function (e) {
			if (!clicked && !atPageBottom()) {
				var top = wndw.scrollTop();
				for (var i = 0, c = headingOffsets.length; i < c; i++) {
					if (headingOffsets[i] >= top) {
						$('.' + activeClassName).removeClass(activeClassName);
						$('li:eq('+(i-1)+')', self).addClass(activeClassName);
						break;
					}
				}
			}
			else if (atPageBottom()) {
				$('.' + activeClassName).removeClass(activeClassName);
				$('.' + opts.prefix + '-wrap').find('li:last').addClass(activeClassName);
			}
		};

		if (opts.highlightOnScroll) {
			$(window).bind('scroll', highlightOnScroll);
		}


		return this.each(function () {
			//build TOC
			var el = $(this),
				ulBlob = '<ul class="' + opts.prefix + '-wrap">';
		
			headings.each(function (i) {
				var h = $(this);
				
				// append item blob
				ulBlob += '<li class="' + opts.prefix + '-' + h[0].tagName.toLowerCase() + '">'
						+ '<a href="#' + opts.prefix + i + '">' + h.text() + '</a></li>';
				
				// keeping the array from expanding through multiple iterations
				if (undefined === headingOffsets[i]) {
					headingOffsets[i] = h.offset().top - opts.highlightOffset;
				}
				
				//create anchor
				$('<span id="' + opts.prefix + i + '" />').insertBefore(h);
			});
			
			//delegate the clicks
			el.on("click", "li a", function (e) {
				scrollTo(e);
			});
			
			ulBlob += '</ul>';

			el[0].innerHTML = ulBlob;
		});
};


jQuery.fn.toc.defaults = {
  container: 'body',
  selectors: 'h1,h2,h3',
  smoothScrolling: true,
  prefix: 'toc',
  highlightOnScroll: true,
  highlightOffset: 100,
  pulldown: false
};

}(jQuery);
