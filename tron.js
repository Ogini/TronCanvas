/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function Tron(surface, color) {
	this.maxX = surface.width;
	this.maxY = surface.height;
	this.surface = surface;

	this.Init = function(color) {
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

	this.MoveIt = function() {
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

	this.Move = function() {
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

	this.Init(color);
}

var Trons = [];
var numTrons = 500;

function runTron() {
	if (Screen.running) {
		Screen.stopIt();
	} else {
		Screen = new mwScreen('tron');

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

		Screen.callBack = function () {
			for (var i = 0; i<numTrons; i++) {
				Trons[i].Move();
			}
			Screen.show();
		}
		Screen.run();
	}
}