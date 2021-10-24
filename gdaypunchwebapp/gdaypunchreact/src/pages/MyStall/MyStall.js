import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "antd";
import { isEmpty } from "lodash";
import { TeamOutlined, UserAddOutlined, LikeOutlined } from "@ant-design/icons";

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
import { getGdayPunchResourceUrl } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

import { MyStallContainer, ProfileDetails, SocialButton } from "./styles";

function MyStall() {
  const user = useSelector(selectUser);
  const buyableProducts = useSelector(selectBuyableProducts);
  const productsState = useSelector(selectProductsState);
  const { fetchingProducts, finishedFetchingProducts } = productsState;
  const dispatch = useDispatch();

  const [author_friends, author_followers, author_likes] = [7, 19, 304];

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
      <Header background={getGdayPunchResourceUrl("issue-4-hero.png")}>
        <UserAvatar
          image={user.image}
          author={user.username || user.email}
          author_friends={author_friends}
          author_followers={author_followers}
          author_likes={author_likes}
        />
      </Header>
      <FeaturedSection idx={1}>
        <ProfileDetails>
          <SectionTitle>{user.username || user.email}</SectionTitle>
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
          <div>
            <SocialButton type="primary">Follow</SocialButton>
            <SocialButton type="primary">Add Friend</SocialButton>
          </div>
        </ProfileDetails>
        <p className="bio">&ldquo;{user.bio || "No bio."}&rdquo;</p>
      </FeaturedSection>
      {!isEmpty(buyableProducts) && (
        <FeaturedSection idx={2}>
          <SectionTitle>Shop</SectionTitle>
          <FeaturedList>
            {buyableProducts.map((product) => {
              return product ? (
                <ProductTile
                  key={`${product.id}_${product.quantity || 0}`}
                  product={product}
                />
              ) : null;
            })}
          </FeaturedList>
        </FeaturedSection>
      )}
    </MyStallContainer>
  );
}

export default MyStall;
