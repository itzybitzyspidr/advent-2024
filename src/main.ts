import { program } from "commander";
import { y2024d22p2 } from "./solutions/day22/solution";

program.action(() => {
  console.log(y2024d22p2());
});

program.parse();
