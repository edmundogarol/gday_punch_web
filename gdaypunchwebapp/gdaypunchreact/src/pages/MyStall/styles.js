import styled from "styled-components";
import { Button } from "antd";
import { device } from "utils/styles";
import { SectionTitle } from "components/sectionTitle";

export const MyStallContainer = styled.div`
  .stats {
    display: flex;
  }

  .amount {
    font-size: 0.7em;
    text-align: center;
    color: dimgray;
  }

  .icon-amount-container {
    display: flex;
    flex-direction: column;
    margin-right: 1em;
  }

  .bio {
    color: dimgray;
    margin-bottom: 1.5em;
    font-style: italic;
    max-width: 50em;
    padding-left: 2em;
    padding-right: 2em;
  }
`;

export const ProfileDetails = styled.div`
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0.5em;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;

  ${SectionTitle} {
    margin: 0.5em;
  }

  @media ${device.mobileM} {
    width: 17em;
    margin: 2em;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;

    ${SectionTitle} {
      margin: 0.5em;
    }
  }

  @media ${device.tabletL} {
    width: 26em;
    margin: 2em;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;

    ${SectionTitle} {
      margin: unset;
      margin-right: 0.5em;
    }
  }

  @media ${device.laptop} {
    width: unset;
    flex-wrap: unset;
  }

  ${SectionTitle} {
    text-shadow: 0.07em 0em white, -0.07em 0em white, 0em 0.07em white,
      0em -0.07em white, 0.07em 0.07em white, -0.07em 0.07em white,
      -0.07em -0.07em white, 0.07em -0.07em white;
  }
`;

export const SocialButton = styled(Button)`
  width: 10em;
  margin: 0.5em;
`;
