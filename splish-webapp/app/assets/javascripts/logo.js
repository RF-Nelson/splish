(function() {
  setTimeout(function () {

  	function isOdd(n) {
  		return Math.abs(n % 2) == 1;
  	}

  	function randomIntFromInterval(min,max) {
  		return Math.floor(Math.random()*(max-min+1)+min);
  	}

  	var options = [
  		{
  			size : 200,
  			weight : 15,
  			color: '#3F51B5',
  			duration: 2,
  			fade: 5,
  			delay: 0.4,
  			easing: d3_ease.easeExpInOut.ease
  		},
      {
  			size : 80,
  			weight : 10,
  			color: '#3F51B5',
  			duration: 1.5,
  			fade: 5,
  			delay: 0.3,
  			easing: d3_ease.easeExpInOut.ease
  		}
  	],

  	items = [].slice.call(document.querySelectorAll('.list__item'));

  	function init() {

  		items.forEach(function(item, pos) {
  			var word = item.querySelector('.list__text'),
  				playCtrl = item.querySelector('.control__button--play'),
  				// initialize the plugin
  				instance = new Letters(word, options[pos]),
  				endPlayCallback = function() {
  					playCtrl.className = 'control__button control__button--play';
  					word.setAttribute('data-state', 'stop');
  				};

  			instance.showInstantly();

  			var timelines = {};

  			if ( pos === 7 ) {
  				var letters = [].slice.call(word.querySelectorAll('svg')),
  					lettersTotal = letters.length,
  					distanceFactor = 80,
  					halfLen = lettersTotal/2;

  				timelines[pos+1] = new mojs.Timeline();

  				letters.forEach(function(letter, i) {
  					var tx = isOdd(lettersTotal) ? -1 * (Math.floor(halfLen) - i) * distanceFactor : -1 * (halfLen - i) * distanceFactor + distanceFactor/2,
  						tween = new mojs.Tween({
  							duration : 2000,
  							easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
  							onUpdate: function(progress) {
  								letter.style.WebkitTransform = letter.style.transform = 'translate3d(' + tx * (1-progress) + '%,0,0) scale3d(' + progress + ',' + progress + ',1)';
  							}
  						});

  					timelines[pos+1].add(tween);
  				});
  			}
  			else if ( pos === 8 ) {
  				var letters = [].slice.call(word.querySelectorAll('svg')),
  					lettersTotal = letters.length,
  					distanceFactor = 40;

  				timelines[pos+1] = new mojs.Timeline();

  				letters.forEach(function(letter, i) {
  					var ty = -1 * distanceFactor * (lettersTotal - i)
  						tween = new mojs.Tween({
  							duration : 2000,
  							delay: 50 + 50*i,
  							easing: mojs.easing.elastic.out,
  							onUpdate: function(progress) {
  								letter.style.WebkitTransform = letter.style.transform = 'translate3d(0,' + ty * (1-progress) + '%,0)';
  							}
  						});

  					timelines[pos+1].add(tween);
  				});
  			}
  			else if ( pos === 9 ) {
  				var letters = [].slice.call(word.querySelectorAll('svg')),
  					distanceFactor = 60;

  				timelines[pos+1] = new mojs.Timeline();

  				letters.forEach(function(letter, i) {
  					var tween = new mojs.Tween({
  							duration : 1500,
  							delay: 100 + 100*i,
  							easing: mojs.easing.bounce.out,
  							onUpdate: function(progress) {
  								letter.style.WebkitTransform = letter.style.transform = 'translate3d(0,' + distanceFactor * (1-progress) + '%,0)';
  							}
  						});

  					timelines[pos+1].add(tween);
  				});
  			}
  			else if( pos === 10 ) {
  				var letters = [].slice.call(word.querySelectorAll('svg')),
  					wordRect = word.getBoundingClientRect(),
  					wordWidth = wordRect.width,
  					wordHeight = wordRect.height,
  					letterOffsetPosition = 0;

  				timelines[pos+1] = new mojs.Timeline();

  				letters.forEach(function(letter, i) {
  					var letterRect = letter.getBoundingClientRect(),
  						letterWidth = letterRect.width,
  						letterHeight = letterRect.height,
  						letterWidthPercentage = letterWidth*100/wordWidth;

  					letterOffsetPosition += letterWidthPercentage;

  					var burst = new mojs.Burst({
  						parent: word,
  						duration: 1000,
  						delay: 600 + 115*i,
  						shape : 'circle',
  						fill : '#E65454',
  						x: letterOffsetPosition + '%',
  						y: randomIntFromInterval(20, 80) + '%',
  						childOptions: {
  							radius: {'rand(90,20)':0}
  						},
  						radius: {50:160},
  						opacity: 0.3,
  						count: randomIntFromInterval(5,20),
  						isSwirl: true,
  						isRunLess: true,
  						easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
  					});

  					timelines[pos+1].add(burst);
  				});
  			}
  			else if( pos === 11 ) {
  				var letters = [].slice.call(word.querySelectorAll('svg')),
  					wordRect = word.getBoundingClientRect(),
  					wordWidth = wordRect.width,
  					letterOffsetPosition = 0;

  				timelines[pos+1] = new mojs.Timeline();

  				letters.forEach(function(letter, i) {
  					var letterRect = letter.getBoundingClientRect(),
  						letterWidth = letterRect.width,
  						letterHeight = letterRect.height,
  						letterWidthPercentage = letterWidth*100/wordWidth;

  					letterOffsetPosition += letterWidthPercentage;

  					var ring = new mojs.Transit({
  						parent: word,
  						duration: 800,
  						delay: 550 + 200*i,
  						type: 'circle',
  						radius: {0: letterHeight/2},
  						fill: 'transparent',
  						stroke: '#9091CE',
  						strokeWidth: {40:0},
  						opacity: 1,
  						x: letterOffsetPosition - letterWidthPercentage/2 + '%',
  						y: '50%',
  						isRunLess: true,
  						easing: mojs.easing.bezier(0.2, 1, 0.3, 1)
  					})

  					timelines[pos+1].add(ring);
  				});
  			}

        $('.input__field').on('keyup keypress', function(e) {
          var keyCode = e.keyCode || e.which;
          if (keyCode === 13) {
            e.preventDefault();
            return false;
          }
        });

        setTimeout(function () {

          var placeSearch, autocomplete;


            // Create the autocomplete object, restricting the search to geographical
            // location types.
            autocompleteEdit = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('autocompleteEdit')),
                {types: ['geocode']});


          function fillInAddress() {
            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();

            for (var component in componentForm) {
              document.getElementById(component).value = '';
              document.getElementById(component).disabled = false;
            }
          }
        }, 500)

  			playCtrl.addEventListener('click', function() {
  				if( word.getAttribute('data-state') === 'play' ) {
  					return false;
  				}
  				word.setAttribute('data-state', 'play');
  				playCtrl.className = 'control__button control__button--play control__button--active';

  				if( pos === 6 ) { // showcase how to undraw with an animation
  					instance.hide({
  						callback: function() {
  							setTimeout(function() {
  								instance.show({
  									duration : 0.35,
  									delay : [0,0.1,0.2,0.3,0.4,0.5],
  									fade : .35,
  									individualDelays : true,
  									easing : d3_ease.easePolyOut.ease,
  									callback : endPlayCallback
  								});
  							}, 300);
  						}
  					});
  				}
  				// showcase with animations using mo.js lib:
  				else if( pos === 7 || pos === 8 || pos === 10 ) {
  					instance.hideInstantly();
  					timelines[pos+1].start();
  					instance.show({callback : endPlayCallback});
  				}
  				else if( pos === 9 ) {
  					instance.hide({
  						duration: 0.6, delay: 0.1, easing: d3_ease.easeExpOut.ease,
  						callback: function() {
  							timelines[pos+1].start();
  							instance.show({callback : endPlayCallback});
  						}
  					});
  				}
  				else if( pos === 11 ) {
  					instance.hide({
  						duration: 0.6, delay: 0, fade: 0.6,
  						easing: d3_ease.easeExpOut.ease,
  						callback: function() {
  							timelines[pos+1].start();
  							instance.show({callback : endPlayCallback});
  						}
  					});
  				}
  				// default behaviour
  				else {
  					instance.hideInstantly();
  					instance.show({callback: endPlayCallback});
  				}
  			});
  		});
  	}

  	init();

  }, 500)

})();
