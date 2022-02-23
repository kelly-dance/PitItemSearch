
export const zip = <R extends any[][]>(
  ...arrs: R
): { [K in keyof R]: R[K] extends (infer T)[] ? T : never }[] => {
  return Array.from({length: Math.min(...arrs.map(a => a.length))}, (_, i) => {
    return arrs.map(a => a[i]);
  }) as any;
}
