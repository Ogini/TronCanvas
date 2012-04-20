/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function Life(surface) {
	this.maxX = surface.width;
	this.maxY = surface.height;
	this.surface = surface;

	this.Init = function() {
		for (var x = 0; x < this.maxX; x++) {
			for (var y = 0; y < this.maxY; y++) {
				this.surface.plot(x, y, 255*255*255);
			}
		}
	}

	this.generate = function() {

	}

	this.Init();
}

function runLife() {
	if (Screen.running) {
		Screen.stopIt();
	} else {
		Screen = new mwScreen('tron');
		Conway = new Life(Screen);
		Screen.callBack = function() {
			Conway.generate();
			Screen.show();
		}
		Screen.run();
	}
}