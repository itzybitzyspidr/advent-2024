import { program } from "commander";
import { y2024d9p1, y2024d9p2 } from "./solutions/day9/solution";

program.action(() => {
  console.log(y2024d9p2());
});

program.parse();
