(function() {
  function init() {
    setTimeout(function () {
  		loader = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 400, easingIn : mina.easeinout } );
  		loader.show();
    }, 1000)

		setTimeout( function() {
			loader.hide();
      $('#page-content').addClass("show")
		}, 3000 );
	}
	init();
})();
