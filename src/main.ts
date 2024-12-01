import { program } from "commander";

import { y2024d1p1, y2024d1p2 } from "./solutions/day1/solution";

program.action(() => {
  console.log(y2024d1p2());
});

program.parse();
