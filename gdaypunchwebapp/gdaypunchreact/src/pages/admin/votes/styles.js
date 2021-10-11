import styled from "styled-components";

export const VotesContainer = styled.div`
  .first {
    svg {
      color: gold;
    }
  }
  .second {
    svg {
      color: silver;
    }
  }
  .third {
    svg {
      color: #c1611b;
    }
  }
`;

export const VotingItemsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 2em;

  div {
    span:not(.ant-scroll-number-only) {
      color: #959595;
    }
  }
`;

export const VotingItem = styled.div`
  background-image: url(${(props) => props.src});
  height: 10em;
  width: 10em;
  background-size: cover;
`;
