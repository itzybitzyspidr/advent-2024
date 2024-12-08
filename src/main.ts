import { program } from "commander";
import { y2024d8p2 } from "./solutions/day8/solution";
import { getInputAsGrid } from "./helpers/read-inputs";
import { countSpecific } from "./helpers/math";


program.action(() => {
  const arr = [
    {
      a: 'bean'
    },
    {
      a: 'bean'
    },
    {
      a: 'wolf'
    }
  ];
  console.log(countSpecific(arr, 'bean', { compareProp: 'a' }))
});

program.parse();
