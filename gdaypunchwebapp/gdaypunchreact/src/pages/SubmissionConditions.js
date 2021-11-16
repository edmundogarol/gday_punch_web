import React from "react";
import styled from "styled-components";
import AboutSection from "components/about";
import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import { useScrollTop } from "utils/hooks/useScrollTop";

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
`;

function SubmissionConditions(props) {
  useScrollTop();

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Submission Conditions</SectionTitle>
        <ContentContainer>
          <p>
            <strong>
              <span style={{ fontSize: "large" }}>Conditions</span>
            </strong>
            <br />
            <br />
            <span>
              Entrants who submit to the magazine must adhere to the terms and
              conditions stated in the CONDITIONS or the "Rules". Submitting to
              the magazine implies that you accept all of the terms detailed in
              the Rules, so please ensure that you have read and fully
              understand all of the terms and conditions.
            </span>
            <br />
            <br />
            <span>1. The Company</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              The magazine is hosted and created by Anime and Manga Artists
              Australia's Gday Punch Magazine or the "Company".
            </li>
            <li>
              The Company reserves the right to modify or update these rules at
              its sole discretion at any time. The Company also reserves the
              right to suspend, extend deadlines or cancel the magazine
              submissions channel&nbsp;at any time for any reason.
            </li>
            <li>
              Entrants agree to adhere to the terms and conditions set by the
              Company.
            </li>
            <li>
              Any and all Rights related to the Site and Services are expressly
              reserved by the Company. Nothing contained herein shall be
              construed as granting to the Registered User a license of the
              intellectual property rights owned by the Company.
            </li>
            <li>
              Any other terms of service in addition to these Terms that the
              Company provides on the Site, regardless of names, shall
              constitute a part of these Terms. In the event of any difference
              between the provisions of these Terms and those of the submissions
              channels, the terms of the channels shall prevail.
            </li>
          </ol>
          <p>
            <br />
            <span>2. How to Enter</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              By submitting to the magazine, entrants agree to the terms and
              conditions of the Rules, as well as the those established by other
              organisers. Entrants that are minors must attain their parent or
              guardian's consent in order to participate.
            </li>
            <li>
              Entrants need to send their work in .jpg/.png/.zip(of the images)
              or link to a cloud drive directly to the Company email -&nbsp;
              <a
                href="mailto:info@gdaypunch.com.au"
                target="_blank"
                rel="noopener"
              >
                info@gdaypunch.com.au
              </a>
              &nbsp;.
            </li>
          </ol>
          <p>
            <br />
            <span>3. Entries</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              The Company reserves the right reject entries, or cancel awards
              for any of the following reasons.
              <ol>
                <li>
                  Entries that violate the terms and conditions of the Site or
                  submission outline.
                </li>
                <li>
                  Entries that are offensive in nature or obscene or illegal in
                  nature as determined by the Company in its sole discretion.
                </li>
                <li>
                  Entries that infringe upon any person&rsquo;s personal or
                  property rights or any other third party rights, or that
                  violate someone's privacy.
                </li>
                <li>Entries that promote illegal activities.</li>
                <li>
                  Entries that are pornographic, racist, homophobic, promote
                  discrimination, or result in causing harm to other people as
                  determined by the Company in its sole discretion.
                </li>
                <li>Entries that depict child pornography or child abuse.</li>
                <li>
                  Entries that depict or promote suicide, self mutilation,
                  solicitation or other illegal or offensive subjects.
                </li>
                <li>
                  Entries that include any viruses, worms, corrupt files, Trojan
                  horses, or other forms of corruptive code.
                </li>
                <li>Entries that include affiliate links.</li>
                <li>Entries that are unrelated to the submissions outlines.</li>
                <li>
                  Anything else that the Company deems unsuitable as
                  a&nbsp;submission.
                </li>
                <li>
                  Entries that have won awards previously&nbsp;in other
                  sites/magazines/platforms.
                </li>
              </ol>
            </li>
            <li>
              Material inappropriate for viewers under the age of 18 will not be
              accepted. If the Company deems an entry to be inappropriate for
              minors it will hide those entries at its discretion.
            </li>
          </ol>
          <p>
            <br />
            <span>4. Applicant's Responsibilities</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              Applicants are responsible for applying to enter the magazine and
              submitting entries and any other actions required to participate
              in the competitions.
            </li>
            <li>
              Applicants are responsible for any submissions that infringe on
              any third party's copyrights.
            </li>
            <li>
              Applicants are responsible for any damages that may occur from
              infringing on any third party's copyrights, and the Company will
              not be held accountable for any liability.
            </li>
          </ol>
          <p>
            <br />
            <span>5. Exemption</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              The Company is not responsible for any illegal or offensive
              material submitted by entrants.
            </li>
            <li>
              The Company is not responsible for saving or deleting any content
              submitted by entrants.
            </li>
            <li>
              The Company reserves the right to delete submissions, disqualify
              entrants, suspend, or cancel any competitions.&nbsp;
            </li>
            <li>
              The Company is not responsible for any incidental, indirect or any
              other damages that occur as a result of participating in these
              competitions. The Company will not be obligated to compensate for
              any of these damages.&nbsp;
            </li>
          </ol>
          <p>
            <br />
            <span>6. Entry Handling</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              Entrants will retain the intellectual property rights to the works
              that they submit.
            </li>
            <li>
              Entrants agree that the material being submitted is their own
              work, and not copied, nor belongs to anyone else, and that the
              Company and the Site is licensed to use it.
            </li>
            <li>
              Entrants agree that they cannot ask for revenue from the Company's
              magazine sales and by submitting to competitions, they give the
              Company permission and licensing rights for the sale of the
              Magazine with their work.
            </li>
            <li>
              The Company reserves the right to display entries on the Site and
              social network accounts, and use them for promotional purposes,
              regardless of whether the entrant wins or not.
            </li>
            <li>
              Entrants permit the Company to view, save, and disclose the
              contents of entry submissions to third parties in the event that
              it is requested in a legal inquiry by an institution or deemed
              necessary by the Company to determine the causes of technical
              defects, or to deal with submissions in violation of the Rules.
            </li>
          </ol>
          <p>
            <br />
            <span>7. Prizes</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              In the event that the organizer is obligated to pay income tax
              and/or Special Reconstruction Income Tax, they will deduct the sum
              from the prize(s) before delivering it to the winner(s).
            </li>
            <li>
              If a winner is unable to be contacted they will forfeit their
              prize.
            </li>
          </ol>
          <p>
            <br />
            <span>8. Individual Announcements</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              The Company will use the entrant&rsquo;s personal information in
              order to contact them in regard to any competition results and
              prizes, or for such related purposes.
            </li>
          </ol>
          <p>
            <br />
            <span>9. Governing Law; Arbitration; Jurisdiction</span>
            <br />
            <br />
          </p>
          <ol>
            <li>
              Competitions will be governed by the internal laws of Australia.
            </li>
            <li>
              In the event that a foreign language version of these Terms
              contradicts any of the provisions in the Australian version of
              these Terms, or causes discrepancies, the Australian version shall
              prevail.
            </li>
            <li>
              If any portion of the Rules is deemed legally invalid or with no
              legal force, the remaining portions of the Rules will still be
              valid
            </li>
          </ol>
          <p>
            <br />
            <span>Additional</span>
            <br />
            <br />
          </p>
          <ul>
            <li>These rules will be in effect starting January 15th, 2020</li>
            <li>
              Revised on<span>&nbsp;</span>
              <span>January 15th</span>
              <span>, 2020</span>
            </li>
          </ul>
        </ContentContainer>
      </FeaturedSection>
    </App>
  );
}

export default SubmissionConditions;
