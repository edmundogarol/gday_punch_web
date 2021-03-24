import styled from "styled-components";
import { Button } from "antd";

export const PromptsContainer = styled.div`
  width: 50%;
  padding-top: 1em;
  height: 150px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
`;

export const SubmitButton = styled(Button)`
  width: inherit;
  align-self: flex-end;
`;
