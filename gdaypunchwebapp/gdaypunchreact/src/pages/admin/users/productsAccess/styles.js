import styled from "styled-components";
import { device } from "utils/styles";
import { Modal } from "antd";

export const ProductsAccessModal = styled(Modal)`
  width: 100% !important;

  .ant-typography:not(.first) {
    margin-top: 1em;
  }

  .ant-transfer-list {
    width: 46%;
  }

  table,
  div {
    color: #525252;
  }

  .mobile {
    display: initial;
  }
  .desktop {
    display: none;
  }

  @media ${device.tablet} {
    width: 80% !important;

    .mobile {
      display: none;
    }
    .desktop {
      display: initial;
    }
  }

  .status {
    margin-left: 1em;
    font-size: 0.8em;
    color: dimgray;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .item-image-title {
    display: flex;

    img {
      margin-right: 1em;
      height: 3em;
    }
  }

  .title-status-qty {
    display: flex;
    flex-direction: column;

    p {
      margin-bottom: unset;
    }
    span {
      margin-left: unset;
    }

    @media ${device.tablet} {
      margin-left: 1em;
    }
  }

  .pending {
    svg {
      color: orange;
      margin-right: 0.3em;
    }
  }

  .add {
    margin-right: 0.2em;
    border: none;
    background: #ebebeb;
    color: #3e3e3e;
  }
  .remove {
    margin-right: 0.2em;
    border: none;
    background: #b3b3b3;
    color: #ffffff;
  }

  .true,
  .subscribed,
  .purchased,
  .shipped {
    svg {
      color: #32ca32;
      margin-right: 0.3em;
    }
  }
  .declined {
    svg {
      color: #e62020;
      margin-right: 0.3em;
    }
  }
  .refunded,
  .partially_refunded {
    svg {
      color: #dab502;
      margin-right: 0.3em;
    }
  }
`;
