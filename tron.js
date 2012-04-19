/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function Tron(surface, color) {
	this.maxX = surface.width;
	this.maxY = surface.height;
  this.surface = surface;
  this.Init(color);
}

Tron.prototype.Init = function(color) {
  this.x = Math.floor(Math.random() * this.maxX);
	this.y = Math.floor(Math.random() * this.maxY);
  if (color) {
    this.c = color;
  } else {
    this.c = Math.floor(Math.random() * 256 * 256 * 256);
  }
	this.dir = Math.floor(Math.random() * 4);
  this.alive = 1;
}

Tron.prototype.MoveIt = function() {
  switch (this.dir) {
		case 0:
			this.x = (this.x + 1) % this.maxX;
			break;
		case 1:
			this.y = (this.y + 1) % this.maxY;
			break;
		case 2:
			this.x--;
			if (this.x < 0) {
				this.x += this.maxX;
			}
      break;
		case 3:
			this.y--;
			if (this.y < 0) {
				this.y += this.maxY;
			}
			break;
	}
}

Tron.prototype.Move = function() {
  if (this.alive) {
    var oldX = this.x;
    var oldY = this.y;
    this.MoveIt();
    if (this.surface.getPixel(this.x, this.y) > 0) {
      this.x = oldX;
      this.y = oldY;
      this.dir += Math.floor(Math.random() * 2) * 2 - 1;
      this.dir %= 4;
      if (this.dir < 0) {
        this.dir += 4;
      }
      this.MoveIt();
      if (this.surface.getPixel(this.x, this.y) > 0) {
        this.x = oldX;
        this.y = oldY;
        this.dir -= 2;
        this.dir %= 4;
        if (this.dir < 0) {
          this.dir += 4;
        }
        this.MoveIt();
        if (this.surface.getPixel(this.x, this.y) > 0) {
          this.alive = 0;
        }
      }
    }
    if (this.alive) {
      this.surface.plot(this.x, this.y, this.c);
    } else {
      this.Init(this.c);
    }
  }
}

var Trons = [];

Screen = {
	width: null,
	height: null,
	elem: null,
	context: null,
	imgd: null,
	pix: null,

	init: function(elementName) {
		this.elem = document.getElementById(elementName);
		if (!this.elem || !this.elem.getContext) {
			return;
		}
		this.context = this.elem.getContext('2d');
		if (!this.context || !this.context.putImageData) {
			return;
		}
		this.width = this.elem.width;
		this.height = this.elem.height;

		if (this.context.createImageData) {
			this.imgd = this.context.createImageData(this.width, this.height);
		} else if (this.context.getImageData) {
			this.imgd = this.context.getImageData(0, 0, this.width, this.height);
		} else {
			this.imgd = {'width' : this.width, 'height' : this.height, 'data' : new Array(this.width*h*4)};
		}
		this.pix = this.imgd.data;
	},

	plot: function(x, y, c) {
		var red = c >> 16;
		var green = ((c | 0xFF0000) ^ 0xFF0000) >> 8;
		var blue = ((c | 0xFFFF00) ^ 0xFFFF00);
		var idx = (y * this.height + x) * 4;
		this.pix[idx] = red;
		this.pix[idx+1] = green;
		this.pix[idx+2] = blue;
		this.pix[idx+3] = 255;
	},

  getPixel: function(x, y) {
    var idx = (y * this.height + x) * 4;
    return this.pix[idx] * 256 * 256 + this.pix[idx + 1] * 256 + this.pix[idx + 2];
  },

	show: function() {
		this.context.putImageData(this.imgd, 0, 0);
	}
}

function Statics(c) {
	for (var i = 0; i<c; i++) {
		Trons[i].Move();
	}
	Screen.show();
}

var numTrons = 500;

$(function() {
	Screen.init('tron');
  var nT = parseFloat(numTrons);
  var r1 = parseFloat(Math.floor(Math.random() * 256));
  var r2 = parseFloat(Math.floor(Math.random() * 256));
  var g1 = parseFloat(Math.floor(Math.random() * 256));
  var g2 = parseFloat(Math.floor(Math.random() * 256));
  var b1 = parseFloat(Math.floor(Math.random() * 256));
  var b2 = parseFloat(Math.floor(Math.random() * 256));
  var c = r1 * 256.0 * 256.0 + g1 * 256.0 + b1;
	for (var i=0; i < numTrons; i++) {
		Trons[i] = new Tron(Screen, Math.floor(c));
    c = Math.floor(r1 + (r2 - r1) * (i / nT)) * 256 * 256;
    c += Math.floor(g1 + (g2 - g1) * (i / nT)) * 256;
    c += Math.floor(b1 + (b2 - b1) * (i / nT));
	}
	setInterval(Statics, 1, numTrons);
});