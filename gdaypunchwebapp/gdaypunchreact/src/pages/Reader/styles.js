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

export const UserAvatar = styled.div`
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  width: 2em;
  height: 2em;
  margin-right: 0.4em;
  border-radius: 1em;
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
