import React from 'react';
import { SDK } from '@rsdoctor/types';
import { withServerAPI } from '../../components/Manifest';

import { Row, Col } from 'antd';
import { Size } from 'src/constants';
import { makeChart } from './components/forceDirectedTree';

interface Props {
  project: SDK.ServerAPI.InferResponseType<SDK.ServerAPI.API.GetAllModuleGraph>;
}

const Component: React.FC<Props> = ({ project }) => {
  console.log(project);
  const Chart = makeChart(project);

  return (
    <Row>
      <Col span={24} style={{ marginBottom: Size.BasePadding }}>
        <div>
          <>{Chart}</>
        </div>
      </Col>
    </Row>
  );
};

export const Page = withServerAPI({
  api: SDK.ServerAPI.API.GetAllModuleGraph,
  responsePropName: 'project',
  Component,
});

export * from './constants';
