import React, { useState, useEffect } from "react";
import { Alert, Input, Button, Select, Radio } from "antd";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import { ErrorField } from "components/errorField";
import LoadingSpinner from "components/loadingSpinner";
import Image from "components/image";

import { getGdayPunchStaticUrl } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  App,
  SuccessLabel,
  VotingItemsContainer,
  VotingItemImage,
} from "./styles";

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

  const [itemRefs, updateItemRefs] = useState([]);
  const [purchaseReason, updatePurchaseReason] = useState(undefined);

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
        {fetching ? <LoadingSpinner /> : null}
        {submitted ? (
          <SuccessLabel>
            Great! Your vote has been cast. Thank you for supporting our
            mangaka!
          </SuccessLabel>
        ) : null}
        {itemsError ? (
          <Alert message={`Error: ${itemsError}`} type="error" showIcon />
        ) : null}
        <VotingItemsContainer active={itemRefs.length}>
          {items.length
            ? items.map((elem, idx) => (
                <VotingItemImage
                  className={
                    itemRefs.includes(elem.idx)
                      ? `selected casting-${itemRefs.findIndex(
                          (e) => e === elem.idx
                        )}`
                      : -1
                  }
                  onClick={() => {
                    if (itemRefs.includes(elem.idx)) {
                      const newItems = itemRefs.filter((e) => e !== elem.idx);
                      updateItemRefs(newItems);
                    } else {
                      if (itemRefs.length === 3) return;
                      updateItemRefs(itemRefs.concat(elem.idx));
                    }
                  }}
                  key={idx}
                  src={getGdayPunchStaticUrl(elem.item.img)}
                />
              ))
            : null}
        </VotingItemsContainer>
        <span style={{ fontSize: "x-large" }}>
          Cast your vote by clicking the one shots in your order of preference.
          &nbsp;
        </span>
        <br />
        <br />
        <span
          style={{ textAlign: "left" }}
        >{`What prompted you to buy your copy of Gday Punch Manga Magazine Issue #${issueNo}?`}</span>
        <br />
        <br />
        <div style={{ display: "flex", marginBottom: "2em" }}>
          <Radio.Group
            onChange={(e) => updatePurchaseReason(e.target.value)}
            value={purchaseReason}
          >
            <Radio value="friend">Friend</Radio>
            <Radio value="sales_call">Sales Call</Radio>
            <Radio value="web_search">Web Search</Radio>
            <Radio value="amaa_group">AMAA Group</Radio>
            <Radio value="fb_page">Facebook Page</Radio>
            <Radio value="ig_profile">Instagram Profile</Radio>
          </Radio.Group>
          <Radio.Group
            onChange={(e) => updatePurchaseReason(e.target.value)}
            value={purchaseReason}
          >
            <Radio value="tw_profile">Twitter Profile</Radio>
            <Radio value="yt_channel">YouTube Channel</Radio>
            <Radio value="tt_account">TikTok Account</Radio>
            <Radio value="fb_ad">Facebook Ad</Radio>
            <Radio value="ig_ad">Instagram Ad</Radio>
            <Radio value="library">Library</Radio>
          </Radio.Group>
          <Radio.Group
            onChange={(e) => updatePurchaseReason(e.target.value)}
            value={purchaseReason}
          >
            <Radio value="school">School</Radio>
            <Radio value="online_store">Online Store</Radio>
            <Radio value="comic_store">Comic Store</Radio>
            <Radio value="book_store">Book Store</Radio>
            <Radio value="posters_flyers">Posters and Flyers</Radio>
            <Radio value="other_reason">Other</Radio>
          </Radio.Group>
        </div>
      </FeaturedSection>
    </App>
  );
}

export default Ui;
