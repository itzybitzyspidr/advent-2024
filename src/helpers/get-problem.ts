import { configDotenv } from "dotenv";
import { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import { createWriteStream, mkdirSync, readdirSync } from 'node:fs';
import prompt from 'prompt'

export interface IInputFetchOptions {
  /**
   * Writes new input file even if previous version exists. Defaults to false.
   */
  replace?: boolean;
}

interface ICLIResponse {
  year: number,
  day: number,
  replace: boolean,
};

async function fetchInput(year: number, day: number): Promise<string> {
  configDotenv();
  const config: AxiosRequestConfig = {
    baseURL: 'https://adventofcode.com/',
    headers: {
      'Cookie': process.env['COOKIE'],
    }, 
  };

  const axios = new Axios(config);

  const input: AxiosResponse<string> = await axios.get(`${year}/day/${day}/input`);
  return input.data;
}

export async function createInputFile(year: number, day: number, options?: IInputFetchOptions): Promise<void> {
  const basePath = './src/inputs'
  const days = readdirSync(basePath);
  if (!days.includes(`day${day}`)) {
    mkdirSync(`./src/inputs/day${day}`);
  }

  const files = readdirSync(`${basePath}/day${day}`);
  if (files.includes('raw.txt') && !options?.replace) {
    console.log('File already exists.');
    return;
  }

  const inputString = await fetchInput(year, day);
  
  const ws = createWriteStream(`${basePath}/day${day}/raw.txt`);
  ws.write(inputString);
  ws.close();
  console.log('Wrote file successfully.');
  return;
}

export async function createInputFileCLI(): Promise<void> {
  const args = process.argv.slice(2);
  const day = args.find((arg) => arg.includes('day'));
  if (day === undefined) {
    const cliResponse = await askForProblemDetails();
    createInputFile(cliResponse.year, cliResponse.day, { replace: cliResponse.replace });
  }
  else {
    createInputFile(2024, +(day.split('=')[1]), { replace: true} );
  }
}

async function askForProblemDetails(): Promise<ICLIResponse> {
  prompt.start();
  const res = await prompt.get([
    { description: 'Year', name: 'year' },
    { description: 'Day ', name: 'day' },
    { description: 'Do you want to replace existing file?', name: 'replace' },
  ]);
  return {
    day: +res.day,
    year: +res.year,
    replace: res.replace?.toString().toLowerCase() === 'y',
  };
}

createInputFileCLI();
