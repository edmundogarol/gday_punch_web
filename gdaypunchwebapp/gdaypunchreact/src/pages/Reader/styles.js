import styled from "styled-components";
import { device } from "utils/styles";

export const ReaderContainer = styled.div`
  min-height: 84vh;

  .pdf-details {
    flex-direction: column;
    align-items: start;

    @media ${device.laptop} {
      flex-direction: row;
      align-items: center;
    }
  }

  .comment {
    align-items: center;
    flex-wrap: wrap;

    @media ${device.laptop} {
      flex-wrap: unset;
    }
  }
`;

export const LikeButton = styled.span`
  svg {
    margin-right: 0.3em;
    margin-left: unset;

    @media ${device.laptop} {
      margin-left: 1em;
    }
  }

  &:hover {
    cursor: pointer;
  }
`;
