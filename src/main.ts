import { program } from "commander";
import { y2024d2p1, y2024d2p2 } from "./solutions/day2/solution";
import { y2024d3p1, y2024d3p2 } from "./solutions/day3/solution";

program.action(() => {
  console.log(y2024d3p2());
});

program.parse();
