import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Document } from "react-pdf/dist/entry.webpack";
import { Page, pdfjs } from "react-pdf";
import moment from "moment";

import {
  message,
  Input,
  Button,
  Slider,
  Select,
  DatePicker,
  Checkbox,
  Alert,
  Modal,
  Progress,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

import { selectStallState } from "selectors/stall";
import {
  skuValidator,
  descriptionValidator,
  titleValidator,
  noLinkValidator,
  priceValidator,
  sanitiseTooManyNewLines,
  removeHtml,
  hasPrivilege,
} from "utils/utils";

import { MangaUploaderModal, ConfirmUploadSummary } from "./styles";
import { uploadManga, uploadingMangaError } from "actions/manga";
import { selectUser } from "selectors/app";

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

function MangaDetail({
  editingManga,
  uploadingManga,
  updateUploadingManga,
  uploadingMangaData,
  updateUploadingMangaData,
  coverPageNumber,
  updateCoverPageNumber,
  uploadingDetails,
  updateUploadingDetails,
}) {
  const currentUser = useSelector(selectUser);
  const { uploading, uploadingFinished, uploadingErrors, uploadProgress } =
    useSelector(selectStallState);

  const dispatch = useDispatch();

  const [confirmUpload, toggleConfirmUpload] = useState(false);
  const [markForSale, toggleMarkForSale] = useState(false);

  const sellingValid = markForSale
    ? priceValidator(uploadingDetails.active_price)
    : true;

  useEffect(() => {
    if (!uploading && uploadingFinished && !uploadingErrors) {
      updateUploadingDetails(initialUploadState);
      updateUploadingMangaData(undefined);
      updateUploadingManga(false);
    }
  }, [uploading, uploadingFinished]);

  const updateDescription = (description) => {
    return {
      __html: description,
    };
  };

  const confirmBeforeUpload = () => {
    let imageArray;

    let imageRef = `img_p${coverPageNumber - 1}_1`;
    const nonErrorKind = uploadingDetails?.cover?.[imageRef]?.data?.kind === 3;
    const isArray = !!uploadingDetails?.cover?.[imageRef]?.data?.data;

    if (isArray && !nonErrorKind) {
      imageRef = `img_p${coverPageNumber - 1}_2`;
    }

    if (isArray) {
      if (uploadingDetails?.cover?.[imageRef]?.data?.kind !== 3) {
        message.warn(
          "Something seems to have gone wrong. Try changing the cover page or re-uploading.",
          4
        );
      }

      imageArray = uploadingDetails?.cover?.[imageRef]?.data?.data;

      const imagedata_to_image = (imagedata) => {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);

        var image = new Image();
        image.src = canvas.toDataURL();
        return image.src;
      };

      updateUploadingDetails({
        ...uploadingDetails,
        cover: {
          [`img_p${coverPageNumber - 1}_1`]: {
            data: {
              currentSrc: imagedata_to_image(
                new ImageData(
                  imageArray,
                  uploadingDetails.cover[imageRef].data.width
                )
              ),
            },
          },
        },
      });
    } else if (!uploadingDetails.cover[imageRef]?.data?.currentSrc) {
      message.warn(
        "Something seems to have gone wrong. Try changing the cover page or re-uploading.",
        4
      );
      return;
    }
    toggleConfirmUpload(true);
  };

  const handleUploadConfirmed = () => {
    dispatch(
      uploadManga(
        {
          title: uploadingDetails.title,
          description: sanitiseTooManyNewLines(uploadingDetails.description),
          sku: uploadingDetails.sku,
          release_date: uploadingDetails.release_date
            ? moment(uploadingDetails.release_date).format("YYYY-MM-DDThh:mm")
            : moment(new Date()).format("YYYY-MM-DDThh:mm"),
          age_rating: uploadingDetails.age_rating,
          page_count: uploadingDetails.pages,
          japanese_reading: uploadingDetails.orientation,
          product_type: uploadingDetails.product_type,
          active_price: uploadingDetails.active_price,
          manga: uploadingMangaData,
          image:
            uploadingDetails.cover[`img_p${coverPageNumber - 1}_1`].data
              .currentSrc,
        },
        history
      )
    );
  };

  const handleUpload = () => {
    const skuValid = skuValidator(uploadingDetails.sku);
    const descriptionValid = descriptionValidator(uploadingDetails.description);
    const descriptionValidNoLinks = noLinkValidator(
      uploadingDetails.description
    );
    const titleValid = titleValidator(uploadingDetails.title);
    const priceValid = priceValidator(uploadingDetails.active_price);
    const sellingValid = markForSale ? priceValid : true;

    // Client validators
    if (!skuValid) {
      message.error("Invalid SKU format.");
      dispatch(
        uploadingMangaError({
          sku: "Invalid SKU format. Must be letters, numbers and underscores only.",
        })
      );
    } else {
      dispatch(
        uploadingMangaError({
          sku: undefined,
        })
      );
    }

    if (!descriptionValid) {
      message.error("Description too short");
      dispatch(
        uploadingMangaError({
          description: "Please provide a longer description.",
        })
      );
    } else {
      dispatch(
        uploadingMangaError({
          description: undefined,
        })
      );
    }

    if (!descriptionValidNoLinks) {
      message.error(
        "Description cannot contain links. This feature is available to Seller accounts only.",
        7
      );
      dispatch(
        uploadingMangaError({
          description:
            "Please remove link. This feature is available to Seller accounts only.",
        })
      );
    } else {
      dispatch(
        uploadingMangaError({
          description: undefined,
        })
      );
    }

    if (!titleValid) {
      message.error("Title must not be empty.");
      dispatch(
        uploadingMangaError({
          title: "Title must not be empty",
        })
      );
    } else {
      dispatch(
        uploadingMangaError({
          title: undefined,
        })
      );
    }

    if (markForSale) {
      if (
        !priceValid &&
        uploadingDetails.active_price &&
        !uploadingDetails.active_price.length
      ) {
        message.error("Listing for sale must include a price.");
        dispatch(
          uploadingMangaError({
            active_price: "Listing for sale must include a price.",
          })
        );
      } else if (!priceValid) {
        message.error("Price must be in numbers and decimals only.");
        dispatch(
          uploadingMangaError({
            active_price: "Price must be in numbers and decimals only.",
          })
        );
      } else {
        dispatch(
          uploadingMangaError({
            active_price: undefined,
          })
        );
      }
    }

    if (
      titleValid &&
      descriptionValid &&
      descriptionValidNoLinks &&
      skuValid &&
      sellingValid
    ) {
      confirmBeforeUpload();
    }
  };

  return (
    <MangaUploaderModal
      width="80%"
      title="Manga Uploader"
      visible={uploadingManga || editingManga}
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
          loading={uploading}
          disabled={
            !uploadingDetails.title ||
            !uploadingDetails.description ||
            !uploadingDetails.agreeTerms ||
            !sellingValid
          }
          type="primary"
          key="save"
          onClick={() => handleUpload()}
        >
          Upload
        </Button>,
      ]}
    >
      {confirmUpload && (
        <Modal
          title="Confirm Manga Upload"
          visible={confirmUpload}
          icon={<ExclamationCircleOutlined />}
          okText="Confirm"
          onOk={() => {
            handleUploadConfirmed();
            toggleConfirmUpload(false);
          }}
          onCancel={() => toggleConfirmUpload(false)}
        >
          <ConfirmUploadSummary>
            <h4>{uploadingDetails.title}</h4>
            <img
              src={
                uploadingDetails.cover[`img_p${coverPageNumber - 1}_1`]?.data
                  ?.currentSrc
              }
            />
            <div className="summary-item">
              <h4>{"Description"}</h4>
              <p
                className="bio"
                dangerouslySetInnerHTML={updateDescription(
                  sanitiseTooManyNewLines(
                    removeHtml(uploadingDetails.description)
                  ).substring(0, 100) + "..." || `No bio.`
                )}
              ></p>
            </div>
            <div className="summary-item">
              <h4>{"Reading Direction"}</h4>
              <p className="capitalize">{uploadingDetails.orientation}</p>
            </div>
            <div className="summary-item">
              <h4>{"Age Rating"}</h4>
              <p className="capitalize">{uploadingDetails.age_rating}</p>
            </div>
            <div className="summary-item">
              <h4>{"SKU"}</h4>
              <p>{uploadingDetails.sku}</p>
            </div>
            <div className="summary-item">
              <h4>{"Release Date"}</h4>
              <p>{moment(uploadingDetails.release_date).format("LLL")}</p>
            </div>
          </ConfirmUploadSummary>
        </Modal>
      )}
      {uploading && <Progress percent={uploadProgress} status="active" />}
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
        {uploadingErrors?.title && (
          <Alert
            className="invalid-message"
            message={uploadingErrors?.title}
            type="error"
          />
        )}
        <h4>Description</h4>
        <ReactQuill
          theme="snow"
          placeholder="Enter Manga description"
          defaultValue={uploadingDetails.description}
          onChange={(val) => {
            updateUploadingDetails({
              ...uploadingDetails,
              description: val,
            });
          }}
          style={{ minHeight: "300px" }}
        />
        {uploadingErrors?.description && (
          <Alert
            className="invalid-message"
            message={uploadingErrors?.description}
            type="error"
          />
        )}
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
          <Option value="japanese">Japanese (Right to Left)</Option>
          <Option value="english">English (Left to Right)</Option>
        </Select>
        <h4>Page Count</h4>
        <Input value={uploadingDetails.pages} disabled />
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
          defaultValue={moment(uploadingDetails.release_date)}
          selected={moment(uploadingDetails.release_date)}
          onChange={(val) =>
            updateUploadingDetails({ ...uploadingDetails, release_date: val })
          }
        />
        {hasPrivilege(currentUser, "admin") && currentUser.seller_id && (
          <>
            <h4>Sell</h4>
            <Checkbox onChange={(e) => toggleMarkForSale(e.target.checked)}>
              List this manga for work for sale.
            </Checkbox>
          </>
        )}
        {markForSale && (
          <>
            <h4>Price $AUD</h4>
            <Input
              className="price-input"
              placeholder="Enter Manga Price ($AUD)"
              value={uploadingDetails.active_price}
              onChange={(e) => {
                var validNumber = /^\d*\.?\d*$/;
                if (e.target.value.match(validNumber)) {
                  updateUploadingDetails({
                    ...uploadingDetails,
                    active_price: e.target.value,
                  });
                }
              }}
            />
            {uploadingErrors?.active_price && (
              <Alert
                className="invalid-message"
                message={uploadingErrors?.active_price}
                type="error"
              />
            )}
            <h4>SKU/Code</h4>
            <Input
              className="sku-input"
              placeholder="Enter Manga SKU/Code"
              value={uploadingDetails.sku}
              onChange={(e) =>
                updateUploadingDetails({
                  ...uploadingDetails,
                  sku: e.target.value.toUpperCase(),
                })
              }
            />
            {uploadingErrors?.sku && (
              <Alert
                className="invalid-message"
                message={uploadingErrors?.sku}
                type="error"
              />
            )}
          </>
        )}
        <h4>Upload Terms and Conditions</h4>
        <Checkbox
          onChange={(e) =>
            updateUploadingDetails({
              ...uploadingDetails,
              agreeTerms: e.target.checked,
            })
          }
        >
          By checking and uploading, you are agreeing to our{" "}
          <NavLink to="/upload-conditions" target="_blank">
            Manga Upload and Selling Terms and Conditions
          </NavLink>{" "}
          to use our platform to share your manga.
        </Checkbox>
      </div>
    </MangaUploaderModal>
  );
}

export default MangaDetail;
