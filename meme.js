/*
Meme.js
=======

Use one function to generate a meme.

You can call it all with strings:

     Meme('dog.jpg', 'canvasID', 'Buy pizza, 'Pay in snakes');

Or with a selected canvas element:

     var canvas = document.getElementById('canvasID');
     Meme('wolf.jpg', canvas, 'The time is now', 'to take what\'s yours');

Or with a jQuery/Zepto selection:

     Meme('spidey.jpg', $('#canvasID'), 'Did someone say', 'Spiderman JS?');

You can also pass in an image:

     var img = new Image();
     img.src = 'insanity.jpg';
     var can = document.getElementById('canvasID');
     Meme(img, can, 'you ignore my calls', 'I ignore your screams of mercy');

********************************************************************************

Copyright (c) 2012 BuddyMeme

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


window.Meme = function(opts){
	var _meme = {
		canvasElem: null,
		canvasContext: null,
		srcImage: null,
		topText: '',
		bottomText: '',

		construct: function(opts) {
			if( opts.canvas ) { 
				_meme.setCanvas(opts.canvas);
			}

			if( opts.image ) {
				_meme.setImage(opts.image);
			}

			if( opts.topText ) {
				_meme.setTopText(opts.topText);
			}

			if( opts.bottomText ) {
				_meme.setBottomText(opts.bottomText);
			}
		},

		setCanvas: function(canvas) {
			//If we have a string or jQuery element, get the DOM object
			if (_meme.isString(canvas)) { 
				canvas = document.getElementById(canvas);
			} else if (typeof $ == 'object' && (canvas instanceof $)) { 
				canvas = canvas[0];
			}

			if (!(canvas instanceof HTMLCanvasElement)) {
				throw new Error('Invalid canvas');
			}

			_meme.canvasElem = canvas;
			_meme.canvasContext = canvas.getContext('2d');

			//When we make a new canvas we have to set the font for it
			_meme.resetFont();
		},

		setCanvasDimensions: function(w, h) {
			_meme.canvasElem.width = w;
			_meme.canvasElem.height = h;
		},

		setImage: function(image) {
			if (_meme.isString(image)) {
				var src = image;
				image = new Image();
				image.src = src;
			}

			if (!(image instanceof Image)) {
				throw new Error('Invalid image');
			}

			_meme.srcImage = image;
			_meme.srcImage.addEventListener('load', _meme.imageLoaded);
		},

		setTopText: function(text) {
			_meme.topText = text;
		},

		setBottomText: function(text) {
			_meme.bottomText = text;
		},

		redraw: function() {
			_meme.drawImage();
			_meme.drawText(_meme.topText, 'top');
			_meme.drawText(_meme.bottomText, 'bottom');
		},

		drawText: function(text, topOrBottom, y) {
			var canvas = _meme.canvasElem;
			var context = _meme.canvasContext;

			// Variable setup
			topOrBottom = topOrBottom || 'top';
			var fontSize = (canvas.height / 8);
			var x = canvas.width / 2;
			if (typeof y === 'undefined') {
				y = fontSize;
				if (topOrBottom === 'bottom') {
					y = canvas.height - 10;
				}
			}

			// Should we split it into multiple lines?
			// if (context.measureText(text).width > (canvas.width * 1.1)) {

			// 	// Split word by word
			// 	var words = text.split(' ');
			// 	var wordsLength = words.length;

			// 	// Start with the entire string, removing one word at a time. If
			// 	// that removal lets us make a line, place the line and recurse with
			// 	// the rest. Removes words from the back if placing at the top;
			// 	// removes words at the front if placing at the bottom.
			// 	if (topOrBottom === 'top') {
			// 		var i = wordsLength;
			// 		while (i --) {
			// 			var justThis = words.slice(0, i).join(' ');
			// 			if (context.measureText(justThis).width < (canvas.width * 1.0)) {
			// 				drawText(justThis, topOrBottom, y);
			// 				drawText(words.slice(i, wordsLength).join(' '), topOrBottom, y + fontSize);
			// 				return;
			// 			}
			// 		}
			// 	}
			// 	else if (topOrBottom === 'bottom') {
			// 		for (var i = 0; i < wordsLength; i ++) {
			// 			var justThis = words.slice(i, wordsLength).join(' ');
			// 			if (context.measureText(justThis).width < (canvas.width * 1.0)) {
			// 				drawText(justThis, topOrBottom, y);
			// 				drawText(words.slice(0, i).join(' '), topOrBottom, y - fontSize);
			// 				return;
			// 			}
			// 		}
			// 	}
			// }

			// Draw!
			context.fillText(text, x, y, canvas.width * .9);
			context.strokeText(text, x, y, canvas.width * .9);
		},

		imageLoaded: function() {
			_meme.redraw();
		},

		drawImage: function() {
			var image = _meme.srcImage;

			_meme.setCanvasDimensions(image.width, image.height);
			_meme.canvasContext.drawImage(image, 0, 0);

			_meme.resetFont();
		},

		resetFont: function() {
			// Set up text variables
			_meme.canvasContext.fillStyle = 'white';
			_meme.canvasContext.strokeStyle = 'black';
			_meme.canvasContext.lineWidth = 2;
			var fontSize = (canvas.height / 8);
			_meme.canvasContext.font = fontSize + 'px Impact';
			_meme.canvasContext.textAlign = 'center';
		},

		isString: function(val) {
			return typeof val == 'string' || val instanceof String;
		}
	};

	_meme.construct(opts);

	return {
		setCanvas: 		_meme.setCanvas,
		setImage: 		_meme.setImage,
		setTopText: 	_meme.setTopText,
		setBottomText: 	_meme.setBottomText,
		redraw: 		_meme.redraw,
	}
};
