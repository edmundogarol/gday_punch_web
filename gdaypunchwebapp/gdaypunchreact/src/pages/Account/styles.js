import { FeaturedChildrenContainer } from "src/components/featuredSection";
import styled from "styled-components";
import { device } from "utils/styles";

export const App = styled.div`
  min-height: 84vh;

  .ant-tabs {
    width: 100%;

    @media ${device.laptop} {
      width: 50em;
    }
  }

  ${FeaturedChildrenContainer} {
    width: 90%;

    @media ${device.laptop} {
      width: unset;
    }
  }

  .ant-tabs-content {
    text-align: start;
  }

  .non-first-tab {
    margin-top: 1em;
  }

  .ant-card-extra {
    .disabled {
      color: rgba(0, 0, 0, 0.25);

      &:hover {
        opacity: 1 !important;
      }
    }
  }
`;

export const DetailField = styled.div`
  display: grid;
  grid-template-columns: 9.1em auto 1fr 1fr;
  text-align: start;
  column-gap: 16px;

  .unset {
    color: #b7b7b7;
  }

  .error {
    color: #ff5656;
    text-align: end;
  }
`;

export const SuccessLabel = styled.label`
  color: #4fbf4f;
  background: #deffde;
  padding: 0.7em;
  border-radius: 4pt;
`;
