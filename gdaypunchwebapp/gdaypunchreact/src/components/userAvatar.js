import React from "react";
import styled from "styled-components";
import { Popover, Tooltip } from "antd";
import { TeamOutlined, UserAddOutlined, LikeOutlined } from "@ant-design/icons";
import moment from "moment";

import { getGdayPunchResourceUrl, getGdayPunchStaticUrl } from "utils/utils";

const UserAvatarComponent = styled.div`
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
`;

export default function UserAvatar(props) {
  const {
    author,
    image,
    author_likes,
    author_friends,
    author_followers,
    noPreview,
  } = props;

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

  const content = (preview) => (
    <PreviewContainer>
      {avatarRenderer(preview)}
      <div>
        <p>{author}</p>
        <div className="stats">
          <Tooltip title="Friends (Coming Soon)">
            <div className="icon-amount-container coming-soon">
              <UserAddOutlined className="site-form-item-icon" />
              <span className="amount">{author_friends}</span>
            </div>
          </Tooltip>
          <Tooltip title="Followers (Coming Soon)">
            <div className="icon-amount-container coming-soon">
              <TeamOutlined className="site-form-item-icon" />
              <span className="amount">{author_followers}</span>
            </div>
          </Tooltip>
          <Tooltip title="Total User Manga Likes">
            <div className="icon-amount-container">
              <LikeOutlined className="site-form-item-icon" />
              <span className="amount">{author_likes}</span>
            </div>
          </Tooltip>
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
