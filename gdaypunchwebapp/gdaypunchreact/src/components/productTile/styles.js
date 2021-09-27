import styled from "styled-components";
import Image from "components/image";

export const ProductTileContainer = styled.div`
  margin: 20pt;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: start;
  min-width: 19em;

  a {
    width: 100%;

    &:hover {
      cursor: pointer;
    }
  }

  .img-link {
    width: 100%;
    max-height: 19em;

    img {
      width: 100%;
      max-height: 19em;
    }
  }

  img {
    &:hover {
      transition-duration: 0.3s;
      box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);
      -webkit-transform: scale(1.1);
      transform: scale(1.05);
    }
  }

  .ant-ribbon {
    transform: translate(0, 16em);
  }
`;

export const ProductImage = styled(Image)``;

export const ProductTitle = styled.h2`
  font-size: 1em;
  margin: unset;
  max-width: 19em;
  width: 100%;
`;

export const ProductAuthor = styled.h4`
  font-size: 0.8em;
  margin: unset;
  max-width: 12em;
  white-space: nowrap;
`;

export const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
  width: 100%;
  margin-top: 10pt;
  margin-bottom: 0.2em;

  a {
    text-decoration: none;
    color: black;
  }

  svg {
    color: dimgrey;
    height: 1em;

    &:hover {
      cursor: pointer;
      transition-duration: 0.3s;
      box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);
      -webkit-transform: scale(1.02);
      transform: scale(1.1);
    }
  }

  p {
    margin-bottom: unset;
    color: dimgray;
  }
`;

export const PriceLikeCommentConainer = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;

  .interval {
    margin-left: 0.5em;
    font-size: 0.8em;
    color: dimgrey;
    white-space: nowrap;
  }
`;

export const LikeCommentConainer = styled.div`
  display: flex;
  align-items: center;

  .anticon {
    svg {
      margin-left: 0.5em;
    }
  }

  .saved {
    svg {
      color: #e09200;
    }
  }
`;

export const NumberLabel = styled.span`
  margin-left: 0.3em;
  color: dimgrey;
`;

export const LowStock = styled.div``;

export const InteractionContainer = styled.a``;

export const ActionButton = styled.button`
  font-size: 0.9em;
  width: 100%;
  height: 3em;
  background: transparent;
  border: 2px solid ${(props) => (props.disabled ? "dimgrey" : "#d4882d")};
  color: ${(props) => (props.disabled ? "dimgrey" : "#d4882d")};
  font-weight: 600;
  text-transform: uppercase;
  background: linear-gradient(
    45deg,
    transparent 89%,
    ${(props) => (props.disabled ? "dimgrey" : "#d69e5a")} 30%,
    ${(props) => (props.disabled ? "dimgrey" : "#d69e5a")} 114%,
    transparent 5%
  );
  margin-bottom: 1em;

  ${(props) =>
    props.disabled
      ? ""
      : `&:hover {
    background: #ffbc6a;
    border: 2px solid #ffbc6a;
    color: white;
    cursor: pointer;
  }`}
`;
