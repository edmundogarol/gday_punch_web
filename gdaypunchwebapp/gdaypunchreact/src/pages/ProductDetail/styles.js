import styled from "styled-components";
import { device } from "utils/styles";

export const PageContainer = styled.div`
  min-height: 56vh;
`;

export const ProductContainer = styled.div`
  padding-top: 6em;
  min-height: 84vh;
  align-items: center;
  justify-content: center;
  display: flex;

  .ant-spin {
    transform: scale(2);
    filter: hue-rotate(165deg);
  }
`;

export const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 3em;
  margin-top: 2em;
  align-items: center;
`;

export const ProductDetailLeftContainer = styled.div`
  width: 25em;
  display: flex;
  padding-top: 1em;
  height: 27em;
  flex-direction: column;
  margin-bottom: 2em;
  align-items: center;
  justify-content: center;

  .ant-image-img {
    max-height: 29em;
    width: unset;
    max-width: 17em;
  }

  .ant-image {
    display: flex;
    justify-content: center;
  }
`;

export const CategoryLinks = styled.div`
  display: flex;
  font-size: 0.9em;
  margin-bottom: 3em;
  color: dimgray;

  span {
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  a {
    color: dimgray;
    &:hover {
      color: orange;
    }
  }
`;

export const ProductDetailRightContainer = styled.div`
  width: 100%;
  min-width: 20em;
  padding-top: 1em;
  margin-left: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 1em;

  @media ${device.laptop} {
    width: 46%;
  }

  p {
    white-space: pre-wrap;
    font-family: sans-serif;
    color: #464646;

    p {
      margin: unset;
    }
  }
`;

export const PriceSkuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 0em;
  border-bottom: 1px solid #dadada;
  margin-bottom: 0.7em;
  margin-right: 1em;

  .purchased,
  .free {
    font-size: 1em;
  }

  h4 {
    font-size: 1.7em;
  }

  .interval {
    margin-left: 0.5em;
    font-size: 0.6em;
    color: #848484;
    white-space: nowrap;
    font-weight: 100;
  }
`;

export const SkuContainer = styled.div`
  display: flex;

  label {
    margin-right: 1em;
    font-size: 1.2em;
    color: dimgray;
  }

  h4 {
    font-size: 1.2em;
    color: #cacaca;
  }
`;

export const MoreDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const LabelFieldContainer = styled.div`
  display: flex;
  margin-bottom: 1em;

  label {
    color: black;
    font-weight: 500;
    margin-right: 1em;
  }

  p {
    margin-bottom: unset;
  }
`;

export const SocialContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  height: 2em;
  margin-right: 1em;
  margin-bottom: 2em;

  svg {
    color: dimgray;
    height: 1.5em;
    width: 1.3em !important;
    margin: 0.4em;
  }
`;

export const MoreDetailsColumn = styled.div`
  width: 50%;
  margin-right: 2em;
`;

export const QuantityAddCartContainer = styled.div`
  width: 20em;
  justify-content: space-between;
  display: flex;

  label {
    align-items: center;
    display: flex;
  }

  .ant-select {
    width: 5em;

    .ant-select-selector {
      height: 100%;
      align-items: center;
    }
  }

  .ant-ribbon {
    transform: translate(0, -1em);
  }
`;

export const TitleInteractionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 1em;
`;

export const InteractionButton = styled.span`
  svg {
    margin-right: 0.3em;
    color: dimgrey;
  }

  &:hover {
    cursor: default;
  }
`;

export const LikeCommentConainer = styled.div`
  display: flex;
`;

export const NumberLabel = styled.span`
  padding-left: 0.3em;
  color: dimgrey;
`;

export const InteractionContainer = styled.div`
  svg {
    margin-left: 6pt;
  }
`;

export const ActionButton = styled.button`
  padding: 9pt;
  color: ${(props) => (props.disabled ? "dimgrey" : "#d68a00")};
  border: 3px solid ${(props) => (props.disabled ? "dimgrey" : "orange")};
  background: linear-gradient(
    45deg,
    transparent 89%,
    ${(props) => (props.disabled ? "dimgrey" : "#ffa12e")} 30%,
    ${(props) => (props.disabled ? "dimgrey" : "#d69e5a")} 114%,
    transparent 5%
  );

  ${(props) =>
    props.disabled
      ? ""
      : `
    &:hover {
      background: #ffbc6a;
      border: 3px solid #ffbc6a;
      color: white;
      cursor: pointer;
    }`}
`;
