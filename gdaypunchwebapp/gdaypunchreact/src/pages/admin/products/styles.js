import styled from "styled-components";
import { Button, Input } from "antd";

export const ProductsContainer = styled.div`
  .interval {
    color: dimgray;
    font-size: 0.8em;
    margin-left: 0.4em;
  }

  .ql-container {
    height: 86%;
  }
`;

export const FieldLabel = styled.label`
  margin-top: 1em;
  margin-bottom: 0.2em;
`;

export const ProductCreateContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const SubmitButton = styled(Button)`
  margin-top: 1em;
  width: inherit;
  align-self: flex-end;
`;

export const ProductLeftContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
`;

export const ProductRightContainer = styled.div`
  width: 50%;
  margin-left: 2em;
  display: flex;
  flex-direction: column;
`;
