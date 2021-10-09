import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import { useScrollTop } from "utils/hooks/useScrollTop";
import Image from "components/image";
import { getGdayPunchStaticUrl } from "utils/utils";
import { device } from "utils/styles";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

export const ContentContainer = styled.div`
  white-space: pre-line;
  text-align: start;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  margin-bottom: 2em;

  @media ${device.laptop} {
    padding: 3em;
    padding-top: unset;
    padding-bottom: unset;
  }
`;

export const SummaryImageContainer = styled.div`
  display: flex;
  margin-bottom: 2em;
  flex-wrap: wrap;

  @media ${device.tablet} {
    flex-wrap: unset;
  }
`;

export const LeftSummaryContainer = styled.div`
  width: 100%;
  min-width: 25em;
  margin-bottom: 2em;

  @media ${device.tablet} {
    width: 63%;
  }

  iframe {
    width: 94%;

    @media ${device.tablet} {
      width: 100%;
    }
  }
`;

export const RightImageContainer = styled.div`
  width: 100%;
  min-width: 24em;
  margin-left: auto;
  margin-right: auto;
  padding: 2em;
  padding-top: unset;
  text-align: left;

  @media ${device.tablet} {
    width: 36%;
  }

  .ant-image {
    text-align: center;
    width: 100%;
  }

  .ant-image-img {
    max-height: 27em;
    max-width: 20em;
  }
`;

export const InstructionsContainer = styled.div`
  text-align: left;
  margin: 2em;

  @media ${device.laptop} {
    margin: unset;
    padding: 7em;
    padding-top: 3em;
  }
`;

function Events(props) {
  useScrollTop();

  return (
    <App id="top" className="App">
      <FeaturedSection top idx={1}>
        <SectionTitle>Events</SectionTitle>
        <ContentContainer>
          <SummaryImageContainer>
            <LeftSummaryContainer>
              <iframe
                width="714"
                height="402"
                src="https://www.youtube.com/embed/0uHyHxY4SFo"
                title="Gday Punch Animaga 2019"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </LeftSummaryContainer>
            <RightImageContainer>
              <Image
                preview={false}
                src={getGdayPunchStaticUrl("animaga-logo.png")}
              />
              <br />
              <br />
              <span style={{ fontSize: "x-large" }}>
                Gday Punch Animaga 2019&nbsp;
              </span>
              <br />
              <br />
              Gday Punch Manga Magazine was interviewed at Animaga 2019, in the
              panellist stage by Australian mangaka Angie Spice.
              <br />
              <br />
              Check out our Youtube Channel - for more videos on our journey and
              many more tutorials and fun vlogs
            </RightImageContainer>
          </SummaryImageContainer>
        </ContentContainer>
      </FeaturedSection>
    </App>
  );
}

export default Events;
