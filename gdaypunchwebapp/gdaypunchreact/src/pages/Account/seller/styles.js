import styled from "styled-components";
import { Modal } from "antd";
import { device } from "utils/styles";

export const SellerContainer = styled.div`
  .desktop {
    display: none;
  }

  @media ${device.tablet} {
    .mobile {
      display: none;
    }
    .desktop {
      display: initial;

      .center {
        p {
          margin-bottom: unset;
        }
      }
    }
  }

  .ant-table-cell {
    p {
      margin: unset;
    }
  }
`;

export const SellerDetailsModal = styled(Modal)`
  width: 100%;
  max-width: 100%;

  @media ${device.laptop} {
    max-width: 72em;
  }

  .ant-modal-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .details {
    width: 100%;

    @media ${device.laptop} {
      margin-right: 2em;
    }

    input {
      margin-bottom: 1em;
      height: 4em;
    }

    textarea {
      padding: 1em;
    }

    .ant-input-textarea {
      margin-bottom: 1em;
    }

    .ant-select {
      width: 100%;
      margin-bottom: 1em;

      .ant-select-selector {
        height: 4em;
        padding: 1em;
      }
    }

    .ql-container {
      height: 19em;
    }
  }

  .ant-modal-body {
    position: relative;
  }
`;
