import React, { useEffect, useState } from "react";
import { Card, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
const { Meta } = Card;
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";

import {
  fetchPrompts,
  resetPromptFetch,
  fetchPanelStylePrompt,
} from "actions/admin";
import {
  selectPrompts,
  selectPromptStatuses,
  selectPanelStylePrompt,
  selectPanelStylePromptStatuses,
} from "selectors/admin";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  DailyPromptCard,
  DailyPromptSwitch,
  RedoOutlinedContainer,
} from "./styles";

function DailyPrompt() {
  const { fetchingPrompts, fetchingPromptsSucess } = promptStatuses;
  const { fetchingPanelStylePrompt } = stylePanelPromptStatuses;

  const prompts = useSelector(selectPrompts);
  const promptStatuses = useSelector(selectPromptStatuses);
  const stylePanelPrompt = useSelector(selectPanelStylePrompt);
  const stylePanelPromptStatuses = useSelector(selectPanelStylePromptStatuses);

  const [showPanelStyle, setShowPanelStyle] = useState(false);

  const prompt = prompts[0];
  const stylePrompt = stylePanelPrompt ? stylePanelPrompt[0] : {};

  const dispatch = useDispatch();

  useScrollTop();

  useEffect(() => {
    if (!prompts.length && !fetchingPromptsSucess) {
      dispatch(fetchPrompts(true));
      dispatch(fetchPanelStylePrompt());
    }

    // When component unmounts
    return () => {
      dispatch(resetPromptFetch());
    };
  }, []);

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
                        onClick={() => dispatch(fetchPanelStylePrompt())}
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

export default DailyPrompt;
