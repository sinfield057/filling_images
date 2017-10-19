window.onload = function() {

  // Variable declarations
  var settingsObject = {
      numberOfImages: 0,
  }

  var numberInput   = document.getElementById( 'numeric' );
  var resizerRight  = document.getElementById( 'resizer-right' );
  var resizerLeft   = document.getElementById( 'resizer-left' );
  var box           = document.getElementById( 'box' );
  var submitNumber  = document.getElementById( 'submit-number' );
  var error         = document.getElementById( 'error' );

  var mousePosition       = 0;
  var differencePosition  = 0;
  var checkResizer        = false;
  var placeholderLink     = 'http://via.placeholder.com/';
  var imageValues         = [ 100, 200, 300, 400, 500 ];
  var imagesWidthSum      = 0;
  var imagesWidthArray    = [];

  // Resize function for vertical resize
  function resize( event ) {
      differencePosition = mousePosition - event.x;
      differencePosition = checkResizer ? differencePosition : -differencePosition;
      mousePosition = event.x;
      box.style.width = Math.max(
        parseInt( getComputedStyle( box, '' ).width ) + 2 * differencePosition,
        100 )
        + 'px';
  }

  resizerRight.addEventListener( 'mousedown', function( e ) {
    mousePosition = e.x;
    checkResizer = false;
    document.addEventListener( 'mousemove', resize, false );
    document.addEventListener( 'mousemove', arrangeImages, false );
  }, false );

  resizerLeft.addEventListener( 'mousedown', function( e ) {
    mousePosition = e.x;
    checkResizer = true;
    document.addEventListener( 'mousemove', resize, false );
    document.addEventListener( 'mousemove', arrangeImages, false );
  }, false );

  document.addEventListener( 'mouseup', function() {
    document.removeEventListener( 'mousemove', resize, false );
    document.removeEventListener( 'mousemove', arrangeImages, false );
  }, false );

  // Build images
  submitNumber.onclick = submitNumberFunc;
  function submitNumberFunc() {
    var value = parseInt( numberInput.value );
    if ( typeof value === 'number' && !isNaN( value ) ) {
      numberInput.value = value;
      settingsObject.numberOfImages = value;
      error.hidden = true;
      fetchImages( value );
    } else {
      error.hidden = false;
      numberInput.value = '';
    }
  }

  function clearImages() {
    var elements = document.getElementsByTagName( 'img' );
    while ( elements[ 0 ] ) {
      elements[ 0 ].parentNode.removeChild( elements[ 0 ] );
    }
  }

  function fetchImages( number ) {
    imagesWidthArray = [];
    clearImages();
    imagesWidthSum = 0;
    var counter = 0;

    // This is needed because we're fetching images from a different server
    // Each time an image will load, this will fire
    function incrementCounter() {
        counter++;
        if ( counter === number ) {

            // Sorting the images and placing them
            imagesWidthArray.sort( function( img1, img2 ) {
              return img2.width * img2.height - img1.width * img1.height;
            } );

            for ( var i = 0; i < number; i++ ) {
                var img = imagesWidthArray[ i ].img;
                box.appendChild( img );
            }

            arrangeImages();
            var hiddenImages = document.getElementsByTagName( 'img' );
            for ( var i = 0; i < hiddenImages.length; i++ ) {
              hiddenImages[ i ].hidden = false;
            }
        }
    }

    for ( var i = 0; i < number; i++ ) {
      // Need an anonymous function here.
      // By the time the images load, i would have been increased, so we need a copy.
      ( function( i ) {
        var img = new Image();
        img.hidden = true;
        img.onload = function() {
          imagesWidthSum += img.width;
          imagesWidthArray.push( {
            width: img.width,
            height: img.height,
            img: img
          } );
          incrementCounter();
        }

        img.src = placeholderLink +
                  imageValues[ Math.floor( Math.random() * 5 ) ] +
                  'x' +
                  imageValues[ Math.floor ( Math.random() * 5 ) ];

      } )( i );
    }
  }

  function arrangeImages() {
    var imageList = document.getElementsByTagName( 'img' );
    for ( var i = 0; i < imageList.length; i++ ) {
      var imageEl = imageList[ i ];
      imageEl.style.width =
                          imagesWidthArray[ i ].width *
                          parseInt( getComputedStyle( box, '' ).width ) /
                          imagesWidthSum
                          + 'px';
    }
  }

};
