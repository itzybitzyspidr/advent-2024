import { program } from "commander";
import { d6p1 } from "./previous-years/2015/solutions/day6/solution";

program.action( async () => {
  console.log(d6p1());
});

program.parse();
