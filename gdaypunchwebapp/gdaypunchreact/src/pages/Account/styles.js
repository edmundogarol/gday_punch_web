import { FeaturedChildrenContainer } from "src/components/featuredSection";
import styled from "styled-components";
import { device } from "utils/styles";
import { Button } from "antd";
import { ErrorField } from "components/errorField";

export const App = styled.div`
  min-height: 84vh;

  @media (min-width: 1024px) {
    .ant-tabs {
      width: 59em !important;
    }
  }

  .gdaypunch-subscriptions {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .ant-tabs {
    margin-bottom: 2em;

    @media ${device.laptop} {
      width: 50em;
    }
  }

  ${FeaturedChildrenContainer} {
    width: 90%;

    @media ${device.laptop} {
      width: unset;
    }
  }

  ${ErrorField} {
    font-size: 1em;
  }

  .ant-tabs-content {
    text-align: start;
  }

  .non-first-tab {
    margin-top: 1em;
  }

  .ant-card-extra {
    display: flex;

    .disabled {
      color: rgba(0, 0, 0, 0.25);

      &:hover {
        opacity: 1 !important;
      }
    }
  }

  .ant-card-body {
    .spinner {
      margin-left: 50%;
    }
  }

  .desktop-only {
    display: none;
  }
  @media ${device.laptop} {
    .desktop-only {
      display: table-cell;
    }
  }

  .status {
    svg {
      margin-left: 1em;
    }
  }

  .pending {
    svg {
      color: orange;
      margin-right: 0.3em;
    }
  }
  .purchased {
    svg {
      color: #32ca32;
      margin-right: 0.3em;
    }
  }
  .shipped {
    svg {
      color: #32ca32;
      margin-right: 0.3em;
    }
  }
  .declined {
    svg {
      color: #e62020;
      margin-right: 0.3em;
    }
  }
  .refunded {
    svg {
      color: #dab502;
      margin-right: 0.3em;
    }
  }
  .partially_refunded {
    svg {
      color: #dab502;
      margin-right: 0.3em;
    }
  }

  .avatar {
    label {
      display: flex;
      align-items: center;
    }
  }

  .ant-upload {
    border-radius: 6em;
    position: relative;

    div {
      display: block;
    }

    img {
      border-radius: 6em;
    }

    .edit-hover {
      display: none;
    }

    &:hover {
      .edit-hover {
        opacity: 0.5;
        position: absolute;
        background: white;
        display: flex;
        height: 8em;
        width: 8em;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #181818;
        font-weight: 500;
        z-index: 2;
      }
    }
  }

  .editing {
    .ant-upload-select-picture-card {
      border: 5px dashed #d9d9d9;
    }
  }

  .ant-upload-disabled {
    &:hover {
      cursor: pointer;
    }
  }
`;

export const DetailField = styled.div`
  display: grid;
  grid-template-columns: 9.1em auto 1fr 1fr;
  text-align: start;
  column-gap: 16px;

  ${(props) =>
    props.noLabel
      ? `
      grid-template-columns: 50% auto 1fr;
    `
      : ""}

  ${(props) =>
    props.$bankAccount
      ? `
      // grid-template-columns: 9.1em 2.2em 7em 5em 8.2em;
      grid-template-columns: repeat(auto-fill, 5em);
      `
      : ""}

  .unset {
    color: #b7b7b7;
  }

  .error {
    color: #ff5656;
    text-align: end;
  }

  div {
    display: flex;
    justify-content: flex-end;
  }
`;

export const EditButton = styled(Button)`
  width: min-content;
  background: transparent;
  border: none;
  justify-self: end;
  padding: unset;
  color: dimgray;
  height: min-content;
  box-shadow: unset;
  -webkit-box-shadow: unset;
  border-radius: unset;

  ${(props) =>
    props.separator
      ? `
    padding-right: 0.5em;
    border-right: 1px solid #b7b7b7;
    margin-right: 0.5em;
    `
      : ""}

  &:active, :hover, :visited, :focus {
    color: dimgray;
    background: transparent;
    border: none;

    ${(props) =>
      props.separator
        ? `
      border-right: 1px solid #b7b7b7;
      `
        : ""}
  }
`;

export const SuccessLabel = styled.label`
  color: #4fbf4f;
  background: #deffde;
  padding: 0.7em;
  border-radius: 4pt;
`;

export const SubscriptionItem = styled.div`
  margin-top: 1em;
  height: 40em;
  width: 28em;
  display: flex;
  flex-direction: column;
  border: 1px solid #d8d8d8;
  padding: 1em;
  border-radius: 0.5em;
  margin-right: 1em;
  position: relative;

  ${(props) => (props.purchased ? "border: 4px solid #ffeac4;" : "")}

  h3 {
    text-align: center;
  }

  .ant-image {
    height: 47%;
    display: flex;
    justify-content: center;
    padding: 1em;

    img {
      height: 100%;
      width: unset;
    }
  }

  .title-price {
    text-align: center;

    h2 {
      font-size: 1.6em;
      margin-bottom: unset;
    }
    p {
      margin-bottom: unset;
    }
  }

  .details-container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1em;
    font-size: 0.8em;

    p {
      margin: unset;
    }
  }

  .ant-btn {
    position: absolute;
    bottom: 1em;
    width: 79%;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    height: 3em;
  }

  .not-purchased {
    .subscribe-now {
      display: none;
    }

    &:hover {
      .not-subscribed {
        display: none;
      }
      .subscribe-now {
        display: initial;
      }
    }
  }
`;
