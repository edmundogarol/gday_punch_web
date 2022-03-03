import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
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

function UploadConditions(props) {
  useScrollTop();

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Upload and Selling Conditions</SectionTitle>
        <ContentContainer>
          <div>
            <p>
              This site is used by all countries, cultures, ages and genders all
              over the world.
              <br />
              There are also people who post works such as manga and
              illustrations, people who view works that are posted, and people.
              Everyone is able to enjoy in their own way.
              <br />
              Here are guideline so that everyone can have fun using this site.
              <br />
              In order to provide an smooth service of this site operated by
              Gday Punch Manga Magazine, we ask for your cooperation so that our
              users can enjoy using our site.
            </p>
          </div>
          <dl>
            <dt>■ About the Guideline Policy</dt>
            <dd>
              <ul>
                <li>
                  These guidelines apply to images and texts, such as: comics,
                  illustrations, other images, topics, and comments posted on
                  this site.
                </li>
                <li>
                  If it is determined that the guidelines are not being
                  followed, the age limit may be changed or works may be
                  deleted.
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>■ About posting images such as Manga and Illustrations</dt>
            <dd>
              <p>
                This site is used by people of all ages.
                <br />
                When posting images such as manga and illustrations that are
                inappropriate for people under the age of 18 to view, it is
                mandatory to set the age limit according to these guidelines.
                <br />
                In addition, on &quot;my page&ldquo;, (header images, profile
                icons, backgrounds, photographs, etc.) and the images published
                to the topic, you are prohibited from setting images that are
                considered R18 and/or prohibition work.
              </p>
            </dd>
          </dl>
          <dl>
            <dt>■ About Setting Age Limits</dt>
            <dd>
              <p>
                The following patterns of age restrictions have been established
                on this site.
                <br />
                Please set up the right settings after confirming which piece of
                work it applies to:
              </p>
              <br />
              <dl>
                <dt>1.Viewers of all ages</dt>
                <dd>
                  Works for which any conditions listed below in 2 do not apply.
                </dd>
                <dt>2.Frequent baring of skin, light sexual themes</dt>
                <dd>
                  <ul>
                    <li>
                      Semi-nude, swimsuits or underpants, etc., featuring skin
                      exposure;
                    </li>
                    <li>
                      Though there are no direct depictions of nipples or
                      genitals, contains depictions of sexuality (regardless of
                      gender or age)
                      <br />
                      Eg. hugging, kissing, revealing underwear, emphasized
                      cleavage / breast(s) / buttocks / crotch, and any
                      depictions implying sexual acts, etc.
                      <br />※ Emphasized depictions of genitals under clothing
                      is considered to be R18.
                    </li>
                  </ul>
                </dd>
              </dl>
            </dd>
          </dl>
          <dl>
            <dt>■ Prohibited Matters</dt>
            <dd>
              <p>
                No User may submit content containing any of the following in
                using the Service. In the event any violation of this Prohibited
                Matters provision has been committed, unfavorable measures such
                as deregistration, suspension of use, deletion or suspension of
                publication of the Graphics and Other Information in whole or in
                part may be taken.
              </p>
              <ul>
                <li>
                  Uncensored and/or insufficiently modified, depictions of
                  sexual acts or sex organs;
                </li>
                <li>
                  Child pornography or child abuse (based on apparent age);
                </li>
                <li>
                  Act that includes any depictions related to any ethnic group,
                  discretion, sex, job, religion, or otherwise that could amount
                  to discrimination;
                </li>
                <li>
                  The Hakenkreuz, or content considered internationally taboo;
                </li>
                <li>
                  Content which slanders, intimidates, economically or mentally
                  harms, or disadvantages;
                </li>
                <li>Content which promotes anti-social acts;</li>
                <li>
                  Content which infringes personality rights or privacy rights;
                </li>
                <li>
                  In the case of illustrations, artworks consisting primarily of
                  text, photos, or screenshots;
                </li>
                <li>
                  Content which infringes on a third party&apos;s intellectual
                  property rights, trademark, etc.;
                </li>
                <li>
                  Promotion, advertisement, solicitation, or marketing on the
                  Service that is not approved by The Company in advance
                  (excepting Doujinshi convention promotion, etc.) ;
                </li>
                <li>
                  The same manga / illustration has been published many times.
                </li>
                <li>
                  Any other acts that The Company deems to be inappropriate.
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>■ About the topics and comments on a post</dt>
            <dd>
              <p>
                The following topics or comments may be subject to deletion or
                account termination:
              </p>
              <ul>
                <li>
                  The purpose is to vandalize posted manga, illustrations or
                  posters.
                </li>
                <li>
                  What causes discomfort to others, such as sexual and violent
                  content.
                </li>
                <li>When personal information is stated.</li>
                <li>
                  Those intended for sales, solicitation, encounters, etc.
                </li>
                <li>
                  Others that were considered to be interfering with the
                  operation.
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>■ Selling manga conditions and guidelines</dt>
            <dd>
              <p>
                You can list your manga for sale within the Gday Punch Web App
                and the balance you accrue will be paid out to your nominated
                destination every week.
              </p>
              <ul>
                <li>
                  All manga listed for sale must be your original work and
                  follow the guidelines outlined in these terms and conditions.
                </li>
                <li>
                  You can visit the Seller portal within your account page and
                  view all your sales, current balances and payment details
                </li>
                <li>
                  Listing a manga up for sale is free, however Gday Punch Web
                  App will take a 10% + 30c hosting fee for every sale to cover
                  costs of Stripe (payment gateway) fees, website upkeep and
                  traffic management.
                  <br />※ For example: <br />
                  If you sell Chapter 1 of your manga for $2, Gday Punch will
                  take a fee of 20c (10%) + 30c, for a total of 50c. <br /> Your
                  new sales balance will be added $1.50.
                </li>
                <li>
                  Manga that has been sold or purchased within the website will
                  no longer be editable.
                </li>
                <li>
                  You can nominate either an Australian Bank Account or Paypal
                  account where your proceeds will be paid out to every week.
                  <br />※ Proceeds will be paid out in Australian Dollars (AUD).
                </li>
                <li>
                  If your account information is incorrect you will be unable to
                  receive payments. Please make sure your information is entered
                  correctly.
                </li>
                <li>
                  After PayPal payments have been made they must be accepted
                  within 30 days. Please make that sure you accept your payments
                  within 30 days otherwise they will be withdrawn.
                </li>
                <li>
                  If there is an error with your registered bank account or
                  Paypal, a $10AUD penalty may be charged.
                </li>
                <li>
                  Our fees and other charges are subject to change without
                  notice.
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>■ When we find an act that violates our guidelines</dt>
            <dd>
              <ul>
                <li>
                  If you find manga or illustrations that violate the
                  guidelines.
                  <br />
                  Go to our contacts page and submit an enquiry about the
                  reported offense.
                  <br />
                  We will prioritize checking reported works and take
                  appropriate action.
                  <br />
                  Please note that we can not respond to inquiries such as
                  reasons for deletions etc.
                </li>
                <li>
                  If you find a topic or comment that violates these guidelines.
                  <br />
                  Please contact us here&nbsp;
                  <NavLink to="/contact">Contact Form</NavLink>
                  &nbsp;From a listed page (topics, illustrations, manga, etc.)
                  <br />
                  However, please note that there are some sensitive parts that
                  may cause trouble for comments. Please be aware that we may
                  not be able to respond.
                  <br />
                  In addition, please understand in advance that we can not
                  respond to inquiries such as reasons for deletions etc.
                </li>
              </ul>
            </dd>
          </dl>
          <p>
            Other prohibited matters are mentioned in our "Conditions".
            <br />
            <NavLink to="/conditions">Conditions</NavLink>
            <br />
            The contents of these guidelines are subject to change without
            notice.
          </p>
        </ContentContainer>
      </FeaturedSection>
    </App>
  );
}

export default UploadConditions;
