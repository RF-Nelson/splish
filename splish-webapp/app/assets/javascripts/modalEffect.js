var ModalEffects = (function() {

	function init() {
		setTimeout(function () {

			var overlay = document.querySelector('.md-overlay');
			[].slice.call( document.querySelectorAll('.md-trigger')).forEach( function( el, i ) {
				var modal = document.querySelector('#' + el.getAttribute('data-modal') ),
					close = modal.querySelector('.md-close');

				function removeModal( hasPerspective ) {
					classie.remove(modal, 'md-show');

					if( hasPerspective ) {
						classie.remove(document.documentElement, 'md-perspective');
					}
				}

				function removeModalHandler() {
					setTimeout(function () {
						if (window.validEntry) {
							removeModal( classie.has(el, 'md-setperspective'));
						}
						window.validEntry = true;
					}, 100)
				}

				el.addEventListener('click', function( ev ) {
					window.validEntry = true;
					classie.add(modal, 'md-show');
					overlay.removeEventListener('click', removeModalHandler);
					overlay.addEventListener('click', removeModalHandler);
					$('body').on('keyup keypress', function(e) {
	          var keyCode = e.keyCode || e.which;
	          if (keyCode === 27) {
	            e.preventDefault();
							removeModalHandler();
	            return false;
	          }
	        });

					if( classie.has(el, 'md-setperspective')) {
						setTimeout( function() {
							classie.add(document.documentElement, 'md-perspective');
						}, 25 );
					}
				});

				close.addEventListener('click', function( ev ) {
					ev.stopPropagation();
					removeModalHandler();
				});

			} );
		}, 1000)
	}

	window.openEditModal = function() {
		var hideModal = function () {
			// setTimeout(function () {
				// if (window.validEntry) {
					$('#angular-triggered-modal').removeClass('md-show');
				// }
				// window.validEntry = true;
			// }, 200)
		}
		var overlay = document.querySelector('.md-overlay');
		var modal = $('#angular-triggered-modal').addClass('md-show')
		modal = modal[0]
		var close = modal.querySelector('.md-close');

		overlay.removeEventListener('click', function() {
			hideModal()
		});

		overlay.addEventListener('click', function() {
			hideModal()
		});

		$('body').on('keyup keypress', function(e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode === 27) {
				e.preventDefault();
				hideModal()
				return false;
			}
		});

		close.addEventListener('click', function( ev ) {
			ev.stopPropagation();
			hideModal()
		});
	}

	init();

})();
