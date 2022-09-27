import P5 from "p5";
import "p5/lib/addons/p5.dom";

var sketch = (p: P5) => {
  let sandpiles: number[][][];

  const sqDim = 100;
  const w = sqDim;
  const h = sqDim;
  const d = sqDim;

  const boxWidth = 5;
  const padding = 0;
  const drawOffset = boxWidth + padding;

  const sourceGrains = 100000;

  const color = (grains: number) => {
    switch (grains) {
      case 0:
        return "rgba(255, 255, 255, 0)"; // these aren't drawn anyway
      case 1:
        return "blue";
      case 2:
        return "green";
      case 3:
        return "yellow";
      case 4:
        return "orange";
      case 5:
        return "red";
      case 6:
        return "white";
      default:
        return "white";
    }
  };

  const topple = () => {
    const newpiles = sandpiles.map<number[][]>((arr) =>
      arr.map((arr2) => arr2.slice())
    );

    for (let x = 0; x < sandpiles.length; x++) {
      for (let y = 0; y < sandpiles[x].length; y++) {
        for (let z = 0; z < sandpiles[x][y].length; z++) {
          if (sandpiles[x][y][z] > 5) {
            // topple sand to neighbors
            const neighborIndicies = [
              [x, y, z - 1],
              [x, y, z + 1],
              [x, y + 1, z],
              [x, y - 1, z],
              [x + 1, y, z],
              [x - 1, y, z],
            ];

            neighborIndicies.forEach((xyz) => {
              if (
                xyz[0] < w &&
                xyz[1] < h &&
                xyz[2] < d &&
                xyz[0] >= 0 &&
                xyz[1] >= 0 &&
                xyz[2] >= 0
              ) {
                newpiles[xyz[0]][xyz[1]][xyz[2]]++;
              }
            });
            newpiles[x][y][z] -= 6;
          }
        }
      }
    }
    sandpiles = newpiles;
  };

  p.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);

    sandpiles = new Array(w)
      .fill(0)
      .map((x) => new Array(h).fill(0).map((y) => new Array(d).fill(0)));
    sandpiles[p.floor(w / 2)][p.floor(h / 2)][p.floor(d / 2)] = sourceGrains;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  const render = () => {
    for (let x = 0; x < sandpiles.length; x++) {
      for (let y = 0; y < sandpiles[x].length; y++) {
        for (let z = 0; z < sandpiles[x][y].length; z++) {
          // draw cube
          const _x = x * drawOffset;
          const _y = y * drawOffset;
          const _z = z * drawOffset;

          const grains = sandpiles[x][y][z];

          if (grains > 0) {
            p.push();
            p.translate(_x, _y, _z);
            p.stroke(100, 100, 100, 5);
            p.strokeWeight(0.5);
            p.fill(color(grains));
            p.box(boxWidth);
            p.pop();
          }
        }
      }
    }
  };

  const drawBorder = () => {
    p.push();
    p.stroke(100, 100, 100, 5);
    p.strokeWeight(0.5);
    p.noFill();
    p.box(drawOffset * sandpiles.length);
    p.pop();
  };

  p.draw = () => {
    p.background(0);
    p.rotateY(p.millis() / 6000);
    drawBorder();

    // p.frameRate(5);
    p.translate(
      -(w * drawOffset) / 2,
      -(h * drawOffset) / 2,
      -(d * drawOffset) / 2
    );

    render();
    for (let x = 0; x < 10; x++) {
      topple();
    }
  };
};

new P5(sketch);
