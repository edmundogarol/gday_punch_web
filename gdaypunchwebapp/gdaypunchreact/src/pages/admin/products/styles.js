import styled from "styled-components";
import { Button } from "antd";

export const ProductsContainer = styled.div``;

export const ProductCreateContainer = styled.div`
  width: 50%;
  padding-top: 1em;
  height: 350px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
`;

export const SubmitButton = styled(Button)`
  width: inherit;
  align-self: flex-end;
`;
