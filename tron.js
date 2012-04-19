/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function Tron(maxX, maxY) {
	this.maxX = maxX;
	this.maxY = maxY;
	this.x = Math.floor(Math.random() * this.maxX);
	this.y = Math.floor(Math.random() * this.maxY);
	this.c = Math.floor(Math.random() * 256 * 256 * 256);
	this.dir = Math.floor(Math.random() * 4);
}

Tron.prototype.Move = function() {
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

	show: function() {
		this.context.putImageData(this.imgd, 0, 0);
	}
}

function Statics(c) {
	for (var i = 0; i<c; i++) {
		Trons[i].Move();
		Screen.plot(Trons[i].x, Trons[i].y, Trons[i].c);
	}
	Screen.show();
}


$(function() {
	Screen.init('tron');
	for (var i=0; i < 100; i++) {
		Trons[i] = new Tron(Screen.width, Screen.height);
	}
	setInterval(Statics, 1, 100);
});