import React from 'react';
import { SDK } from '@rsdoctor/types';
import { withServerAPI } from '../../components/Manifest';
interface Props {
  project: SDK.ServerAPI.InferResponseType<SDK.ServerAPI.API.GetProjectInfo>;
}

const Component: React.FC<Props> = ({ project }) => {
  console.log(project);
  return <div></div>;
};

export const Page = withServerAPI({
  api: SDK.ServerAPI.API.GetProjectInfo,
  responsePropName: 'project',
  Component,
});

export * from './constants';
