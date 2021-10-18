import React, { useRef } from "react";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import classNames from "classnames";
import { LoadingOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { getGdayPunchResourceUrl, getGdayPunchStaticUrl } from "utils/utils";
import Image from "components/image";

function Ui(props) {
  const {
    editing,
    imageUrl,
    updateImageUrl,
    loading,
    toggleLoading,
    toggleEditingProfile,
  } = props;

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    toggleLoading(true);

    getBase64(info.file.originFileObj, (imageUrl) => {
      updateImageUrl(imageUrl);
      toggleLoading(false);
    });
  };

  const onPreview = async (file) => {
    let src = file?.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        if (typeof file === "blob") {
          reader.readAsDataURL(file?.originFileObj);
          reader.onload = () => resolve(reader.result);
        }
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotate shape="round" quality={0.2}>
      <Upload
        disabled={!editing}
        name="avatar"
        listType="picture-card"
        className={classNames("avatar-uploader", { editing })}
        showUploadList={false}
        openFileDialogOnClick={true}
        customRequest={() => null}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={onPreview}
      >
        {editing ? (
          <div className="edit-hover">
            {loading ? <LoadingOutlined /> : <EditOutlined />}
            <div style={{ marginTop: 8 }}>Edit</div>
          </div>
        ) : null}
        {imageUrl ? (
          !editing ? (
            <Image src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            <img src={imageUrl} alt="User Avatar" style={{ width: "100%" }} />
          )
        ) : !editing ? (
          <img
            src={getGdayPunchResourceUrl("default-avatar.png")}
            alt="User Avatar"
            style={{ width: "100%" }}
          />
        ) : (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </ImgCrop>
  );
}

export default Ui;
