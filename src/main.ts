import { program } from "commander";
import { y2024d13p1, y2024d13p2 } from "./solutions/day13/solution";
import { y2024d14p1 } from "./solutions/day14/solution";

program.action(async () => {
  await y2024d14p1();
});

program.parse();
