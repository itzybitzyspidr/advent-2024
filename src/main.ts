import { program } from "commander";
import { y2024d12p1, y2024d12p2 } from "./solutions/day12/solution";

program.action(() => {
  console.log(y2024d12p2());
});

program.parse();
