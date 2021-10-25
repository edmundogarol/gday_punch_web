import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip, Skeleton } from "antd";
import { isEmpty } from "lodash";
import {
  TeamOutlined,
  UserAddOutlined,
  LikeOutlined,
  FileAddOutlined,
} from "@ant-design/icons";

import Header from "components/header";
import ProductTile from "components/ProductTile/ProductTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import UserAvatar from "components/userAvatar";
import { fetchProducts } from "actions/app";
import {
  selectBuyableProducts,
  selectProductsState,
  selectUser,
} from "selectors/app";
import { getGdayPunchResourceUrl, getGdayPunchStaticUrl } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  MyStallContainer,
  ProfileDetails,
  SocialButton,
  EmptySection,
} from "./styles";

function MyStall() {
  const user = useSelector(selectUser);
  const buyableProducts = useSelector(selectBuyableProducts);
  const productsState = useSelector(selectProductsState);
  const { fetchingProducts, finishedFetchingProducts } = productsState;
  const dispatch = useDispatch();

  useScrollTop();

  useEffect(() => {
    if (
      isEmpty(buyableProducts) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      dispatch(fetchProducts());
    }
  }, [buyableProducts, fetchingProducts, finishedFetchingProducts]);

  return (
    <MyStallContainer className="App">
      <Header
        editable
        background={
          user.cover
            ? getGdayPunchStaticUrl(user.cover)
            : getGdayPunchResourceUrl("launch-background.png")
        }
      >
        <UserAvatar author={user.author_details} />
      </Header>
      <FeaturedSection idx={1}>
        {user.author_details ? (
          <>
            <ProfileDetails>
              <SectionTitle>{user.author_details.name}</SectionTitle>
              <div className="stats">
                <Tooltip title="Friends (Coming Soon)">
                  <div className="icon-amount-container coming-soon">
                    <UserAddOutlined className="site-form-item-icon" />
                    <span className="amount">
                      {user.author_details.friends}
                    </span>
                  </div>
                </Tooltip>
                <Tooltip title="Followers">
                  <div className="icon-amount-container">
                    <TeamOutlined className="site-form-item-icon" />
                    <span className="amount">
                      {user.author_details.followers}
                    </span>
                  </div>
                </Tooltip>
                <Tooltip title="Manga Likes">
                  <div className="icon-amount-container">
                    <LikeOutlined className="site-form-item-icon" />
                    <span className="amount">{user.author_details.likes}</span>
                  </div>
                </Tooltip>
              </div>
              <div className="socials">
                <SocialButton type="primary">Follow</SocialButton>
                <Tooltip title="Coming Soon">
                  <SocialButton type="primary" disabled>
                    Add Friend
                  </SocialButton>
                </Tooltip>
              </div>
            </ProfileDetails>
            <p className="bio">&ldquo;{user.bio || "No bio."}&rdquo;</p>
          </>
        ) : (
          <Skeleton avatar paragraph={{ rows: 3 }} />
        )}
      </FeaturedSection>
      <FeaturedSection idx={2}>
        <SectionTitle>Gallery</SectionTitle>
        <FeaturedList>
          {[].map((product) => {
            return product ? (
              <ProductTile
                key={`${product.id}_${product.quantity || 0}`}
                product={product}
              />
            ) : null;
          })}
          {}
          <div className="empty-section">
            <EmptySection>
              <h4>No Manga</h4>
              <div>
                <h2 onClick={() => alert("Upload Manga")}>Upload Now</h2>
                <FileAddOutlined className="site-form-item-icon" />
              </div>
            </EmptySection>
          </div>
        </FeaturedList>
      </FeaturedSection>
    </MyStallContainer>
  );
}

export default MyStall;
