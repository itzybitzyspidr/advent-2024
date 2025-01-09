import { program } from "commander";
import { y2024d19p1, y2024d19p2 } from "./solutions/day19/solution";

program.action(() => {
  console.log(y2024d19p2());
});

program.parse();
