import { program } from "commander";
import { y2024d17p1, y2024d17p2 } from "./solutions/day17/solution";

program.action(() => {
  console.log(y2024d17p2());
});

program.parse();
