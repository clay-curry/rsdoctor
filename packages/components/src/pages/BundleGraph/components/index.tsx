import { SDK } from '@rsdoctor/types';
import { Card, Col, Row, Space, Radio, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { ServerAPIProvider, withServerAPI } from '../../../components/Manifest';
import { Title } from '../../../components/Title';
import { Size } from '../../../constants';
import './index.sass';
import { NodeType } from '../constants';

// import HierarchicalEdgeBundling from './hierarchicalEdgeBundling';

// const largeCardBodyHeight = 800;

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
        <Radio.Button value="modules">Modules</Radio.Button>
        <Radio.Button value="chunks">Chunks</Radio.Button>
        <Radio.Button value="Assets">Assets</Radio.Button>
        <Radio.Button value="Warning">Warnings</Radio.Button>
        <Radio.Button value="Errors">Errors</Radio.Button>
        <Radio.Button value="Hints">Hints</Radio.Button>
      </Radio.Group>
      <ModuleBundleGraph graphType={graphType} />
      <ChunkDependencyGraph graphType={graphType} cwd={cwd} />
      <BuildAssets graphType={graphType} cwd={cwd} />
      <WarningMessages graphType={graphType} cwd={cwd} />
      <ErrorMessages graphType={graphType} cwd={cwd} />
      <HintMessages graphType={graphType} cwd={cwd} />
    </React.Fragment>
  );
};

function ModuleBundleGraph({ graphType }: { graphType: NodeType }) {
  return (
    <Card
      hidden={graphType !== 'modules'}
      title={
        <Space>
          <Title text="Modules: Entry Points" />
        </Space>
      }
    >
      {/* TODO: add loading icon. */}
      <ServerAPIProvider api={SDK.ServerAPI.API.GetAllModuleGraph} body={{}}>
        {
          //(response) => response
        }
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
      hidden={graphType !== 'chunks'}
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

function BuildAssets({ graphType, cwd }: { graphType: NodeType; cwd: string }) {
  return (
    <Card
      hidden={graphType !== 'assets'}
      title={
        <Space>
          <Title text="Build Assets" />
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

function WarningMessages({
  graphType,
  cwd,
}: {
  graphType: NodeType;
  cwd: string;
}) {
  return (
    <Card
      hidden={graphType !== 'warnings'}
      title={
        <Space>
          <Title text="Warning Messages" />
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

function ErrorMessages({
  graphType,
  cwd,
}: {
  graphType: NodeType;
  cwd: string;
}) {
  return (
    <Card
      hidden={graphType !== 'errors'}
      title={
        <Space>
          <Title text="Error Messages" />
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

function HintMessages({
  graphType,
  cwd,
}: {
  graphType: NodeType;
  cwd: string;
}) {
  return (
    <Card
      hidden={graphType !== 'hints'}
      title={
        <Space>
          <Title text="Hints" />
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
