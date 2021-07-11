import React from "react";
import styled from "styled-components";

export default function FeaturedSection(props) {
  return (
    <FeaturedSectionContainer idx={props.idx} top={props.top}>
      <FeaturedChildrenContainer>{props.children}</FeaturedChildrenContainer>
    </FeaturedSectionContainer>
  );
}

export const FeaturedSectionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  background: ${(props) => (props.idx === 1 ? "#f1f1f1" : "#ffffff")};
  margin-left: auto;
  margin-right: auto;
  padding-top: ${(props) => (props.top ? "7em" : "inherit")};
`;

export const FeaturedChildrenContainer = styled.div`
  max-width: 90em;
`;
