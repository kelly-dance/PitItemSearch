import { Item } from '../../shared/types.ts';
import { Atom, atom, selector, writeSelector, useAtom, useSelector } from './recoil.ts';

type Theme = {
  background: string,
  altBackground: string,
  text: string,
  altText: string,
  accent: string,
}

const dark: Theme = {
  background: '#34343a',
  altBackground: '#dfdfdf',
  text: '#dfdfdf',
  altText: '#111111',
  accent: '#0e34a0',
}

const light: Theme = {
  background: '#dfdfdf',
  altBackground: '#34343a',
  text: '#111111',
  altText: '#dfdfdf',
  accent: '#0e34a0',
}

const themeAtom = atom<Theme>(dark);

export const useTheme = () => useSelector(themeAtom);
export const toggleTheme = () => themeAtom.set(theme => theme === dark ? light : dark);

export const queryStringAtom = atom<string>('');
export const useQueryString = () => useAtom(queryStringAtom);

export const hasNextPageAtom = atom<boolean>(false);
export const useHasNextPage = () => useAtom(hasNextPageAtom);

export const searchingAtom = atom(false);
export const useSearching = () => useAtom(searchingAtom);

export const resultsAtom = atom<Item[]>([]);
export const useResults = () => useAtom(resultsAtom);

const lengthSelector = selector(resultsAtom, (results) => results.length);
export const useLength = () => useSelector(lengthSelector);

const resultIndexSelector = (index: number) => selector<Item[], Item | undefined>(resultsAtom, results => results[index]);
export const useResultIndex = (index: number) => useSelector(resultIndexSelector(index));

export const selectedItemAtom = atom<Item | undefined>(undefined);
export const useSelectedItem = () => useAtom(selectedItemAtom);
