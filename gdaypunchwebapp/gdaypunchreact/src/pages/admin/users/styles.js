import styled from "styled-components";
import { device } from "utils/styles";
import { Button } from "antd";

export const UsersContainer = styled.div`
  table {
    color: #525252;

    td:not(.email-or-name) {
      text-transform: capitalize;
    }
  }

  .extra,
  .unset,
  .time {
    opacity: 0.6;
  }

  .mobile {
    display: initial;

    /* .ant-table-row {
      display: flex;
      width: 100%;
      justify-content: space-between;
    } */

    .detail-3-column-compressed {
      width: max-content;
      margin-left: auto;
      margin-right: auto;
    }

    .center {
      display: flex;
      width: 30%;
      flex-direction: column;

      p {
        margin-bottom: unset;
      }
    }

    .left {
      .detail-3-column-compressed {
        margin-left: unset;
        margin-right: unset;
      }

      p {
        margin-bottom: unset;
      }
    }

    /* 
    .right:not(th) {
      display: flex;
      justify-content: end;
    } */
  }
  .desktop {
    display: none;
  }

  @media ${device.laptop} {
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
  .subscribed {
    text-align: center;

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
  .partially_refunded {
    svg {
      color: #dab502;
      margin-right: 0.3em;
    }
  }
`;

export const UserCreateContainer = styled.div`
  width: 50%;
  padding-top: 1em;
  height: 150px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;

  .name-row {
    display: flex;
  }
`;

export const SubmitButton = styled(Button)`
  width: inherit;
  align-self: flex-end;
`;
