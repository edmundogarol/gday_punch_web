import styled from "styled-components";
import { device } from "utils/styles";

export const UsersContainer = styled.div`
  table {
    color: #525252;

    td:not(.email-or-name) {
      text-transform: capitalize;
    }
  }

  .unset,
  .time {
    opacity: 0.6;
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
