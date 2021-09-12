import styled from "styled-components";
import { Button } from "antd";

export const CouponsContainer = styled.div``;

export const CouponCreateContainer = styled.div`
  width: 50%;
  padding-top: 1em;
  height: 200px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
`;

export const SubmitButton = styled(Button)`
  width: inherit;
  align-self: flex-end;
`;
