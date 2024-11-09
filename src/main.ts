import { program } from "commander";

program.action(() => {
  console.log('test action');
});

program.parse();
