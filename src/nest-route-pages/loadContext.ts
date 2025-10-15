import { createContext } from 'mve-core';
import { Branch } from 'mve-helper';
import { GetValue } from 'wy-helper';

export const loadContext = createContext<{
  renderBranch(getBranch: GetValue<Branch>): void;
  getBranch(getPath: GetValue<string>): GetValue<Branch>;
  preLoad(v: string): void;
}>(undefined!);
