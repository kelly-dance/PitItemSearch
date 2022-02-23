import { useEffect, useState } from 'react';

export type Selector<T> = {
  get: () => T,
  subscribe(subscriber: (value: T) => void): () => void,
}

export type Atom<T> = Selector<T> & {
  set: (val: T | ((prev: T) => T)) => void,
}

export const defaultCompare = <T>(a: T, b: T): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const atom = <T>(init: T | (() => T), compare: ((a: T, b: T) => boolean) = defaultCompare): Atom<T> => {
  let value = init instanceof Function ? init() : init;
  const subscribers = new Set<((value: T) => void)>();
  return {
    get: () => value,
    set: newValue => {
      if(newValue instanceof Function) newValue = newValue(value);
      if(compare(value, newValue)) return;
      value = newValue;
      for(const subscriber of subscribers) subscriber(value);
    },
    subscribe(subscriber: (value: T) => void) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  }
}

export const useAtom = <T>(atom: Atom<T>): [T, ((val: T | ((prev: T) => T)) => void)] => {
  const [value, setValue] = useState(atom.get);
  useEffect(() => atom.subscribe(setValue), []);
  return [value, val => atom.set(val instanceof Function ? val(value) : val)];
}

export const useSelector = <T>(atom: Selector<T>): T => {
  const [value, setValue] = useState(atom.get);
  useEffect(() => atom.subscribe(setValue), []);
  return value;
}

export const selector = <T, R>(
  atom: Atom<T>,
  read: (value: T) => R,
  compare: ((a: R, b: R) => boolean) = defaultCompare
): Selector<R> => {
  return {
    get: () => read(atom.get()),
    subscribe(subscriber: (value: R) => void) {
      let prev = read(atom.get());
      return atom.subscribe(parent => {
        const val = read(parent);
        if(compare(val, prev)) return;
        prev = val;
        subscriber(val);
      });
    }
  }
}

export const writeSelector = <T, R>(
  atom: Atom<T>,
  read: (value: T) => R,
  write: (parent: T, val: R) => T,
  compare: ((a: R, b: R) => boolean) = defaultCompare,
): Atom<R> => {
  return {
    ...selector(atom, read, compare),
    set: newValue => {
      if(newValue instanceof Function) newValue = newValue(read(atom.get()));
      atom.set(write(atom.get(), newValue));
    },
  }
}
