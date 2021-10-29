import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter, useParams, NavLink } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import classNames from "classnames";
import { pdfjs } from "react-pdf";
import moment from "moment";
import { Tooltip, Skeleton, Upload, message, Modal, Button, Input } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  LikeOutlined,
  FileAddOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  UserSwitchOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;
const { TextArea } = Input;

import Header from "components/header";
import ProductTile from "components/ProductTile/ProductTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import UserAvatar from "components/UserAvatar";
import MangaDetail from "./MangaDetail";
import { fetchProducts, submitContactForm } from "actions/app";
import {
  selectLoggedIn,
  selectProductsState,
  selectUser,
  selectUserByIdOrCurrentUser,
  selectUserProducts,
} from "selectors/app";
import { selectStallState } from "selectors/stall";
import {
  getGdayPunchResourceUrl,
  getGdayPunchStaticUrl,
  hasPrivilege,
  makeSafeUrl,
  removeHtml,
  scrollToTop,
} from "utils/utils";
import { normaliseProductData } from "utils/manga";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  StallContainer,
  ProfileDetails,
  SocialButton,
  ConfirmUploadSummary,
  FollowingModal,
  BioSave,
  BioPreview,
} from "./styles";
import { deleteProduct } from "actions/products";
import {
  fetchFollowings,
  fetchStallData,
  resetStallChecks,
  followUser,
  unfollowUser,
  doUpdateUserDetails,
  openRegistration,
  doSuggestRegister,
} from "actions/user";

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

