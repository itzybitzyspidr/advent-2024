import { program } from "commander";
import { getConfigVars } from "./helpers/getInput";

program.action(() => {
  getConfigVars();
});

program.parse();
