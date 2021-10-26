import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import {
  Tooltip,
  Skeleton,
  Upload,
  message,
  Input,
  Button,
  Slider,
  Select,
  DatePicker,
  Radio,
} from "antd";
import { isEmpty } from "lodash";
import classNames from "classnames";
import { Document } from "react-pdf/dist/entry.webpack";
import { Page, pdfjs } from "react-pdf";
const { Option } = Select;

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
import { normaliseAuthorData } from "utils/users";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  StallContainer,
  ProfileDetails,
  SocialButton,
  EmptySection,
  MangaUploaderModal,
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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
    ? normaliseAuthorData(currentUser)
    : normaliseAuthorData(user) || initialUserStall;
  const userProducts = viewingUser
    ? useSelector(selectUserProducts(viewingUser.id))
    : [];

  const [uploadingManga, updateUploadingManga] = useState(false);
  const [uploadingMangaData, updateUploadingMangaData] = useState(undefined);
  const [coverPageNumber, updateCoverPageNumber] = useState(1);
  const [uploadingDetails, updateUploadingDetails] = useState({
    title: undefined,
    description: undefined,
    pages: undefined,
    orientation: "japanese", // or "english"
    age_rating: "teens", // all_ages, young_adults, adults
    release_date: undefined,
    cover: undefined,
  });

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

  console.log({ uploadingDetails, uploadingManga });
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
      <MangaUploaderModal
        width="80%"
        title="Manga Uploader"
        visible={uploadingManga}
        closeable={false}
        closeIcon={<div style={{ display: "none" }} />}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              updateUploadingManga(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            disabled={!uploadingDetails.title}
            type="primary"
            key="save"
            onClick={() => {
              console.log(uploadingDetails);
              console.log(
                uploadingDetails.cover[`img_p${coverPageNumber - 1}_1`].data
                  .currentSrc
              );
            }}
          >
            Upload
          </Button>,
        ]}
      >
        <div className="details">
          <h4>Manga Title</h4>
          <Input
            placeholder="Enter Manga Title"
            value={uploadingDetails.title}
            onChange={(e) =>
              updateUploadingDetails({
                ...uploadingDetails,
                title: e.target.value,
              })
            }
          />
          <h4>Description</h4>
          <ReactQuill
            theme="snow"
            placeholder="Enter Manga description"
            // value={uploadingDetails.description}
            onChange={(val) => {
              console.log(val);
              updateUploadingDetails({
                ...uploadingDetails,
                description: val,
              });
            }}
            style={{ minHeight: "300px" }}
          />
          <h4>Age Rating</h4>
          <Select
            defaultValue={"all_ages"}
            value={uploadingDetails.age_rating}
            onSelect={(val) =>
              updateUploadingDetails({
                ...uploadingDetails,
                age_rating: val,
              })
            }
          >
            <Option value="all_ages">All Ages</Option>
            <Option value="teens">Teens</Option>
            <Option value="young_adults">Young Adults</Option>
            <Option value="adults">Adults</Option>
          </Select>
          <h4>Reading Direction</h4>
          <Select
            defaultValue={"english"}
            value={uploadingDetails.orientation}
            onSelect={(val) =>
              updateUploadingDetails({
                ...uploadingDetails,
                orientation: val,
              })
            }
          >
            <Option value="japanese">Japanese (Left to Right)</Option>
            <Option value="english">English (Right to Left)</Option>
          </Select>
        </div>
        <div className="right-container">
          <div className="cover-preview">
            <h4 className="cover-title">Cover Preview</h4>
            <Document
              style={{ width: "30em" }}
              file={uploadingMangaData}
              width={150}
              options={{
                rangeChunkSize: 2000000,
              }}
              onLoadSuccess={(success) => {
                console.log({ success });
                if (!uploadingDetails.pages) {
                  updateUploadingDetails({
                    ...uploadingDetails,
                    pages: success._pdfInfo.numPages,
                  });
                }
              }}
            >
              <Page
                style={{ width: "10em" }}
                loading={"Hang on! Loading page..."}
                pageNumber={coverPageNumber}
                width={150}
                object-fit="fill"
                onRenderSuccess={null}
                size="A4"
                onLoadSuccess={(success) => {
                  updateUploadingDetails({
                    ...uploadingDetails,
                    cover: success.objs._objs,
                  });
                }}
              />
            </Document>
            <Slider
              min={1}
              value={coverPageNumber}
              defaultValue={1}
              onChange={(val) => updateCoverPageNumber(val)}
              max={uploadingDetails.pages}
            />
          </div>
          <h4>Release Date</h4>
          <DatePicker
            value={uploadingDetails.release_date}
            onChange={(val) =>
              updateUploadingDetails({ ...uploadingDetails, release_date: val })
            }
          />
          <h4>Upload Terms and Conditions</h4>
          <Radio value="agree">
            By checking and uploading, you are agreeing to our{" "}
            <NavLink to="/upload-conditions" target="_blank">
              Manga Upload Terms and Conditions
            </NavLink>{" "}
            to use our platform to share your manga.
          </Radio>
        </div>
      </MangaUploaderModal>
    </StallContainer>
  );
}

export default Stall;
