import React, { useState, useEffect } from "react";
import { Alert, Modal, Radio } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";
import { selectLoggedIn, selectVotingState } from "selectors/app";
import { getGdayPunchStaticUrl } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { castVote, fetchVotingItems } from "actions/voting";

const { confirm } = Modal;

import {
  App,
  SuccessLabel,
  VotingItemsContainer,
  VotingItemImage,
  SubmitButton,
  DisabledOverlay,
  PurchaseReasonContainer,
} from "./styles";

function Vote() {
  const loggedIn = useSelector(selectLoggedIn);
  const {
    items,
    issueNo,
    fetching,
    finished,
    itemsError,
    disabled,
    cast,
    castError,
    submitting,
    submitted,
  } = useSelector(selectVotingState);

  const dispatch = useDispatch();

  const [itemRefs, updateItemRefs] = useState([]);
  const [purchaseReason, updatePurchaseReason] = useState(undefined);
  const castExists = cast && cast.length;

  useScrollTop();

  useEffect(() => {
    if (!items.length && !fetching && !finished) {
      dispatch(fetchVotingItems());
    }
  }, [items, fetching, finished]);

  useEffect(() => {
    if (!itemRefs.length && castExists) {
      let alreadyCast = [];

      const first = cast.find((item) => item.value === 1);
      alreadyCast.push(first.item);
      const second = cast.find((item) => item.value === 2);
      alreadyCast.push(second.item);
      const third = cast.find((item) => item.value === 3);
      alreadyCast.push(third.item);

      updateItemRefs(alreadyCast);
    }
  }, [cast, itemRefs]);

  const handleVoteCasting = () => {
    confirm({
      title: "Casting Vote",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Confirm vote titles order:</p>
          <div>
            {itemRefs.map((item, idx) => {
              let place = "1st";
              if (idx === 1) {
                place = "2nd";
              } else if (idx === 2) {
                place = "3rd";
              }

              const current = items.find((i) => i.idx === item);
              return (
                <p
                  key={idx}
                >{`${place}: ${current.item.title} by ${current.item.author}`}</p>
              );
            })}
          </div>
        </div>
      ),
      onOk() {
        dispatch(castVote(itemRefs, purchaseReason));
      },
    });
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>
          {castExists
            ? `Here is your vote for Issue #${issueNo}!`
            : `Issue #${issueNo} Voting`}
        </SectionTitle>
        {fetching || submitting ? <LoadingSpinner /> : null}
        {submitted && !castError ? (
          <SuccessLabel>
            Great! Your vote has been cast. Thank you for supporting our
            mangaka!
          </SuccessLabel>
        ) : null}
        {itemsError ? (
          <Alert message={`Error: ${itemsError}`} type="error" showIcon />
        ) : null}
        {!submitted && !castError ? (
          <>
            <VotingItemsContainer
              active={itemRefs.length}
              disabled={disabled || castExists}
            >
              {disabled ? (
                <DisabledOverlay>
                  <span>
                    {loggedIn ? "Issue Not Purchased" : "Log In to Vote!"}
                  </span>
                </DisabledOverlay>
              ) : null}
              {items.length
                ? items.map((elem, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (castExists) return;

                        if (itemRefs.includes(elem.idx)) {
                          const newItems = itemRefs.filter(
                            (e) => e !== elem.idx
                          );
                          updateItemRefs(newItems);
                        } else {
                          if (itemRefs.length === 3) return;
                          updateItemRefs(itemRefs.concat(elem.idx));
                        }
                      }}
                      className={
                        itemRefs.includes(elem.idx)
                          ? `selected casting-${
                              itemRefs.findIndex((e) => e === elem.idx) + 1
                            }`
                          : -1
                      }
                    >
                      {itemRefs.includes(elem.idx) ? (
                        <span className="position-overlay">{`${
                          itemRefs.findIndex((e) => e === elem.idx) + 1
                        }`}</span>
                      ) : null}
                      <VotingItemImage
                        className={
                          itemRefs.includes(elem.idx) ? "selected" : ""
                        }
                        src={getGdayPunchStaticUrl(elem.item.img)}
                      />
                    </div>
                  ))
                : null}
            </VotingItemsContainer>
            <span
              className={disabled || castExists ? "disable" : ""}
              style={{ fontSize: "x-large" }}
            >
              Cast your vote by clicking the one shots in your order of
              preference. &nbsp;
            </span>
            <br />
            <br />
            <span
              className={disabled || castExists ? "disable" : ""}
              style={{ textAlign: "left" }}
            >{`What prompted you to buy your copy of Gday Punch Manga Magazine Issue #${issueNo}?`}</span>
            <br />
            <br />
            <PurchaseReasonContainer>
              <Radio.Group
                disabled={disabled || castExists}
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
                disabled={disabled || castExists}
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
                disabled={disabled || castExists}
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
            </PurchaseReasonContainer>
            <SubmitButton
              onClick={() => handleVoteCasting()}
              disabled={
                itemRefs.length < 3 || !purchaseReason || disabled || castExists
              }
            >
              {castExists ? "Already Voted" : "Submit Vote"}
            </SubmitButton>
          </>
        ) : null}
        {castError ? (
          <Alert message={`Error: ${castError}`} type="error" showIcon />
        ) : null}
      </FeaturedSection>
    </App>
  );
}

export default Vote;
