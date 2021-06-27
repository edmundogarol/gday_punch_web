import styled from "styled-components";
import { Button, Image, Transfer } from "antd";

export const ProductsContainer = styled.div``;

export const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const SubmitButton = styled(Button)`
  width: inherit;
  align-self: flex-end;
`;

export const ProductDetailLeftContainer = styled.div`
  width: 50%;
  display: flex;
  padding-top: 1em;
  height: 550px;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 2em;
`;

export const ProductDetailRightContainer = styled.div`
  width: 50%;
  padding-top: 1em;
  margin-left: 2em;
`;

export const ProductImage = styled(Image)`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  margin-bottom: 1em;

  .ant-image-img {
    width: auto;
    height: auto;
  }
`;

export const ProductPriceTransfer = styled(Transfer)`
  display: flex;
  justify-content: center;
`;
