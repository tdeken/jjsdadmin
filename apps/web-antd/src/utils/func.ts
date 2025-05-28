function priceFloat(num: number): string {
  if (typeof num === 'number') {
    return num.toFixed(2);
  }
  return num
}

export { priceFloat }