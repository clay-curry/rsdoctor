import React from 'react';
import { SDK } from '@rsdoctor/types';
import { withServerAPI } from '../../components/Manifest';

import { Row, Col } from 'antd';
import { WebpackNodeUI } from './components';
import { Size } from 'src/constants';

interface Props {
  project: SDK.ServerAPI.InferResponseType<SDK.ServerAPI.API.GetProjectInfo>;
}

const Component: React.FC<Props> = ({ project }) => {
  console.log(project);
  return (
    <Row>
      <Col span={24} style={{ marginBottom: Size.BasePadding }}>
        <WebpackNodeUI cwd={'foo'} />
      </Col>
    </Row>
  );
};

export const Page = withServerAPI({
  api: SDK.ServerAPI.API.GetProjectInfo,
  responsePropName: 'project',
  Component,
});

export * from './constants';
