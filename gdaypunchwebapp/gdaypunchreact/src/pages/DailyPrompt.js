import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Card } from "antd";

import {
  fetchPrompts as fetchPromptsAction,
  resetPromptFetch as resetPromptFetchAction,
} from "actions/admin";

import { selectPrompts, selectPromptStatuses } from "selectors/admin";

const { Meta } = Card;

class DailyPrompt extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPrompts(true);
  }

  componentWillUnmount() {
    this.props.resetPromptFetch();
  }

  render() {
    const { prompts, promptStatuses } = this.props;
    const { fetchingPrompts, fetchingPromptsSucess } = promptStatuses;
    const prompt = prompts[0];

    const styles = getStyles();

    return (
      <div id="top" className="App">
        <div className="App-header-container app-temp-background">
          {prompt && (
            <Card title="Daily Prompt" bordered={false} style={{ width: 300 }}>
              <Meta
                title={prompt.prompt}
                description={
                  fetchingPrompts ? "Loading..." : `by ${prompt.meta}`
                }
              />
            </Card>
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
});

const mapDispatchToProps = {
  fetchPrompts: fetchPromptsAction,
  resetPromptFetch: resetPromptFetchAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyPrompt);
