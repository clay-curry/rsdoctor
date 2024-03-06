import { Client } from '@rsdoctor/types';

export const name = 'Bundle Graph';

export const route = Client.RsdoctorClientRoutes.BundleGraph;

export const maxModuleSize = 5000;

export type NodeType =
  | 'modules'
  | 'chunks'
  | 'assets'
  | 'warnings'
  | 'errors'
  | 'hints';
