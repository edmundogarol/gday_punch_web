import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Popover, Tooltip, Button } from "antd";
import { TeamOutlined, UserAddOutlined, LikeOutlined } from "@ant-design/icons";
import moment from "moment";

import { getGdayPunchResourceUrl, getGdayPunchStaticUrl } from "utils/utils";
import { followUser, unfollowUser } from "actions/user";

export const UserAvatarComponent = styled.div`
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  width: 2em;
  height: 2em;
  margin-right: 0.4em;
  border-radius: 1em;
  border: 1px solid #c1c1c1;

  ${(props) =>
    props.preview
      ? `
      width: 5em;
      height: 5em;
      border-radius: 4em;
      margin-right: 1em;
        `
      : ""}
`;

const PreviewContainer = styled.div`
  display: flex;
  align-items: center;

  ${UserAvatarComponent} {
    margin-right: 1em;
  }

  p {
    font-weight: 500;
  }

  .stats {
    display: flex;
    align-items: center;
  }

  .amount {
    font-size: 0.7em;
    text-align: center;
    color: dimgray;
  }

  .icon-amount-container {
    display: flex;
    flex-direction: column;
    margin-right: 1em;
  }

  .coming-soon {
    color: #bfbfbf;
  }

  .author {
    margin-bottom: 0.5em;
  }

  .active-social-icon {
    svg,
    .amount {
      color: #5799c1;
    }
  }
`;

export const SocialButton = styled(Button)`
  width: 10em;
  margin: 0.5em;
`;

export default function UserAvatar(props) {
  const {
    author,
    author_id,
    image,
    author_likes,
    author_friends,
    author_followers,
    following_author,
    noPreview,
  } = props;

  const dispatch = useDispatch();

  const avatarRenderer = (preview) => (
    <UserAvatarComponent
      className="avatar"
      preview={preview}
      src={
        image
          ? image.includes("gdaypunch-static.s3.amazonaws")
            ? image + `?${moment(moment.now()).format("YYMMDDhhmm")}`
            : getGdayPunchStaticUrl(image) +
              `?${moment(moment.now()).format("YYMMDDhhmm")}`
          : getGdayPunchResourceUrl("default-avatar.png")
      }
    />
  );

  const handleFollow = () => {
    if (following_author) {
      dispatch(unfollowUser(following_author));
    } else {
      dispatch(followUser(author_id));
    }
  };

  const content = (preview) => (
    <PreviewContainer>
      {avatarRenderer(preview)}
      <div>
        <p className="author">{author}</p>
        <div className="stats">
          <Tooltip title="Friends">
            <div className="icon-amount-container">
              <UserAddOutlined className={`site-form-item-icon`} />
              <span className="amount">{author_friends}</span>
            </div>
          </Tooltip>
          <Tooltip title={following_author ? "Following" : "Followers"}>
            <div
              className={`icon-amount-container ${
                following_author ? "active-social-icon" : ""
              }`}
              onClick={() => handleFollow()}
            >
              <TeamOutlined className="site-form-item-icon" />
              <span className="amount">{author_followers}</span>
            </div>
          </Tooltip>
          <Tooltip title="Manga Likes">
            <div className="icon-amount-container">
              <LikeOutlined className="site-form-item-icon" />
              <span className="amount">{author_likes}</span>
            </div>
          </Tooltip>
          {!following_author ? (
            <SocialButton type="primary" onClick={() => handleFollow()}>
              Follow
            </SocialButton>
          ) : null}
          <SocialButton type="primary">Add Friend</SocialButton>
        </div>
      </div>
    </PreviewContainer>
  );

  if (noPreview) {
    return (
      <Tooltip title="Profile" placement="bottom">
        {avatarRenderer(false)}
      </Tooltip>
    );
  }
  return <Popover content={content(true)}>{avatarRenderer(false)}</Popover>;
}
