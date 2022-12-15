/*
hamurabi-Javascript
This is a modern JS reboot of the classic 1978 version of the BASIC Game

Copyright (C) 2021  Ron Perkins - <hello@ronperkins.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";

// preventDefault
window.addEventListener("keydown", function (event) {
  if ([32, 37, 38, 39, 40, 13].indexOf(event.keyCode) > -1) {
    event.preventDefault();
  }
}, false);

// Game object
let Game = {
  fps: 60,
  width: 800,
  height: 650
};

// Game state/ keyboard handler
const SUPPORTED_CHARS = ` '"1!2@3#4$5%67&8*9(0)-_=+qQwWeErRtTyYuUiIoOpP´\`[]{}~^çÇlLkKjJhHgGfFdDsSaA\\|zZxXcCvVbBnNmM,<.>;:/?`
let gameScreen = {}
gameScreen.keyListener = window.addEventListener("keydown", (event) => {
  if (SUPPORTED_CHARS.indexOf(event.key) != -1) {
    gameScreen.userInput += event.key;
  }
  if (event.key == "Backspace") {
    gameScreen.userInput = gameScreen.userInput.slice(0, gameScreen.userInput.length-1);
  } else if (event.key == "Enter") {
    gameScreen.apply();
  }
});

Game._onEachFrame = (() => {
  if (window.RequestAnimationFrame) {
   return (cb) => {
      let _cb = () => { cb(); window.RequestAnimationFrame(_cb)}
      _cb();
    };
  } else {
    return (cb) => {setInterval(cb, 1000 / Game.fps)}
  }
})();

// Game methods
Game.start = () => {
  Game.canvas = document.createElement("canvas"); // Create canvas
  Game.canvas.setAttribute("id", "game");
  Game.canvas.width = Game.width;
  Game.canvas.height = Game.height;

  document.getElementById("game-frame").appendChild(Game.canvas); // Add canvas to game-frame

  Game.ctx = Game.canvas.getContext("2d"); // Get canvas context
  Game.changeState(gameScreen)
  Game._onEachFrame(Game.run);
};

Game.changeState = screen => {
  Game.keyTimeout = Date.now() + 200;
  screen.init();
  Game.draw = screen.draw;
  Game.update = screen.update;
}

Game.run = (() => {
  let loops = 0, skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime(),
      lastGameTick;

  return () => {
    loops = 0;

    while ((new Date).getTime() > nextGameTick) {
      Game.update();
      nextGameTick += skipTicks;
      loops++;
    }

    if (loops) Game.draw();
  }
})();
