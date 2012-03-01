!function ($) {
$.fn.toc = function (options) {
	var self = this,
		opts = $.extend({}, jQuery.fn.toc.defaults, options),
		
		container = $(opts.container),
		headings = $(opts.selectors, container),
		headingOffsets = [],
		activeClassName = opts.prefix+'-active',
		timeout,

		scrollTo = function (e) {
			if (opts.smoothScrolling) {
				e.preventDefault();
				
				var elScrollTo = $(e.target).attr('href'),
					$el = $(elScrollTo);
				
				$(opts.container).animate({ scrollTop: $el.offset().top }, 400, 'swing', function() {
					location.hash = elScrollTo;
				});
			}
			$('li', self).removeClass(activeClassName);
			$(e.target).parent().addClass(activeClassName);
		},

		//highlight on scroll
		highlightOnScroll = function (e) {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(function () {
				var top = $(window).scrollTop();
				for (var i = 0, c = headingOffsets.length; i < c; i++) {
					if (headingOffsets[i] >= top) {
						$('li', self).removeClass(activeClassName);
						$('li:eq('+(i-1)+')', self).addClass(activeClassName);
						break;
					}
				}
			}, 50);
		};

		if (opts.highlightOnScroll) {
			$(window).bind('scroll', highlightOnScroll);
			highlightOnScroll();
		}


		return this.each(function () {
			//build TOC
			var ul = $('<ul/>'),
				el = $(this);
		
			headings.each(function (i, heading) {
				var h = $(heading);
				
				// generate, bind click and append list item
				$('<li class="' + opts.prefix + '-' + h[0].tagName.toLowerCase() + '">'
					+ '<a href="#' + opts.prefix + i + '">' + h.text() + '</a></li>')
					.bind('click', scrollTo)
					.appendTo(ul);
				
				// keeping the array from expanding in through multiple iterations
				if (undefined === headingOffsets[i]) {
					headingOffsets[i] = h.offset().top - opts.highlightOffset;
				}
				
				//create anchor
				$('<span id="' + opts.prefix + i + '" />').insertBefore(h);
			});
			
			console.log(headingOffsets);

			el.html(ul);
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
