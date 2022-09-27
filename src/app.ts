import P5 from "p5";
import "p5/lib/addons/p5.dom";

var sketch = (p: P5) => {
  let sandpiles: number[][];

  const fullscreen = false;
  const sqDim = 1000;
  const w = fullscreen ? p.windowWidth : sqDim;
  const h = fullscreen ? p.windowHeight : sqDim;

  const color = (grains: number) => {
    switch (grains) {
      case 0:
        return p.color("#FFF01C");
      case 1:
        return p.color("#E0A941");
      case 2:
        return p.color("#F56F3B");
      case 3:
        return p.color("#E03D80");
      default:
        return p.color(100, 100, 100);
    }
  };

  // This stack overflows...
  const toppleRecursive = (x: number, y: number) => {
    if (sandpiles[x][y] < 3) {
      sandpiles[x][y]++;
    } else {
      // topple sand to neighbors
      const neighborIndicies = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x: x, y: y + 1 },
        { x: x, y: y - 1 },
      ];

      sandpiles[x][y] -= 3;

      // Then call topple on each affected neighbor
      neighborIndicies.forEach((n) => {
        toppleRecursive(n.x, n.y);
      });

      // // Update toppling sand
      // neighborIndicies.forEach((n) => {
      //   sandpiles[n.x][n.y]++;
      // });
    }
  };

  const topple = () => {
    const newpiles = sandpiles.map<number[]>((arr) => arr.slice());

    for (let x = 0; x < sandpiles.length; x++) {
      for (let y = 0; y < sandpiles[x].length; y++) {
        if (sandpiles[x][y] > 3) {
          // topple sand to neighbors
          const neighborIndicies = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x: x, y: y + 1 },
            { x: x, y: y - 1 },
          ];

          // todo overflow?
          neighborIndicies.forEach((n) => {
            newpiles[n.x][n.y]++;
          });
          newpiles[x][y] -= 4;
        }
      }
    }
    sandpiles = newpiles;
  };

  p.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    p.createCanvas(w, h);

    sandpiles = new Array(w).fill(0).map((x) => new Array(h).fill(0));
    sandpiles[p.floor(w / 2)][p.floor(h / 2)] = 100;
  };

  if (fullscreen) {
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  }

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
    p.background(0);
    // for (let x = 0; x < 100; x++) {
    // topple();
    toppleRecursive(p.floor(w / 2), p.floor(h / 2));
    render();
    // makeFastTopple(sqDim)(sandpiles.flat())
    // }
  };
};

new P5(sketch);
