export function distributeWeights(items: any[]): any[] {
  const totalWeight = 10000;
  const itemCount = items.length;

  // Calculate the base weight for each item (integer division)
  const baseWeight = Math.floor(totalWeight / itemCount);

  // Calculate the remainder that needs to be added to the first item
  const remainder = totalWeight % itemCount;

  // Distribute the base weight to all items and add the remainder to the first item
  const result = items.map((item, index) => {
    return {
      ...item,
      weight: index === 0 ? baseWeight + remainder : baseWeight
    };
  });

  // Confirm that all weights are integers
  result.forEach(item => {
    if (!Number.isInteger(item.weight)) {
      throw new Error(`Weight is not an integer: ${item.weight}`);
    }
  });

  return result.map((item) => item.weight);
}

export function getRandomItems<T>(arr: T[], count: number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
  }
  return result.slice(0, count);
}