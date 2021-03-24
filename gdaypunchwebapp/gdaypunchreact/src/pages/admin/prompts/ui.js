import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Input, Tooltip } from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  BulbOutlined,
} from "@ant-design/icons";

import { PromptsContainer, SubmitButton } from "./styles";

function Ui(props) {
  const {} = props;
  const [prompt, setPrompt] = useState({
    description: "",
    source: "",
  });

  return (
    <PromptsContainer>
      <Input
        value={prompt.description}
        onChange={(e) => setPrompt({ ...prompt, description: e.target.value })}
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
      <SubmitButton>Submit</SubmitButton>
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
