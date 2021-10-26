import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Tooltip, Skeleton, Upload } from "antd";
import { isEmpty } from "lodash";
import classNames from "classnames";
import {
  TeamOutlined,
  UserAddOutlined,
  LikeOutlined,
  FileAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import Header from "components/header";
import ProductTile from "components/ProductTile/ProductTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import UserAvatar from "components/UserAvatar";
import { fetchProducts } from "actions/app";
import {
  selectBuyableProducts,
  selectProductsState,
  selectUser,
  selectUserById,
  selectUserProducts,
} from "selectors/app";
import { getGdayPunchResourceUrl, getGdayPunchStaticUrl } from "utils/utils";
import { normaliseUserStallData } from "utils/users";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  StallContainer,
  ProfileDetails,
  SocialButton,
  EmptySection,
} from "./styles";

const initialUserStall = {
  id: undefined,
  name: "No User",
  image: undefined,
  cover: undefined,
  likes: 0,
  followers: 0,
  friends: 0,
};

function Stall() {
  const { userId } = useParams();
  const currentUser = useSelector(selectUser);
  const user = useSelector(selectUserById(userId));
  const buyableProducts = useSelector(selectBuyableProducts);
  const productsState = useSelector(selectProductsState);
  const { fetchingProducts, finishedFetchingProducts } = productsState;
  const dispatch = useDispatch();

  const myStallView = !userId;
  const viewingUser = myStallView
    ? normaliseUserStallData(currentUser)
    : normaliseUserStallData(user) || initialUserStall;
  const userProducts = viewingUser
    ? useSelector(selectUserProducts(viewingUser.id))
    : [];

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

  useEffect(() => {
    if (!myStallView && viewingUser?.name) {
      const title = `${viewingUser.name} | Gday Punch`;
      document.title = title;
    }
  }, [viewingUser]);

  return (
    <StallContainer className="App">
      <Header
        editable={myStallView}
        background={
          viewingUser?.cover
            ? getGdayPunchStaticUrl(viewingUser.cover)
            : getGdayPunchResourceUrl("launch-background.png")
        }
      >
        <UserAvatar author={viewingUser} />
      </Header>
      <FeaturedSection idx={1}>
        {viewingUser ? (
          <>
            <ProfileDetails>
              <SectionTitle>{viewingUser.name}</SectionTitle>
              <div className="stats">
                <Tooltip title="Friends (Coming Soon)">
                  <div className="icon-amount-container coming-soon">
                    <UserAddOutlined className="site-form-item-icon" />
                    <span className="amount">{viewingUser.friends}</span>
                  </div>
                </Tooltip>
                <Tooltip title="Followers">
                  <div className="icon-amount-container">
                    <TeamOutlined className="site-form-item-icon" />
                    <span className="amount">{viewingUser.followers}</span>
                  </div>
                </Tooltip>
                <Tooltip title="Manga Likes">
                  <div className="icon-amount-container">
                    <LikeOutlined className="site-form-item-icon" />
                    <span className="amount">{viewingUser.likes}</span>
                  </div>
                </Tooltip>
              </div>
              {!myStallView && viewingUser.id ? (
                <div className="socials">
                  <SocialButton type="primary">Follow</SocialButton>
                  <Tooltip title="Coming Soon">
                    <SocialButton type="primary" disabled>
                      Add Friend
                    </SocialButton>
                  </Tooltip>
                </div>
              ) : null}
            </ProfileDetails>
            <p className="bio">&ldquo;{viewingUser.bio || "No bio."}&rdquo;</p>
          </>
        ) : (
          <Skeleton avatar paragraph={{ rows: 3 }} />
        )}
      </FeaturedSection>
      <FeaturedSection idx={2}>
        <SectionTitle>Gallery</SectionTitle>
        <FeaturedList>
          {userProducts.map((product) => {
            return product ? (
              <ProductTile
                key={`${product.id}_${product.quantity || 0}`}
                product={product}
              />
            ) : null;
          })}
          {userProducts.length ? null : (
            <div className="empty-section">
              <EmptySection>
                <h4>No Manga</h4>
                {myStallView ? (
                  <div>
                    <h2 onClick={() => alert("Upload Manga")}>Upload Now</h2>
                    <FileAddOutlined className="site-form-item-icon" />
                  </div>
                ) : null}
              </EmptySection>
            </div>
          )}
          {myStallView && userProducts.length ? (
            <Upload
              name="manga-uploader"
              listType="picture-card"
              className={classNames("manga-uploader", { editing: false })}
              showUploadList={false}
              openFileDialogOnClick={true}
              customRequest={() => null}
              // beforeUpload={beforeUpload}
              // onChange={handleChange}
              // onPreview={onPreview}
            >
              {/* <img
                src={undefined}
                alt="User Avatar"
                style={{ width: "100%" }}
              /> */}
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          ) : null}
        </FeaturedList>
      </FeaturedSection>
    </StallContainer>
  );
}

export default Stall;
