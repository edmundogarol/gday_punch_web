import styled from "styled-components";
import { Button, Input } from "antd";

export const ProductsContainer = styled.div``;

export const ProductCreateContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const SubmitButton = styled(Button)`
  width: inherit;
  align-self: flex-end;
`;

export const ProductLeftContainer = styled.div`
  width: 50%;
  display: flex;
  padding-top: 1em;
  height: 350px;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 2em;
`;

export const ProductRightContainer = styled.div`
  width: 50%;
  padding-top: 1em;
  margin-left: 2em;
`;

export const ProductTempImageFilenameInput = styled(Input)`
  margin-bottom: 1em;
`;
