import { program } from "commander";
import { isSorted } from "./helpers/algorithms";

program.action(() => {
  const randomBs = [
    { a: 1, b: 7 },
    { a: 2, b: 6 },
    { a: 3, b: 5 },
    { a: 4, b: 4 },
    { a: 5, b: 3 },
    { a: 6, b: 2 },
    { a: 7, b: 1 },
  ];

  console.log('checking "a" ascending');
  console.log(isSorted(randomBs, {compareProp: 'a', dir: 'asc'}));
  
  console.log('checking "a" descending');
  console.log(isSorted(randomBs, {compareProp: 'a', dir: 'desc'}));
  
  console.log('checking "b" ascending');
  console.log(isSorted(randomBs, {compareProp: 'b', dir: 'asc'}));
  
  console.log('checking "b" descending');
  console.log(isSorted(randomBs, {compareProp: 'b', dir: 'desc'}));
});

program.parse();
