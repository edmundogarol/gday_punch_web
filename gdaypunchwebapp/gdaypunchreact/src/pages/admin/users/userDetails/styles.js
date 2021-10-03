import styled from "styled-components";
import { device } from "utils/styles";
import { Modal } from "antd";

export const UserModal = styled(Modal)`
  width: 100% !important;

  .ant-typography:not(.first) {
    margin-top: 1em;
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
  .true,
  .subscribed,
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

export const UserFieldsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const LeftUserFields = styled.div`
  width: 28em;
  min-width: 20em;
`;

export const UserField = styled.div`
  display: flex;
  margin: 1em;

  h4 {
    width: 9em;
  }
`;

export const StatusButtons = styled.div`
  margin-top: 1em;
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
