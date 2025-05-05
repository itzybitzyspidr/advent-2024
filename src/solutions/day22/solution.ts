import { getInputAsLines } from "../../helpers/read-inputs";

const MODULO = 16777216n;
const SECRET_LENGTH = 2000;

export function y2024d22p1(): bigint {
  const input = getInputAsLines(22).body;
  const initialSecrets = input.map((line) => BigInt(+line));
  const secretsArray = initialSecrets.map((initial) => generateSecrets(initial));
  
  return secretsArray.reduce((prev, cur) => (prev += cur[SECRET_LENGTH]), 0n);
}

export function y2024d22p2(): number {
  const input = getInputAsLines(22).body;
  const initialSecrets = input.map((line) => BigInt(+line));
  const secretsArray = initialSecrets.map((initial) => generateSecrets(initial));
  const bananaMap = new Map<string, number>();
  for (const secrets of secretsArray) {
    const prices = generatePrices(secrets);
    const differences = generateDifferences(prices);
    calculateBananaMap(prices, differences, bananaMap);
  }

  return getBestCode(bananaMap);
}

function mixAndPrune(n1: bigint, n2: bigint): bigint {
  return (n1^n2) % MODULO;
}

function generateNextSecret(secret: bigint): bigint {
  const multed = mixAndPrune(secret * 64n, secret);
  const divided = mixAndPrune(multed / 32n, multed);
  return mixAndPrune(divided * 2048n, divided);
}

function generateSecrets(secret: bigint): bigint[] {
  const secrets = [secret];
  for (let i = 0; i < SECRET_LENGTH; i++) {
    secrets.push(generateNextSecret(secrets[i]));
  }
  return secrets;
}

function generatePrices(secrets: bigint[]): number[] {
  return secrets.map((secret) => Number(secret % 10n));
}

function generateDifferences(prices: number[]): number[] {
  const differences: number[] = [];
  for (let i = 0; i < prices.length - 1; i++) {
    differences.push(prices[i+1] - prices[i]);
  }
  return differences;
}

function calculateBananaMap(prices: number[], differences: number[], bananaMap: Map<string, number>): void {
  const seen = new Set<string>();
  for (let i = 4; i < differences.length; i++) {
    const pattern = differences.slice(i - 4, i).toString();
    if (!seen.has(pattern)) {
      seen.add(pattern);
      const current = bananaMap.get(pattern) || 0;
      bananaMap.set(pattern, current + prices[i]);
    }
  }
}

function getBestCode(bananaMap: Map<string, number>): number {
  let mostBananas = 0;
  for (const bananas of bananaMap.values()) {
    if (bananas > mostBananas) {
      mostBananas = bananas;
    }
  }
  return mostBananas;
}
