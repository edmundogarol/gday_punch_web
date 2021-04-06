import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Card, Tooltip, Switch } from "antd";
import {
  InfoCircleOutlined,
  LoadingOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

import {
  fetchPrompts as fetchPromptsAction,
  resetPromptFetch as resetPromptFetchAction,
  fetchPanelStylePrompt as fetchPanelStylePromptAction,
} from "actions/admin";

import {
  selectPrompts,
  selectPromptStatuses,
  selectPanelStylePrompt,
  selectPanelStylePromptStatuses,
} from "selectors/admin";

const { Meta } = Card;

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

class DailyPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPanelStyle: false,
    };
  }

  componentDidMount() {
    this.props.fetchPrompts(true);
    this.props.fetchPanelStylePrompt();
  }

  componentWillUnmount() {
    this.props.resetPromptFetch();
  }

  render() {
    const {
      prompts,
      promptStatuses,
      stylePanelPrompt,
      stylePanelPromptStatuses,
    } = this.props;
    const { fetchingPrompts, fetchingPromptsSucess } = promptStatuses;
    const {
      fetchingPanelStylePrompt,
      fetchingPanelStylePromptSucess,
    } = stylePanelPromptStatuses;
    const prompt = prompts[0];
    const stylePrompt = stylePanelPrompt ? stylePanelPrompt[0] : {};

    const styles = getStyles();

    return (
      <div id="top" className="App">
        <div className="App-header-container app-temp-background">
          {prompt && (
            <DailyPromptCard
              title="Daily Prompt"
              headStyle={{ textAlign: "initial" }}
              extra={
                <>
                  <DailyPromptSwitch
                    checked={this.state.showPanelStyle}
                    onChange={() =>
                      this.setState({
                        showPanelStyle: !this.state.showPanelStyle,
                      })
                    }
                  />
                  <Tooltip placement="top" title={"Show Panel Style Prompts"}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </>
              }
              bodyStyle={{ display: "flex" }}
            >
              <Card
                title="Subject Prompt"
                bordered={false}
                style={{ width: 250 }}
              >
                <Meta
                  title={prompt.prompt}
                  description={
                    fetchingPrompts ? "Loading..." : `by @${prompt.meta}`
                  }
                />
              </Card>
              {stylePanelPrompt && stylePrompt && (
                <Card
                  title={
                    <>
                      <span>Panel Style Prompt</span>
                      <Tooltip
                        placement="top"
                        title={"Generate new panel style prompt"}
                      >
                        <RedoOutlinedContainer
                          onClick={() => this.props.fetchPanelStylePrompt()}
                          style={{ marginLeft: "1em" }}
                        />
                      </Tooltip>
                    </>
                  }
                  bordered={false}
                  style={
                    this.state.showPanelStyle
                      ? { width: 250 }
                      : { display: "none" }
                  }
                >
                  <Meta
                    title={stylePrompt.prompt}
                    description={
                      fetchingPanelStylePrompt ? (
                        <LoadingOutlined />
                      ) : (
                        `by @${stylePrompt.meta}`
                      )
                    }
                  />
                </Card>
              )}
            </DailyPromptCard>
          )}
        </div>
      </div>
    );
  }
}

function getStyles() {
  return {};
}

DailyPrompt.propTypes = {
  // Redux Properties
  prompts: PropTypes.oneOf(PropTypes.object, PropTypes.array),
  promptStatuses: PropTypes.object,
  // Redux Functions
  fetchPrompts: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  prompts: selectPrompts,
  promptStatuses: selectPromptStatuses,
  stylePanelPrompt: selectPanelStylePrompt,
  stylePanelPromptStatuses: selectPanelStylePromptStatuses,
});

const mapDispatchToProps = {
  fetchPrompts: fetchPromptsAction,
  resetPromptFetch: resetPromptFetchAction,
  fetchPanelStylePrompt: fetchPanelStylePromptAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyPrompt);
