import styled from "styled-components";
import { device } from "utils/styles";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

export const FeaturedSection = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  background: ${(props) => (props.idx === 1 ? "#f1f1f1" : "#ffffff")};
`;

export const FeaturedList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const SectionTitle = styled.h3`
  font-size: 2em;
  text-transform: uppercase;
  margin: 1em;
  letter-spacing: 1pt;
  color: #909090;
  font-weight: bolder;
`;
