import { program } from "commander";

program.action(() => {
  console.log('You did it.');
});

program.parse();
