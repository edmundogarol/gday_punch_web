import styled from "styled-components";
import { RedoOutlined } from "@ant-design/icons";
import { Card, Switch } from "antd";

export const DailyPromptCard = styled(Card)`
  width: 67%;
  max-width: max-content;
  min-width: min-content;

  .ant-card-body {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    justify-content: center;
  }

  .ant-card-meta {
    width: 100%;
  }

  .ant-card-meta-title {
    white-space: pre-wrap;
  }
`;

export const DailyPromptSwitch = styled(Switch)`
  height: 13px;
  margin-right: 10px;
  .ant-switch-handle {
    height: 9px;
  }
`;

export const RedoOutlinedContainer = styled(RedoOutlined)`
  -webkit-transition: -webkit-transform 0.5s ease-in-out;
  -ms-transition: -ms-transform 0.5s ease-in-out;
  transition: transform 0.5s ease-in-out;

  &:hover {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }
`;
