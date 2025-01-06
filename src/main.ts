import { program } from "commander";
import { y2024d16p1 } from "./solutions/day16/solution";
import { y2024d16p2 } from "./solutions/day16/solution2";

program.action(() => {
  console.log(y2024d16p2());
});

program.parse();
