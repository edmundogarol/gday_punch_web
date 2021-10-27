import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { isEmpty } from "lodash";
import classNames from "classnames";
import { pdfjs } from "react-pdf";
import moment from "moment";
import { Tooltip, Skeleton, Upload, message, Modal } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  LikeOutlined,
  FileAddOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;

import Header from "components/header";
import ProductTile from "components/ProductTile/ProductTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import UserAvatar from "components/UserAvatar";
import MangaDetail from "./MangaDetail";
import { fetchProducts } from "actions/app";
import {
  selectProductsState,
  selectUserById,
  selectUserProducts,
  selectUserStallView,
} from "selectors/app";
import { selectStallState } from "selectors/stall";
import {
  getGdayPunchResourceUrl,
  getGdayPunchStaticUrl,
  removeHtml,
} from "utils/utils";
import { normaliseProductData } from "utils/manga";
import { normaliseAuthorData } from "utils/users";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  StallContainer,
  ProfileDetails,
  SocialButton,
  ConfirmUploadSummary,
} from "./styles";
import { deleteProduct } from "actions/products";

const initialUploadState = {
  title: undefined,
  description: undefined,
  pages: undefined,
  orientation: "japanese", // or "english"
  age_rating: "teens", // all_ages, young_adults, adults
  release_date: moment().format(),
  product_type: "digital",
  cover: undefined,
  agreeTerms: false,
  sku: undefined,
};

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Stall() {
  const { userId } = useParams();
  const currentUser = useSelector(selectUserStallView);
  const user = useSelector(selectUserById(userId));
  const productsState = useSelector(selectProductsState);
  const { fetchingProducts, finishedFetchingProducts } = productsState;
  const { uploading, uploadingFinished } = useSelector(selectStallState);
  const dispatch = useDispatch();

  const myStallView = !userId && currentUser.id;
  const viewingUser = myStallView
    ? normaliseAuthorData(currentUser)
    : normaliseAuthorData(user);

  const userProducts = myStallView
    ? useSelector(selectUserProducts(currentUser.id))
    : useSelector(selectUserProducts(parseInt(userId)));

  const [uploadingManga, updateUploadingManga] = useState(false);
  const [uploadingMangaData, updateUploadingMangaData] = useState(undefined);
  const [coverPageNumber, updateCoverPageNumber] = useState(1);
  const [uploadingDetails, updateUploadingDetails] =
    useState(initialUploadState);
  // const [editingManga, updateEditingManga] = useState(undefined);

  useScrollTop();

  useEffect(() => {
    if (!uploading && uploadingFinished) {
      updateUploadingDetails(initialUploadState);
      updateUploadingManga(false);
    }
  }, [uploading, uploadingFinished]);

  useEffect(() => {
    if (!myStallView && viewingUser?.name) {
      const title = `${viewingUser.name} | Gday Punch`;
      document.title = title;
    }
  }, [viewingUser]);

  useEffect(() => {
    if (
      (currentUser.id || userId) &&
      isEmpty(userProducts) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      console.log(currentUser, userId);
      dispatch(fetchProducts(myStallView ? currentUser.id : userId));
    }
  }, [userProducts, fetchingProducts, userId, currentUser]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf";
    if (!isPdf) {
      message.error("You can only upload a PDF file!");
    }
    const isLt40M = file.size / 1024 / 1024 < 40;
    if (!isLt40M) {
      message.error("PDF must smaller than 40MB!");
    }
    return isPdf && isLt40M;
  };

  const handleChange = (info) => {
    getBase64(info.file.originFileObj, (mangaUrl) => {
      updateUploadingMangaData(mangaUrl);
      updateUploadingManga(true);
    });
  };

  const confirmBeforeDelete = (product) => {
    console.log(product);
    confirm({
      title: `Confirm Deleting Manga`,
      icon: <ExclamationCircleOutlined />,
      okText: "Confirm",
      content: (
        <ConfirmUploadSummary>
          <h4>{product.title}</h4>
          <img src={product.cover} />
          <div className="summary-item">
            <h4>{"Description"}</h4>
            <p>
              {removeHtml(product.description.substring(0, 100)).substring(
                0,
                90
              ) + "..."}
            </p>
          </div>
          <div className="summary-item">
            <h4>{"Reading Direction"}</h4>
            <p className="capitalize">{product.orientation}</p>
          </div>
          <div className="summary-item">
            <h4>{"Age Rating"}</h4>
            <p className="capitalize">{product.age_rating}</p>
          </div>
          <div className="summary-item">
            <h4>{"SKU"}</h4>
            <p>{product.sku}</p>
          </div>
          <div className="summary-item">
            <h4>{"Release Date"}</h4>
            <p>{moment(product.release_date).format("LLL")}</p>
          </div>
        </ConfirmUploadSummary>
      ),
      onOk() {
        dispatch(deleteProduct(product));
      },
      onCancel() {},
    });
  };

  return (
    <StallContainer className="App">
      {/* {editingManga ? (
        <MangaDetail
          editingManga={editingManga}
          coverPageNumber={coverPageNumber}
          uploadingMangaData={editingManga.pdf}
          uploadingDetails={editingManga}
        />
      ) : null} */}
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
          <Skeleton active avatar paragraph={{ rows: 3 }} />
        )}
      </FeaturedSection>
      <FeaturedSection idx={2}>
        <SectionTitle>Gallery</SectionTitle>
        <FeaturedList>
          {fetchingProducts && !userProducts.length && (
            <Skeleton
              className="ant-skeleton-for-tiles"
              active
              paragraph={{ rows: 5 }}
            />
          )}
          {fetchingProducts && !userProducts.length && (
            <Skeleton
              className="ant-skeleton-for-tiles"
              active
              paragraph={{ rows: 5 }}
            />
          )}
          {fetchingProducts && !userProducts.length && (
            <Skeleton
              className="ant-skeleton-for-tiles"
              active
              paragraph={{ rows: 5 }}
            />
          )}
          {userProducts.map((product) => {
            return product ? (
              <ProductTile
                editable={myStallView}
                key={`${product.id}_${product.quantity || 0}`}
                // editCallback={(manga) =>
                //   updateEditingManga(normaliseProductData(manga))
                // }
                deleteCallback={(mangaProd) =>
                  confirmBeforeDelete(normaliseProductData(mangaProd))
                }
                product={product}
              />
            ) : null;
          })}
          {myStallView ? (
            <div
              onClick={() =>
                uploadingMangaData ? updateUploadingManga(true) : null
              }
            >
              <Upload
                disabled={!!uploadingMangaData}
                name="manga-uploader"
                listType="picture-card"
                className={classNames("manga-uploader", { editing: false })}
                showUploadList={false}
                openFileDialogOnClick={true}
                customRequest={() => null}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                // onPreview={onPreview}
              >
                {!uploadingMangaData ? (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                ) : (
                  <div>
                    <FileAddOutlined />
                    <div style={{ marginTop: 8 }}>Adding Manga</div>
                  </div>
                )}
              </Upload>
            </div>
          ) : null}
        </FeaturedList>
      </FeaturedSection>
      <MangaDetail
        uploadingManga={uploadingManga}
        updateUploadingManga={updateUploadingManga}
        uploadingMangaData={uploadingMangaData}
        coverPageNumber={coverPageNumber}
        updateCoverPageNumber={updateCoverPageNumber}
        uploadingDetails={uploadingDetails}
        updateUploadingDetails={updateUploadingDetails}
      />
    </StallContainer>
  );
}

export default Stall;
