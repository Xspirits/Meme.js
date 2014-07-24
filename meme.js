/*
Meme.js
=======

Original Code by BuddyMeme
Updated and extended by Robert Syvarth

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
		inited: false,
		canvasElem: null,
		canvasContext: null,
		srcImage: null,
		topText: '',
		bottomText: '',
		font: {
			fillStyle: 'white',
			strokeStyle: 'black',
			strokeWidth: 2,
			bold: false,
			font: 'Impact',
			fontSize: -1,
			textAlign: 'center',
			spacingMultiplier: 1.2
		},

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

			if( opts.font ) {
				_meme.setFont(opts.font);
			}

			_meme.inited = true;
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

			_meme.redraw();
		},

		setCanvasDimensions: function(w, h) {
			_meme.canvasElem.width = w;
			_meme.canvasElem.height = h;
		},

		setImage: function(image) {
			if (_meme.isString(image)) {
				var src = image;
				image = new Image();
				// image.crossOrigin = '';
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
			_meme.redraw();
		},

		setBottomText: function(text) {
			_meme.bottomText = text;
			_meme.redraw();
		},

		setFont: function(font) {
			for(var key in _meme.font) {
				_meme.font[key] = (typeof font[key] != 'undefined') ? font[key] : _meme.font[key];
			}
			_meme.redraw();
		},

		redraw: function() {
			if(!_meme.inited){ return false; }

			_meme.drawImage();
			_meme.drawText(_meme.topText, 'top');
			_meme.drawText(_meme.bottomText, 'bottom');
		},

		drawText: function(text, topOrBottom, y) {
			var canvas = _meme.canvasElem;
			var context = _meme.canvasContext;

			// Variable setup
			topOrBottom = topOrBottom || 'top';
			_meme.canvasContext.textBaseline = topOrBottom;

			var fontSize = _meme.getFontSize();
			var x = canvas.width / 2;

			if (typeof y === 'undefined') {
				y = topOrBottom === 'bottom' ? canvas.height : 0;
			}

			// Should we split it into multiple lines?
			if (context.measureText(text).width > canvas.width) {

				// Split word by word
				var words = text.split(' ');
				var wordsLength = words.length;

				// Start with the entire string, removing one word at a time. If
				// that removal lets us make a line, place the line and recurse with
				// the rest. Removes words from the back if placing at the top;
				// removes words at the front if placing at the bottom.
				if (topOrBottom === 'top') {
					var i = wordsLength;
					while (i --) {
						var justThis = words.slice(0, i).join(' ');
						if (context.measureText(justThis).width < (canvas.width * 1.0)) {
							_meme.drawText(justThis, topOrBottom, y);
							_meme.drawText(words.slice(i, wordsLength).join(' '), topOrBottom, y + fontSize);
							return;
						}
					}
				}
				else if (topOrBottom === 'bottom') {
					for (var i = 0; i < wordsLength; i ++) {
						var justThis = words.slice(i, wordsLength).join(' ');
						if (context.measureText(justThis).width < (canvas.width * 1.0)) {
							_meme.drawText(justThis, topOrBottom, y);
							_meme.drawText(words.slice(0, i).join(' '), topOrBottom, y - fontSize);
							return;
						}
					}
				}
			}

			// Draw!
			context.fillText(text, x, y, canvas.width * .95);
			context.strokeText(text, x, y, canvas.width * .95);
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
			_meme.canvasContext.fillStyle = _meme.font.fillStyle;
			_meme.canvasContext.strokeStyle = _meme.font.strokeStyle;
			_meme.canvasContext.lineWidth = _meme.font.strokeWidth;
			_meme.canvasContext.textAlign = _meme.font.textAlign;

			var bold = _meme.font.bold ? 'bold ' : '';
			var fontSize = _meme.getFontSize() * _meme.font.spacingMultiplier;
			_meme.canvasContext.font = bold + fontSize + 'px ' + _meme.font.font;
		},

		getFontSize: function() {
			return  _meme.font.fontSize == -1 ? (_meme.canvasElem.height / 8) : _meme.font.fontSize;
		},

		getImageData: function() {
			return _meme.canvasElem.toDataURL();
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
		setFont: 		_meme.setFont,
		redraw: 		_meme.redraw,
		getImageData: 	_meme.getImageData,
	}
};
