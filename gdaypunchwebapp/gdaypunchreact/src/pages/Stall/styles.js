import styled from "styled-components";
import { Button, Modal } from "antd";
import { device } from "utils/styles";
import { SectionTitle } from "components/sectionTitle";

export const MangaUploaderModal = styled(Modal)`
  max-width: 72em;

  .right-container {
    display: flex;
    flex-direction: column;
    width: 20em;
    width: 100%;
    min-width: 20em;
    height: 100%;

    @media ${device.laptop} {
      width: 47%;
    }

    .cover-preview {
      padding: 2em;
      border: 1px solid #d9d9d9;
      margin-bottom: 1em;

      canvas {
        margin-right: auto;
        margin-left: auto;
      }

      .cover-title {
        margin-bottom: 1em;
      }

      .react-pdf__Document {
        margin-bottom: 1em;
      }
    }

    .ant-picker-input {
      height: 3em;
    }
    .ant-picker {
      margin-bottom: 1em;
    }

    .ant-checkbox-wrapper {
      height: max-content;
      padding: 1em;
      border: 1px solid #c5c5c5;
      white-space: pre-wrap;
      padding-top: 1em;
      padding-bottom: 1em;
    }

    .sku-input {
      margin-bottom: 1em;
      height: 4em;
    }

    .ant-alert-error {
      margin-bottom: 1em;
    }
  }

  .ant-modal-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .details {
    width: 100%;

    @media ${device.laptop} {
      width: 47%;
      margin-right: 2em;
    }

    input {
      margin-bottom: 1em;
      height: 4em;
    }

    textarea {
      padding: 1em;
    }

    .ant-input-textarea {
      margin-bottom: 1em;
    }

    .ant-select {
      width: 100%;
      margin-bottom: 1em;

      .ant-select-selector {
        height: 4em;
        padding: 1em;
      }
    }

    .ql-container {
      height: 19em;
    }
  }

  .ant-modal-body {
    position: relative;

    .ant-spin {
      position: absolute;
      display: flex;
      margin-right: auto;
      left: 0;
      right: 0;
      align-items: center;
      width: 100%;
      justify-content: center;
      height: 100%;
      z-index: 2;
      background: #ffffff87;

      .ant-icon,
      .anticon-spin {
        height: 4em;
        width: 4em;
      }
    }
  }
`;

export const BioSave = styled.div`
  position: absolute;
  bottom: 0.3em;
  right: 0;
`;

export const BioPreview = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1em;
  height: max-content;
  padding-top: unset;
`;

export const ConfirmUploadSummary = styled.div`
  padding: 1em;
  border: 1px solid #bdbdbd;
  margin-right: 2em;
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    height: 10em;
    width: max-content;
  }

  .summary-item {
    display: grid;
    width: 100%;
    margin-top: 1em;
    grid-template-columns: 1fr 1fr;

    p {
      word-break: break-all;
    }
  }
  .capitalize {
    text-transform: capitalize;
  }

  position: relative;

  .ant-spin {
    position: absolute;
    display: flex;
    margin-right: auto;
    left: 0;
    right: 0;
    align-items: center;
    width: 100%;
    justify-content: center;
    height: 100%;
    z-index: 2;
    background: #ffffff87;

    .ant-icon,
    .ant-spin-dot,
    .anticon-spin {
      height: 4em;
      width: 4em;
    }
  }
`;

export const FollowingModal = styled(Modal)`
  .ant-modal-body {
    max-height: 20em;
    overflow: scroll;
  }

  .ant-modal-content {
    width: 24em;

    .following {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      align-items: center;

      display: grid;
      grid-template-columns: 1fr 3fr;

      h4 {
        margin: unset;
      }

      a {
        color: #3c3c3c;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const StallContainer = styled.div`
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

  .bio {
    color: dimgray;
    margin-bottom: 1.5em;
    font-style: italic;
    max-width: 50em;
    padding-left: 2em;
    padding-right: 2em;
    text-align: left;
    margin-left: auto;
    margin-right: auto;

    @media ${device.laptop} {
      padding-left: unset;
    }
  }

  .socials {
    display: flex;
    min-width: max-content;
  }

  .empty-section {
    position: relative;
    height: 20em;
    width: 100%;
  }

  .ant-skeleton {
    width: 90%;
  }

  @media ${device.mobileM} {
    .ant-skeleton {
      width: 17em;
      margin: 1em;
    }
  }

  @media ${device.tabletL} {
    .ant-skeleton {
      width: 26em;
      margin: 1em;
    }
  }

  @media ${device.laptop} {
    .ant-skeleton {
      width: 50em;
      margin: 1em;
    }
  }

  .manga-uploader {
    margin: 20pt;
    width: unset;
    display: flex;
    align-items: center;
    height: 20em;
  }

  .ant-skeleton-for-tiles {
    width: 10em;
    height: 10em;
    margin: 2em;
  }

  .cover-uploader {
    .ant-upload {
      background: transparent;
      border: none;
      cursor: initial;
    }

    .anticon-edit,
    .anticon-save {
      path {
        fill: dimgrey;
        stroke: white;
        stroke-width: 3em;
        stroke-linejoin: round;
      }
    }
  }
`;

export const ProfileDetails = styled.div`
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0.5em;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;

  ${SectionTitle} {
    margin: 0.5em;
  }

  @media ${device.mobileM} {
    width: 17em;
    margin: 2em;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;

    ${SectionTitle} {
      margin: 0.5em;
    }
  }

  @media ${device.tabletL} {
    width: 26em;
    margin: 2em;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;

    ${SectionTitle} {
      margin: unset;
      margin-right: 0.5em;
    }
  }

  @media ${device.laptop} {
    width: unset;
    flex-wrap: unset;
  }

  ${SectionTitle} {
    text-transform: none;
    text-shadow: 0.07em 0em white, -0.07em 0em white, 0em 0.07em white,
      0em -0.07em white, 0.07em 0.07em white, -0.07em 0.07em white,
      -0.07em -0.07em white, 0.07em -0.07em white;
  }
`;

export const EmptySection = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50%;

  div {
    display: flex;
    align-content: center;
    justify-content: center;
  }

  h4 {
    color: dimgray;
  }

  h2 {
    margin-bottom: unset;
    color: #efa114;
    text-decoration: underline;
    cursor: pointer;
  }

  svg {
    height: 2em;
    width: 2em;
    margin-left: 1em;
    color: #efa114;
  }
`;

export const SocialButton = styled(Button)`
  width: 10em;
  margin: 0.5em;
`;
