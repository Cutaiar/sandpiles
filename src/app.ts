import P5 from "p5";
import "p5/lib/addons/p5.dom";

var sketch = (p: P5) => {
  let sandpiles: number[][];

  const toppleThreshold = 3;
  const initialGrainsInCenter = 1000000;
  const numIterationsPerDraw = 10;

  const color = (numGrains: number) => {
    switch (numGrains) {
      case 0:
        return p.color("white");
      case 1:
        return p.color("#333333");
      case 2:
        return p.color("black");
      case 3:
        return p.color("#222222");
      default:
        return p.color(100, 100, 100);
    }
  };

  // todo x y recursive
  const topple = () => {
    const newpiles = sandpiles.map<number[]>((arr) => arr.slice());

    for (let x = 0; x < sandpiles.length; x++) {
      for (let y = 0; y < sandpiles[x].length; y++) {
        if (sandpiles[x][y] > toppleThreshold) {
          // topple sand to neighbors
          const neighborIndicies = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
          ];

          // todo overflow?
          neighborIndicies.forEach((xy) => {
            newpiles[xy[0]][xy[1]]++;
          });
          newpiles[x][y] -= 4;
        }
      }
    }
    sandpiles = newpiles;
  };

  p.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    p.createCanvas(p.windowWidth, p.windowHeight);

    sandpiles = new Array(p.windowWidth)
      .fill(0)
      .map((x) => new Array(p.windowHeight).fill(0));
    sandpiles[p.floor(p.windowWidth / 2)][
      p.floor(p.windowHeight / 2)
    ] = initialGrainsInCenter;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  const render = () => {
    p.loadPixels();
    for (let x = 0; x < sandpiles.length; x++) {
      for (let y = 0; y < sandpiles[x].length; y++) {
        p.set(x, y, color(sandpiles[x][y]));
      }
    }
    p.updatePixels();
  };

  p.draw = () => {
    p.background("white");
    render();
    for (let x = 0; x < numIterationsPerDraw; x++) {
      topple();
    }
  };

  p.keyPressed = () => {
    if (p.key = " ") {
      p.saveCanvas('sandpile', 'png')
    }
  }
};

new P5(sketch);
