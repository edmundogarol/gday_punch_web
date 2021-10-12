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
    width: auto;
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

function OneShotSubmissions(props) {
  useScrollTop();

  return (
    <App id="top" className="App">
      <FeaturedSection top idx={1}>
        <SectionTitle>One Shot Competition</SectionTitle>
        <ContentContainer>
          <span style={{ fontSize: "x-large" }}>
            One-Shot Competition&nbsp;
          </span>
          <br />
          <br />
          <SummaryImageContainer>
            <LeftSummaryContainer>
              <span>
                Gday Punch holds one shot competitions open to manga artists all
                over Australia!
              </span>
              <br />
              <br />
              <br />
              <span>
                Anyone from<strong>&nbsp;inside Australia</strong>&nbsp;can:
              </span>
              <br />
              <br />
              <span>1. Submit their work.</span>
              <br />
              <br />
              <span>2. Go through an initial vetting process.</span>
              <br />
              <br />
              <span>3. Be published in the next issue.</span>
              <br />
              <br />
              <span>4. Get votes from readers.</span>
              <br />
              <br />
              <span>5. Win prizes!</span>
              <br />
              <br />
              <span>
                The winners are announced in&nbsp;
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
              <Image src={getGdayPunchStaticUrl("one-shot-feature.png")} />
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
          <span>Size formatted to A4. Must be in JPG or PNG format.</span>
          <br />
          <span>
            (Please use our&nbsp;
            <NavLink to="/downloads">
              <span style={{ color: "#da8044" }}>
                Manga Manuscript Template
              </span>
            </NavLink>
            &nbsp;to correctly size your submissions)
          </span>
          <br />
          <br />
          <span>IMPORTANT:</span>
          <br />
          <span>
            Naming files - Please name pages such as "001.png, 002.png..." and
            so on.&nbsp;
          </span>
          <br />
          <br />
          <span>​</span>
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Rules</span>
          </strong>
          <br />
          <br />
          <span>・Tradition and digital work accepted.&nbsp;</span>
          <br />
          <span>
            ・Original and complete / semi-complete story. One-shot can end on
            cliff hanger alluding to next chapter. (Do not submit commercially
            published work).
          </span>
          <br />
          <span>・Length of 4 - 20 pages maximum (including cover).</span>
          <br />
          <span>・Must be final inked product. No rough drafts.</span>
          <br />
          <span>
            ・Accepting Either left-to-right and right-to-left reading
            orientation
          </span>
          <br />
          <span>・Work can be created individually or as a team</span>
          <br />
          <br />
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Submissions</span>
          </strong>
          <br />
          <br />
          <span>
            Place your one-shot images inside a folder and upload to a cloud
            drive (Google Drive, One Drive, Dropbox etc)
          </span>
          <br />
          <span>Then send the link of your folder to:&nbsp;</span>
          <a href="mailto:info@gdaypunch.com" target="_blank" rel="noopener">
            info@gdaypunch.com
          </a>
          <br />
          <br />
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Winner</span>
          </strong>
          <br />
          <br />
          <span>
            ​The winner with the most votes will receive a cash prize of&nbsp;
          </span>
          <strong>$100</strong>
          <span>&nbsp;(sent via PayPal) and their own&nbsp;</span>
          <span>
            copy of &nbsp;
            <strong>the following issue of Gday Punch Magazine</strong>&nbsp;
          </span>
          <span>(shipped to them).&nbsp;</span>
          <br />
          <br />
          <br />
          <strong>
            <span style={{ fontSize: "large" }}>Attention!</span>
          </strong>
          <br />
          <br />
          <span>
            By entering in this contest, you are agreeing to all the terms and
            conditions detailed in the&nbsp;
          </span>
          <NavLink to="/conditions">Submissions Conditions</NavLink>
          <span>, so please read them thoroughly before you enter.</span>
        </InstructionsContainer>
      </FeaturedSection>
    </App>
  );
}

export default OneShotSubmissions;
