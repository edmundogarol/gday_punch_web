import React, { useState } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Popover, Tooltip, Button } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  LikeOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  getGdayPunchResourceUrl,
  getGdayPunchStaticUrl,
  makeSafeUrl,
  scrollToTop,
} from "utils/utils";
import {
  doSuggestRegister,
  followUser,
  openRegistration,
  unfollowUser,
} from "actions/user";
import { selectLoggedIn, selectUser } from "selectors/app";
import { device } from "utils/styles";

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
      min-width: 5em;
      min-height: 5em;
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

    @media ${device.laptop} {
      height: 5em;
    }
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

    .amount {
      color: #bfbfbf;
    }
  }

  .author {
    margin-bottom: 0.5em;

    a {
      color: #2a2a2a;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .active-social-icon {
    svg,
    .amount {
      color: #5799c1;
    }
  }

  .stats-socials-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .socials {
      margin-left: -0.5em;
    }

    button {
      width: 7em;
    }

    @media ${device.laptop} {
      button {
        width: 10em;
      }

      .socials {
        margin-left: unset;
      }
    }
  }
`;

export const SocialButton = styled(Button)`
  width: 10em;
  margin: 0.5em;
`;

export const initialAuthor = {
  id: "",
  name: "No Author",
  cover: "",
  image: "",
  likes: 0,
  followers: 0,
  friends: 0,
  following: false,
  followings: 0,
};

function UserAvatar({ author = initialAuthor, noPreview, history }) {
  const { id, name, image, likes, followers, friends, following, followings } =
    author;

  const user = useSelector(selectUser);
  const loggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();

  // FIXME Temporary before Add Friend is created as the button will remain visible for a while
  const selfProfilePreview = user.id === id;

  const useImage = author ? image : user.image;
  const avatarRenderer = (preview) => (
    <UserAvatarComponent
      className="avatar"
      preview={preview}
      src={
        useImage
          ? useImage.includes("gdaypunch-static.s3.amazonaws")
            ? useImage + `?${moment(moment.now()).format("YYMMDDhhmm")}`
            : getGdayPunchStaticUrl(useImage) +
              `?${moment(moment.now()).format("YYMMDDhhmm")}`
          : getGdayPunchResourceUrl("default-avatar.png")
      }
    />
  );

  const handleFollow = () => {
    if (!loggedIn) {
      scrollToTop();
      dispatch(openRegistration());
      dispatch(
        doSuggestRegister("Info: Sign up or Log in to follow this account!")
      );
      history.push("/");
      return;
    }

    if (following) {
      dispatch(unfollowUser(following));
    } else {
      dispatch(followUser(id));
    }
  };

  const content = (preview) => (
    <PreviewContainer>
      {avatarRenderer(preview)}
      <div>
        <p className="author">
          <NavLink to={`/stall/${id}/${makeSafeUrl(name)}`}>{name}</NavLink>
        </p>
        <div className="stats-socials-container">
          <div className="stats">
            <Tooltip title="Friends (Coming Soon)">
              <div className="icon-amount-container coming-soon">
                <UserAddOutlined className={`site-form-item-icon`} />
                <span className="amount">{friends}</span>
              </div>
            </Tooltip>
            <Tooltip title="Following">
              <div className="icon-amount-container">
                <UserSwitchOutlined className="site-form-item-icon" />
                <span className="amount">{followings}</span>
              </div>
            </Tooltip>
            <Tooltip title={"Followers"}>
              <div
                className={`icon-amount-container ${
                  following ? "active-social-icon" : ""
                }`}
                onClick={() => (!selfProfilePreview ? handleFollow() : null)}
              >
                <TeamOutlined className="site-form-item-icon" />
                <span className="amount">{followers}</span>
              </div>
            </Tooltip>
            <Tooltip title="Manga Likes">
              <div className="icon-amount-container">
                <LikeOutlined className="site-form-item-icon" />
                <span className="amount">{likes}</span>
              </div>
            </Tooltip>
          </div>
          {!selfProfilePreview ? (
            <div className="socials">
              {!following ? (
                <SocialButton type="primary" onClick={() => handleFollow()}>
                  Follow
                </SocialButton>
              ) : null}
              <Tooltip title="Coming Soon">
                <SocialButton type="primary" disabled>
                  Add Friend
                </SocialButton>
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>
    </PreviewContainer>
  );

  if (noPreview) {
    return (
      <Tooltip title={user.username || user.email} placement="bottom">
        {avatarRenderer(false)}
      </Tooltip>
    );
  }
  return <Popover content={content(true)}>{avatarRenderer(false)}</Popover>;
}

export default withRouter(UserAvatar);
