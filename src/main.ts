import { program } from "commander";
import { y2024d8p2 } from "./solutions/day8/solution";


program.action(() => {
  console.log(`Part 2: ${y2024d8p2()}`);
});

program.parse();
