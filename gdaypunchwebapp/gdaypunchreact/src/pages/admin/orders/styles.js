import styled from "styled-components";

export const OrdersContainer = styled.div`
  table {
    color: #525252;

    td {
      text-transform: capitalize;
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
