import React, { useState, useEffect } from "react";
import { Input, Button, Select } from "antd";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import { ErrorField } from "components/errorField";
import LoadingSpinner from "components/loadingSpinner";
import Image from "components/image";

import { getGdayPunchStaticUrl } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

import { App, SuccessLabel } from "./styles";

function Ui(props) {
  const {
    votingState: {
      items,
      issueNo,
      fetching,
      finished,
      itemsError,
      cast,
      castError,
      submitting,
      submitted,
    },
    fetchVotingItems,
    castVote,
  } = props;

  useScrollTop();

  useEffect(() => {
    if (!items.length && !fetching && !finished) {
      fetchVotingItems();
    }
  }, [items, fetching, finished]);

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>{`Issue #${issueNo} Voting`}</SectionTitle>
        {fetching && <LoadingSpinner />}
        {submitted && (
          <SuccessLabel>
            Great! Your vote has been cast. Thank you for supporting our
            mangaka!
          </SuccessLabel>
        )}
        <div>
          {items.length &&
            items.map((item) => (
              <div key={item.idx}>
                <Image src={item.img} preview={false} />
              </div>
            ))}
        </div>
      </FeaturedSection>
    </App>
  );
}

export default Ui;
