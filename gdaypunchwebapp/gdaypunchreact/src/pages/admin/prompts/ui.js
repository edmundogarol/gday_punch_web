import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Input, Tooltip, Typography, Table, Radio, Button } from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  BulbOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import {
  PromptsContainer,
  PromptCreateContainer,
  SubmitButton,
} from "./styles";

const { Title } = Typography;

const promptTypes = {
  1: "Subject",
  2: "Panel Style",
  3: "Panel Framing",
};

function Ui(props) {
  const {
    prompts,
    fetchPrompts,
    promptStatuses,
    createPrompt,
    selectPrompt,
  } = props;
  const { fetchingPrompts, fetchingPromptsSucess } = promptStatuses;
  const [prompt, setPrompt] = useState({
    description: "",
    source: "",
    type: 1,
  });

  const dataSource = prompts.map((prompt, idx) => ({ key: idx, ...prompt }));

  const columns = [
    {
      title: "Prompt",
      dataIndex: "prompt",
      key: "prompt",
    },
    {
      title: "Created By",
      dataIndex: "meta",
      key: "meta",
    },
    {
      title: "Type",
      dataIndex: "promptType",
      key: "promptType",
      render: (promptType) => promptTypes[promptType],
    },
    {
      title: "Active",
      dataIndex: "is_selected",
      key: "is_selected",
      render: (selected, instance) => {
        return selected ? (
          <Button disabled={true}>Selected</Button>
        ) : (
          <Button onClick={() => selectPrompt(instance.id)}>Select</Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (!fetchingPromptsSucess && !fetchingPrompts) fetchPrompts();
  }, [fetchingPromptsSucess]);

  const handlePromptSubmit = () => {
    createPrompt({
      prompt: prompt.description,
      meta: prompt.source,
      promptType: prompt.type,
    });
  };

  return (
    <PromptsContainer>
      <Title level={4}>
        Create Prompt
        <EyeOutlined
          onClick={() => (window.location.href = "/daily-prompt")}
          style={{ position: "absolute", right: "1em" }}
        />
      </Title>
      <PromptCreateContainer>
        <Input
          value={prompt.description}
          onChange={(e) =>
            setPrompt({ ...prompt, description: e.target.value })
          }
          placeholder="Enter Prompt"
          prefix={<BulbOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Prompt description">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Input
          value={prompt.source}
          onChange={(e) => setPrompt({ ...prompt, source: e.target.value })}
          placeholder="Enter username or source"
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Creator username or source for prompt">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Radio.Group
          onChange={(e) => setPrompt({ ...prompt, type: e.target.value })}
          value={prompt.type}
        >
          <Radio value={1}>Subject</Radio>
          <Radio value={2}>Panel Style</Radio>
          <Radio value={3}>Panel Framing</Radio>
        </Radio.Group>
        <SubmitButton onClick={() => handlePromptSubmit()}>Submit</SubmitButton>
      </PromptCreateContainer>
      <Table dataSource={dataSource} columns={columns} />
    </PromptsContainer>
  );
}

Ui.propTypes = {
  // tweetSuccess: PropTypes.bool,
  // embeddedTweet: PropTypes.object,
  // tweetError: PropTypes.string,
  // tweet: PropTypes.func,
};

export default Ui;
