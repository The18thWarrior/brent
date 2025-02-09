'use client';

export function distributeWeights(items: any[]): any[] {
  const totalWeight = 10000;
  const itemCount = items.length;

  // Calculate the base weight for each item (integer division)
  const baseWeight = Math.floor(totalWeight / itemCount);

  // Calculate the remainder that needs to be added to the first item
  const remainder = totalWeight % itemCount;

  // Distribute the base weight to all items and add the remainder to the first item
  return items.map((item, index) => {
    return {
      ...item,
      weight: index === 0 ? baseWeight + remainder : baseWeight
    };
  });
}
