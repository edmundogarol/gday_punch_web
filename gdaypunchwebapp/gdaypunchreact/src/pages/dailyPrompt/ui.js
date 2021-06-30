import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Tooltip } from "antd";
const { Meta } = Card;
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";

import {
  DailyPromptCard,
  DailyPromptSwitch,
  RedoOutlinedContainer,
} from "./styles";

function Ui(props) {
  const {
    prompts,
    promptStatuses,
    stylePanelPrompt,
    stylePanelPromptStatuses,
    fetchPrompts,
    fetchPanelStylePrompt,
    resetPromptFetch,
  } = props;
  const { fetchingPrompts, fetchingPromptsSucess } = promptStatuses;
  const { fetchingPanelStylePrompt, fetchingPanelStylePromptSucess } =
    stylePanelPromptStatuses;
  const [showPanelStyle, setShowPanelStyle] = useState(false);

  const prompt = prompts[0];
  const stylePrompt = stylePanelPrompt ? stylePanelPrompt[0] : {};

  useEffect(() => {
    if (!prompts.length || fetchingPromptsSucess) {
      fetchPrompts(true);
      fetchPanelStylePrompt();
    }

    // When component unmounts
    return () => {
      resetPromptFetch();
    };
  }, [prompts, fetchingPromptsSucess]);

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
                  checked={showPanelStyle}
                  onChange={() => setShowPanelStyle(!showPanelStyle)}
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
                        onClick={() => fetchPanelStylePrompt()}
                        style={{ marginLeft: "1em" }}
                      />
                    </Tooltip>
                  </>
                }
                bordered={false}
                style={showPanelStyle ? { width: 250 } : { display: "none" }}
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

export default Ui;
