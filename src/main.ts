import { program } from "commander";
import { d7p1 } from "./previous-years/2015/solutions/day7/solution";

program.action( async () => {
  console.log(d7p1());
});

program.parse();
