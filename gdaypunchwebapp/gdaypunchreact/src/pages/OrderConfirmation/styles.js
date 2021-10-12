import styled from "styled-components";
import { device } from "utils/styles";

export const PageContainer = styled.div`
  min-height: 84vh;

  .ant-spin {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: scale(2.5);
    font-size: 0.4em;
  }

  .fill-under-nav {
    height: 8em;
  }

  .server-success {
    .ant-result-title {
      color: #64c50cd9;
    }
  }

  .ant-result {
    padding-top: 5em;

    .ant-btn {
      background: orange;
      border: none;
      padding: 1.5em;
      display: flex;
      align-items: center;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .order-viewing-error {
    padding-top: 10em;
    text-align: center;
  }
`;

export const StatusContainer = styled.div`
  margin-bottom: 1em;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1em;
  font-weight: 600;
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
  align-items: center;

  div {
    font-weight: 100;
    margin-left: 0.4em;
    font-size: 0.8em;
    min-width: max-content;
  }
`;
