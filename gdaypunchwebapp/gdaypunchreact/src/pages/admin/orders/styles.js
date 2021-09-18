import styled from "styled-components";
import { device } from "utils/styles";
import { Modal } from "antd";

export const OrdersContainer = styled.div`
  table {
    color: #525252;

    td {
      text-transform: capitalize;
    }
  }

  .mobile {
    display: initial;

    .ant-table-row {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    .detail-3-column-compressed {
      width: max-content;
    }

    .center {
      display: flex;
      width: 100%;
      flex-direction: column;

      p {
        margin-bottom: unset;
      }
    }

    .left {
      display: flex;
      justify-content: start;
      width: 100%;
    }

    .right {
      display: flex;
      justify-content: end;
      width: 100%;
    }
  }
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

  .pending {
    svg {
      color: orange;
      margin-right: 0.3em;
    }
  }
  .purchased {
    svg {
      color: #32ca32;
      margin-right: 0.3em;
    }
  }
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
  .refunded {
    svg {
      color: #dab502;
      margin-right: 0.3em;
    }
  }
  .partially_refunded {
    svg {
      color: #dab502;
      margin-right: 0.3em;
    }
  }
`;

export const OrderModal = styled(Modal)`
  width: 100% !important;

  table,
  div {
    color: #525252;

    td {
      text-transform: capitalize;
    }
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
  .purchased {
    svg {
      color: #32ca32;
      margin-right: 0.3em;
    }
  }
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
  .refunded {
    svg {
      color: #dab502;
      margin-right: 0.3em;
    }
  }
  .partially_refunded {
    svg {
      color: #dab502;
      margin-right: 0.3em;
    }
  }

  .total {
    text-align: end;
  }
`;

export const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 1.3em;

  @media ${device.tablet} {
    padding-right: 2em;
  }
`;

export const TitleStatus = styled.div`
  display: flex;
  flex-direction: column;

  .status {
    margin-left: unset;
  }

  @media ${device.tablet} {
    display: initial;

    span:not(.anticon) {
      margin-left: 1em;
    }

    .status {
      margin-left: 1em;
    }
  }
`;

export const ModalItemSummary = styled.div`
  div {
    margin-top: 1.5em;
  }
`;

export const ProductTotalsContainer = styled.div`
  padding-top: 1em;
  text-align: end;

  div {
    display: grid;
    grid-template-columns: 2fr 1fr;

    @media ${device.tablet} {
      grid-template-columns: 4fr 1fr;
    }

    padding-right: 1em;
  }
`;

export const AddressContactField = styled.div`
  margin-top: 1em;
  p {
    margin: unset;
  }
`;

export const AddressBillingContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-top: 1px solid #d2d2d2;
  margin-top: 1em;
`;

export const LeftContainer = styled.div`
  width: 100%;
  border: 1px solid #bfbfbf;
  border-radius: 0.4em;
  margin-top: 1em;
  padding: 1em;
  min-width: 18em;

  @media ${device.tablet} {
    width: 48%;
  }
`;

export const RightContainer = styled.div`
  width: 100%;
  border: 1px solid #bfbfbf;
  border-radius: 0.4em;
  margin-top: 1em;
  padding: 1em;
  min-width: 18em;

  @media ${device.tablet} {
    width: 48%;
  }
`;

export const OrderStatuses = styled.div`
  margin-top: 1em;

  div {
    display: flex;
    flex-direction: column;

    span {
      color: #9c9c9c;
    }
  }
`;
