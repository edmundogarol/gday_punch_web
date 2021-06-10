import styled from "styled-components";
import { Button } from "antd";

export const StripeProductsContainer = styled.div``;

export const StripeProductCreateContainer = styled.div`
  width: 50%;
  padding-top: 1em;
  height: 150px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
`;

export const SubmitButton = styled(Button)`
  width: inherit;
  align-self: flex-end;
`;
