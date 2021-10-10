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
`;

export const LeftSummaryContainer = styled.div`
  margin-bottom: 2em;

  @media ${device.laptop} {
    width: 50%;
    min-width: 25em;
  }
`;

export const RightImageContainer = styled.div`
  text-align: center;
  margin-left: auto;
  margin-right: auto;

  .ant-image-img {
    max-height: 27em;
  }

  @media ${device.laptop} {
    width: 50%;
    min-width: 25em;
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

function IllustrationSubmissions(props) {
  useScrollTop();

  return (
    <App id="top" className="App">
      <FeaturedSection top idx={1}>
        <SectionTitle>Illustration Submissions</SectionTitle>
        <ContentContainer>
          <span style={{ fontSize: "x-large" }}>
            Illustration Submissions&nbsp;
          </span>
          <br />
          <br />
          <SummaryImageContainer>
            <LeftSummaryContainer>
              <span>
                ​Gday Punch accepts illustration submissions to be featured in
                the magazine and/or on our Instagram!
              </span>
              <br />
              <br />
              <br />
              <span>
                Anyone from<strong>&nbsp;inside Australia</strong>&nbsp;can:
              </span>
              <br />
              <br />
              <span>1. Submit their illustration.</span>
              <br />
              <br />
              <span>2. Go through an initial vetting process.</span>
              <br />
              <br />
              <span>3. Be published in the next issue.</span>
              <br />
              <br />
              <span>4. Attach your socials and website links.</span>
              <br />
              <br />
              <span>5. Show the world your work!</span>
              <br />
              <br />
              <span>
                Successful submissions are shared in&nbsp;
                <a
                  href="https://www.facebook.com/groups/291634971550929"
                  target="_blank"
                  rel="noopener"
                >
                  <span style={{ color: "#da8044" }}>
                    Anime and Manga Artists Australia
                  </span>
                </a>
                &nbsp;(AMAA) Facebook&nbsp;
                <a
                  href="https://www.facebook.com/groups/291634971550929"
                  target="_blank"
                  rel="noopener"
                >
                  <span style={{ color: "#da8044" }}>Group&nbsp;</span>
                </a>
                and in the Gday Punch Manga Magazine Facebook&nbsp;
                <a
                  href="https://www.facebook.com/gdaypunch/"
                  target="_blank"
                  rel="noopener"
                >
                  <span style={{ color: "#da8044" }}>Page</span>
                </a>
                .&nbsp;
              </span>
              <br />
              <br />
              <span>See submission instructions below.</span>
              <br />
              <br />
            </LeftSummaryContainer>
            <RightImageContainer>
              <Image src={getGdayPunchStaticUrl("illustration-feature.png")} />
            </RightImageContainer>
          </SummaryImageContainer>
        </ContentContainer>
      </FeaturedSection>
      <FeaturedSection idx={2}>
        <InstructionsContainer>
          <strong>
            <span style={{ fontSize: "large" }}>Entry Period&nbsp;</span>
          </strong>
          <br />
          <br />
          <span>Always open</span>
          <br />
          <br />
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Format</span>
          </strong>
          <br />
          <br />
          <span>Must be in JPG or PNG format.</span>
          <br />
          <br />
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Rules</span>
          </strong>
          <br />
          <br />
          <span>・Tradition and digital work accepted.&nbsp;</span>
          <br />
          <span>・1 Illustration</span>
          <br />
          <span>・Must be final inked product. No rough drafts.</span>
          <br />
          <span>・Work can be created individually or as a team</span>
          <br />
          <span>
            ・<strong>Open theme</strong> - No restrictions.
          </span>
          <br />
          <br />
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Entry Groups</span>
          </strong>
          <br />
          <br />
          <span>
            As of Issue #2, we announced that illustration submissions will be
            grouped and voted on, within their different age groups.
            <br />
            <br />
            *IMPORTANT: If we don't receive a minimum of 3 submissions per age
            group, we cannot run the competition - but we may will still publish
            work in the magazine
            <br />
            <br />
            These groups are:
            <br />
            <br />
            <strong>Weembats</strong> (Primary School Students)
            <br />
            <br />
            <strong>Otakukaburras</strong> (High School Students)
            <br />
            <br />
            <strong>Kangakas</strong> (Young Adults - Adults)
          </span>
          <br />
          <br />
          <br />
          <span>
            * Please include, within your submission, your age or even just the
            group which your illustration will be placed under.&nbsp;
          </span>
          <br />
          <br />
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Submissions</span>
          </strong>
          <br />
          <br />
          <span>All submissions must be sent to:&nbsp;</span>
          <a href="mailto:info@gdaypunch.com" target="_blank" rel="noopener">
            info@gdaypunch.com
          </a>
          <br />
          <br />
          Also please remember to include your social link/profile in your
          submission so we can tag you!
          <br />
          <br />
          .ZIP / .RAR of image file, or link to cloud drive + access permissions
          <br />
          <br />
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Attention!</span>
          </strong>
          <br />
          <br />
          <span>
            By submitting, you are agreeing to all the terms and conditions
            detailed in the&nbsp;
          </span>
          <NavLink to="/conditions">Submissions Conditions</NavLink>
          <span>, so please read them thoroughly before you enter.</span>
        </InstructionsContainer>
      </FeaturedSection>
    </App>
  );
}

export default IllustrationSubmissions;
