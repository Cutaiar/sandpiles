import P5 from "p5";
import "p5/lib/addons/p5.dom";
import * as dat from 'dat.gui';

/** Self contained P5 sandpile simulation */
var sketch = (p: P5) => {
  let sandpiles: number[][];

  const toppleThreshold = 3; // Note: if this changes, more colors should be added to visualize
  const initialGrainsInCenter = 1000000;

  const color = (index: number): P5.Color => p.color(Object.values(control.colors)[index % 4])

  const control = {
    colors: {
      c0:  "#ffffff",
      c1: "#333333",
      c2: "#000000",
      c3: "#222222",
    },
    loop: true,
    numIterationsPerDraw: 10,
    // Function to save the current frame for use in other places
    saveCanvas: () => p.saveCanvas('sandpile', 'png'),
    // Function to save the current state of the sandpile as a file for loading later
    saveState: () => p.saveJSON(sandpiles, "sandpiles"),
    // Quick and dirty json load, not exemplary
    loadState: async () => {
      const [file] = await (window as any).showOpenFilePicker({
        types: [
          {
            accept: {"application/json": ".json"}
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      })
      const f = await file.getFile()
      const reader = new FileReader();
      reader.onload = (function(theFile) {
        return (e) => {
         const j = JSON.parse(e.target.result as string);
         sandpiles = j
        };
      })(f);
      reader.readAsText(f);
    },
  }

  /**
   * The meat and potatoes of the program. This is the algorithm which takes the current state of the sandpile and applies our toppling rule.
   * Note: this could be far more efficient
   */
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

    // const w = p.windowWidth
    // const h = p.windowHeight
    const w = 200
    const h = 200

    p.createCanvas(w, h);

    // Set up sandpile initial state
    sandpiles = new Array(w)
      .fill(0)
      .map((x) => new Array(h).fill(0));
    sandpiles[p.floor(w / 2)][
      p.floor(h / 2)
    ] = initialGrainsInCenter;

    // Set up GUI
    let gui = new dat.GUI()
    gui.addColor(control.colors, "c0")
    gui.addColor(control.colors, "c1")
    gui.addColor(control.colors, "c2")
    gui.addColor(control.colors, "c3")
    gui.add(control, "loadState").name("Load State")
    gui.add(control, "saveState").name("Save State")
    gui.add(control, "saveCanvas").name("Save Canvas")
    gui.add(control, "loop").onChange((v)=> v ? p.loop() : p.noLoop())
    gui.add(control, "numIterationsPerDraw", 1, 1000).name("Iterations")
  };

  /**
   * Set the canvas' pixels according to the sandpile and the color function.
   */
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
    for (let x = 0; x < control.numIterationsPerDraw; x++) {
      topple();
    }
  };
};

new P5(sketch);