function Stall({ history }) {
  const { userId } = useParams();
  const loggedIn = useSelector(selectLoggedIn);
  const currentUser = useSelector(selectUser);
  const myStallView = !userId;

  const user = useSelector(selectUserByIdOrCurrentUser(userId));
  const userProducts = useSelector(
    selectUserProducts(myStallView ? currentUser.id : user?.id)
  );
  const productsState = useSelector(selectProductsState);
  const { fetchingProducts } = productsState;
  const {
    uploading,
    uploadingFinished,
    fetching,
    fetchingFinished,
    fetchingErrors,
  } = useSelector(selectStallState);
  const dispatch = useDispatch();

  const [followingModalOpen, updateFollowingModalOpen] = useState(false);
  const [uploadingManga, updateUploadingManga] = useState(false);
  const [uploadingMangaData, updateUploadingMangaData] = useState(undefined);
  const [newCover, updateNewCover] = useState(undefined);
  const [coverLoading, toggleCoverLoading] = useState(false);
  const [coverPageNumber, updateCoverPageNumber] = useState(1);
  const [uploadingDetails, updateUploadingDetails] =
    useState(initialUploadState);
  const [editingBio, toggleEditingBio] = useState(undefined);
  const [newBio, updateNewBio] = useState(undefined);
  // const [reportDetails, updateReportDetails] = useState(undefined);
  // const reportRef = useRef(reportDetails);
  // const [editingManga, updateEditingManga] = useState(undefined);

  useScrollTop();

  useEffect(() => {
    if (!uploading && uploadingFinished) {
      updateUploadingDetails(initialUploadState);
      updateUploadingManga(false);
    }
  }, [uploading, uploadingFinished]);

  useEffect(() => {
    if (!myStallView && user?.name) {
      const title = `${user.name} | Gday Punch`;
      document.title = title;
    }
  }, [user]);

  useEffect(() => {
    if (parseInt(userId) === currentUser.id) {
      history.replace("/my-stall");
    }
  }, [userId, currentUser]);

  // useEffect(() => {
  //   reportRef.current = reportDetails;
  // }, [reportDetails]);

  useEffect(() => {
    if (
      userId &&
      !fetching &&
      !fetchingProducts &&
      !fetchingFinished &&
      !fetchingErrors
    ) {
      dispatch(fetchProducts(userId));
      dispatch(fetchStallData(userId));
    } else if (
      currentUser.id &&
      !fetching &&
      !fetchingFinished &&
      !fetchingProducts &&
      !fetchingErrors
    ) {
      dispatch(fetchProducts(currentUser.id));
      dispatch(fetchStallData(currentUser.id));
    }
  }, [
    fetching,
    fetchingFinished,
    fetchingProducts,
    fetchingErrors,
    myStallView,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetStallChecks());
    };
  }, []);

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

  const beforeCoverUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload an image (PNG or JPG) file!");
    }
    const isLt40M = file.size / 1024 / 1024 < 4;
    if (!isLt40M) {
      message.error("Image must smaller than 4MB!");
    }
    return isJpgOrPng && isLt40M;
  };

  const handleCoverChange = (info) => {
    toggleCoverLoading(true);
    getBase64(info.file.originFileObj, (coverUrl) => {
      message.warn(
        "Like your NEW cover? Save now (bottom right) before you forget!",
        7
      );
      updateNewCover(coverUrl);
      toggleCoverLoading(false);
    });
  };

  const updateBio = (bio) => {
    return {
      __html: bio,
    };
  };

  const confirmBeforeDelete = (product) => {
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

  const reportUser = () => {
    let reportDetails = undefined;

    const handleReport = () => {
      if (!reportDetails?.length) {
        message.error(
          "Please add details to your report to help us better deal with the problem."
        );
      } else {
        dispatch(
          submitContactForm({
            name: currentUser.author_details.name,
            email: currentUser.email,
            reason: "report",
            content: JSON.stringify({
              id: user.id,
              name: user.name,
              content: reportDetails,
            }),
          })
        );
        message.success(
          "Report submitted! We will get back to you as soon as possible."
        );
      }
    };

    confirm({
      title: `Reporting user: ${user.name}`,
      icon: <ExclamationCircleOutlined />,
      okText: "Submit",
      content: (
        <ConfirmUploadSummary>
          <div className="summary-item">
            <h4>{"User"}</h4>
            <p>{user.name}</p>
          </div>
          <div className="summary-item">
            <h4>{"Report Date"}</h4>
            <p>{moment(moment.now()).format("LLL")}</p>
          </div>
          <TextArea
            rows={5}
            value={reportDetails}
            placeholder="Report details"
            onChange={(e) => (reportDetails = e.target.value)}
          />
        </ConfirmUploadSummary>
      ),
      onOk() {
        handleReport();
      },
      onCancel() {},
    });
  };

  const removeCover = () => {
    confirm({
      title: `Remove cover of [${user.name}]?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Remove",
      onOk() {
        dispatch(doUpdateUserDetails({ cover: "remove", user_id: user.id }));
      },
      onCancel() {},
    });
  };

  const removeAvatar = () => {
    confirm({
      title: `Remove avatar of [${user.name}]?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Remove",
      onOk() {
        dispatch(doUpdateUserDetails({ avatar: "remove", user_id: user.id }));
      },
      onCancel() {},
    });
  };

  const handleFollow = () => {
    if (!loggedIn) {
      scrollToTop();
      dispatch(openRegistration());
      dispatch(
        doSuggestRegister("Info: Sign up or Log in to follow this account!")
      );
      history.push("/");
      return;
    } else {
      dispatch(
        user.following ? unfollowUser(user.following) : followUser(user.id)
      );
    }
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
      {user?.following_users?.length ? (
        <FollowingModal
          visible={user.following_users.length && followingModalOpen}
          title="Following"
          cancelButtonProps={{ style: { display: "none" } }}
          onCancel={() => updateFollowingModalOpen(false)}
          onOk={() => updateFollowingModalOpen(false)}
        >
          <div>
            {user.following_users.map((follow) => {
              return (
                <div className="following" key={follow.id}>
                  <UserAvatar author={follow} />
                  <h4>
                    <NavLink
                      to={`/stall/${follow.id}/${makeSafeUrl(follow.name)}`}
                    >
                      {follow.name}
                    </NavLink>
                  </h4>
                </div>
              );
            })}
          </div>
        </FollowingModal>
      ) : null}
      <Header
        editing={newCover}
        loading={coverLoading}
        editable={
          myStallView || hasPrivilege(currentUser, "admin") ? (
            <ImgCrop aspect={3 / 1} rotate shape="rect" quality={0.2}>
              <Upload
                disabled={!!uploadingMangaData}
                name="cover-uploader"
                listType="picture-card"
                className={classNames("cover-uploader", { editing: false })}
                showUploadList={false}
                openFileDialogOnClick={true}
                customRequest={() => null}
                beforeUpload={beforeCoverUpload}
                onChange={handleCoverChange}
                // onPreview={onPreview}
              >
                {hasPrivilege(currentUser, "admin") ? (
                  <Tooltip title="Remove Cover">
                    <DeleteOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCover();
                      }}
                    />
                  </Tooltip>
                ) : null}
                {newCover ? (
                  <Tooltip title="Save Changes">
                    <SaveOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(doUpdateUserDetails({ cover: newCover }));
                      }}
                    />
                  </Tooltip>
                ) : null}
                <Tooltip title={newCover ? "Cancel" : "Change Cover"}>
                  {newCover ? (
                    <CloseOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        newCover ? updateNewCover(undefined) : null;
                      }}
                    />
                  ) : (
                    <EditOutlined />
                  )}
                </Tooltip>
              </Upload>
            </ImgCrop>
          ) : null
        }
        background={
          newCover
            ? newCover
            : user?.cover
            ? getGdayPunchStaticUrl(user.cover)
            : getGdayPunchResourceUrl("launch-background.png")
        }
      >
        <UserAvatar author={user} />
        {hasPrivilege(currentUser, "admin") ? (
          <Tooltip title="Remove Avatar">
            <DeleteOutlined
              className="avatar-delete"
              onClick={(e) => {
                e.stopPropagation();
                removeAvatar();
              }}
            />
          </Tooltip>
        ) : null}
      </Header>
      <FeaturedSection idx={1}>
        {user ? (
          <>
            <ProfileDetails>
              <SectionTitle>{user.name}</SectionTitle>
              <div className="stats">
                <Tooltip title="Friends (Coming Soon)">
                  <div className="icon-amount-container coming-soon">
                    <UserAddOutlined className="site-form-item-icon" />
                    <span className="amount">{user.friends}</span>
                  </div>
                </Tooltip>
                <Tooltip title="Following">
                  <div
                    className="icon-amount-container"
                    onClick={() => {
                      if (!user?.following_users?.length) {
                        dispatch(fetchFollowings(user.id));
                      }
                      updateFollowingModalOpen(true);
                    }}
                  >
                    <UserSwitchOutlined className="site-form-item-icon" />
                    <span className="amount">{user.followings}</span>
                  </div>
                </Tooltip>
                <Tooltip title="Followers">
                  <div className="icon-amount-container">
                    <TeamOutlined className="site-form-item-icon" />
                    <span className="amount">{user.followers}</span>
                  </div>
                </Tooltip>
                <Tooltip title="Manga Likes">
                  <div className="icon-amount-container">
                    <LikeOutlined className="site-form-item-icon" />
                    <span className="amount">{user.likes}</span>
                  </div>
                </Tooltip>
              </div>
              {!myStallView && user.id ? (
                <div className="socials">
                  <SocialButton type="primary" onClick={() => handleFollow()}>
                    {!user.following ? "Follow" : "Unfollow"}
                  </SocialButton>
                  {/* <Tooltip title="Coming Soon">
                    <SocialButton type="primary" disabled>
                      Add Friend
                    </SocialButton>
                  </Tooltip> */}
                  {!myStallView && loggedIn && (
                    <Tooltip title="Report User">
                      <SocialButton
                        type="default"
                        icon={<ExclamationCircleOutlined />}
                        onClick={() => reportUser()}
                      >
                        Report
                      </SocialButton>
                    </Tooltip>
                  )}
                </div>
              ) : null}
            </ProfileDetails>
            {editingBio ? (
              <ReactQuill
                theme="snow"
                placeholder="Enter Bio"
                defaultValue={user.bio}
                onChange={(val) => {
                  updateNewBio(val);
                }}
                style={{ maxWidth: "41em", paddingBottom: "3em" }}
              />
            ) : null}
            {!editingBio ? (
              <BioPreview>
                <p
                  className="bio"
                  dangerouslySetInnerHTML={updateBio(user.bio || `No bio.`)}
                ></p>
                {myStallView ? (
                  <Tooltip title="Edit Bio">
                    <EditOutlined onClick={() => toggleEditingBio(true)} />
                  </Tooltip>
                ) : null}
              </BioPreview>
            ) : null}
            {editingBio ? (
              <BioSave>
                <Button onClick={() => toggleEditingBio(false)}>Cancel</Button>
                <Button
                  disabled={!newBio}
                  onClick={() => {
                    if (newBio.length > 500) {
                      message.error(
                        "Bio is too long. Please reduce it and try again."
                      );
                    } else if (newBio.includes(`<a href="http`)) {
                      message.error(
                        "Bio links are only available to seller accounts. Please remove the link and try again."
                      );
                    } else {
                      dispatch(doUpdateUserDetails({ bio: newBio }));
                    }
                  }}
                >
                  Save
                </Button>
              </BioSave>
            ) : null}
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
                editable={myStallView || hasPrivilege(currentUser, "admin")}
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

export default withRouter(Stall);
