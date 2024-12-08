import { program } from "commander";
import { y2024d8p2 } from "./solutions/day8/solution";
import { getInputAsGrid } from "./helpers/read-inputs";


program.action(() => {
  console.log(getInputAsGrid(8).body);
});

program.parse();
