import { SDK } from '@rsdoctor/types';
import {
  Card,
  Col,
  Row,
  Space,
  Radio,
  Tag,
  Tooltip,
  Typography,
  Empty,
} from 'antd';
import React, { useState } from 'react';
import { ServerAPIProvider, withServerAPI } from '../../../components/Manifest';
import { Title } from '../../../components/Title';
import { Size } from '../../../constants';

import './index.sass';
import { NodeType } from '../constants';

const largeCardBodyHeight = 800;

interface WebpackNodeUIProps {
  cwd: string;
}

export const WebpackNodeUI: React.FC<WebpackNodeUIProps> = ({ cwd }) => {
  const [graphType, setGraphType] = useState('module' as NodeType);

  // const assets = summary.all.total.files;

  // const selectedNodes = useMemo(() => {}, []);

  return (
    <React.Fragment>
      <Radio.Group
        value={graphType}
        onChange={(e) => setGraphType(e.target.value)}
        style={{ marginBottom: Size.BasePadding }}
        buttonStyle="solid"
        optionType="button"
      >
        <Radio.Button value="module">Module Dependency Graph</Radio.Button>
        <Radio.Button value="chunk">Chunk Dependency Graph</Radio.Button>
      </Radio.Group>
      <ModuleDependencyGraph graphType={graphType} />
      <ChunkDependencyGraph graphType={graphType} cwd={cwd} />
    </React.Fragment>
  );
};

function ModuleDependencyGraph({ graphType }: { graphType: NodeType }) {
  return (
    <Card
      hidden={graphType !== 'module'}
      title={
        <Space>
          <Title text="From: Bundle Graph" />
        </Space>
      }
    >
      {/* TODO: add loading icon. */}
      <ServerAPIProvider api={SDK.ServerAPI.API.GetTileReportHtml} body={{}}>
        {(data) => {
          if (data && graphType === 'module') {
            return (
              <iframe
                srcDoc={data}
                width={'100%'}
                height={largeCardBodyHeight}
                style={{ border: 'none' }}
              />
            );
          }
          return <Empty />;
        }}
      </ServerAPIProvider>
    </Card>
  );
}

function ChunkDependencyGraph({
  graphType,
  cwd,
}: {
  graphType: NodeType;
  cwd: string;
}) {
  return (
    <Card
      hidden={graphType !== 'chunk'}
      title={
        <Space>
          <Title text="Chunk Imports" />
          <Tooltip
            color={'white'}
            title={
              <Space direction="vertical" color="white">
                <Row>
                  <Col>
                    <Tag color="cyan" style={{ margin: 0 }}>
                      initial
                    </Tag>
                    <Typography.Text>
                      : Indignify whether the chunk is the initial chunk.
                    </Typography.Text>
                  </Col>
                </Row>
              </Space>
            }
            style={{ marginLeft: 3 }}
          >
            {cwd}
          </Tooltip>
        </Space>
      }
    ></Card>
  );
}

export function WebpackNodeServer() {
  return withServerAPI({
    api: SDK.ServerAPI.API.GetProjectInfo,
    responsePropName: 'project',
    Component: (props: {
      project: SDK.ServerAPI.InferResponseType<SDK.ServerAPI.API.GetProjectInfo>;
    }) => {
      const { root } = props.project;
      return (
        <ServerAPIProvider
          api={SDK.ServerAPI.API.GetAssetsSummary}
          body={{ withFileContent: true }}
        >
          {() => {
            return (
              <ServerAPIProvider api={SDK.ServerAPI.API.GetEntryPoints}>
                {() => (
                  <WebpackNodeUI
                    cwd={root}
                    // errors={errors}
                    // summary={summary}
                    // entryPoints={entryPoints}
                  />
                )}
              </ServerAPIProvider>
            );
          }}
        </ServerAPIProvider>
      );
    },
  });
}
