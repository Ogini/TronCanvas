/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function mwScreen(elementName) {
	this.width = null;
	this.height = null;
	this.elem = null;
	this.context = null;
	this.imgd = null;
	this.pix = null;
	this.isValid = false;
	this.frameRate = 30;
	this.frameTime = null;
	this.callBack = null;
	this.running = false;
	this.intervalId = null;

	this.init = function(elementName) {
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
		this.isValid = true;
	}

	this.plot = function(x, y, c) {
		if (!this.isValid) return;
		var red = c >> 16;
		var green = ((c | 0xFF0000) ^ 0xFF0000) >> 8;
		var blue = ((c | 0xFFFF00) ^ 0xFFFF00);
		var idx = (y * this.height + x) * 4;
		this.pix[idx] = red;
		this.pix[idx+1] = green;
		this.pix[idx+2] = blue;
		this.pix[idx+3] = 255;
	}

	this.getPixel = function(x, y) {
		if (!this.isValid) return 0;
		var idx = (y * this.height + x) * 4;
		return this.pix[idx] * 256 * 256 + this.pix[idx + 1] * 256 + this.pix[idx + 2];
	}

	this.show = function() {
		if (!this.isValid) return;
		if (this.frameCheck()) {
			this.context.putImageData(this.imgd, 0, 0);
		}
	}

	this.frameCheck = function() {
		var d = new Date();
		var t = d.getTime();
		if (t - this.frameTime > 1000 / this.frameRate) {
			this.frameTime = t;
			return true;
		}
		return false;
	}

	this.run = function() {
		this.running = true;
		var d = new Date();
		this.frameTime = d.getTime();
		if (this.callBack) {
			this.intervalId = setInterval(this.callBack, 1);
		}
	}

	this.stopIt = function() {
		this.running = false;
		this.isValid = false;
		clearInterval(this.intervalId);
	}

	this.init(elementName);
}