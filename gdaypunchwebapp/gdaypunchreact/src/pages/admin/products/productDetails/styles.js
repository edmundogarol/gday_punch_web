import styled from "styled-components";
import { Button, Image, Transfer, Input } from "antd";

export const ProductsContainer = styled.div`
  .ql-container {
    height: 86%;
  }
`;

export const FieldLabel = styled.label`
  margin-top: 1em;
  margin-bottom: 0.2em;
`;

export const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const SubmitButton = styled(Button)`
  margin-top: 1em;
  width: inherit;
  align-self: flex-end;
`;

export const ProductDetailLeftContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
`;

export const ProductDetailRightContainer = styled.div`
  width: 50%;
  margin-left: 2em;
  display: flex;
  flex-direction: column;
`;

export const ProductImage = styled(Image)`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  margin-bottom: 1em;

  .ant-image-img {
    max-height: 21em;
    width: unset;
  }
`;

export const ProductPriceTransfer = styled(Transfer)`
  display: flex;
  justify-content: center;
`;
