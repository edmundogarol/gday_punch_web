import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 56vh;
`;

export const ProductContainer = styled.div`
  padding-top: 6em;
`;

export const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const ProductDetailLeftContainer = styled.div`
  width: 50%;
  display: flex;
  padding-top: 1em;
  height: 550px;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 2em;

  .ant-image {
    width: max-content;
  }
`;

export const ProductDetailRightContainer = styled.div`
  width: 50%;
  padding-top: 1em;
  margin-left: 2em;
`;
