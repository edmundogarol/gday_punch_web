import React from "react";
import styled from "styled-components";
import { device } from "utils/styles";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";

import { getGdayPunchStaticUrl } from "utils/utils";

export default function About(props) {
  return (
    <FeaturedSection top={props.top}>
      <SectionTitle>Our Vision</SectionTitle>
      <BlurbContainer>
        <BlurbText>
          Gday Punch Manga Magazine's vision is to ultimately give a platform to
          Australian creators! We aim to nurture and grow the Manga culture in
          Australia and give Aussie manga artists an opportunity to showcase
          their Japanese inspired art to the country! Our goals for the future
          are focused on creating manga and anime careers in Australia - jobs
          that our future Aussie generations will be able to say, "When I grow
          up, I want to be a full time Manga artist!" - and they will be able to
          do this, right here on our very own soil... down under!
        </BlurbText>
        <BlurbImage
          src={getGdayPunchStaticUrl("about1.jpg")}
          alt="Gday Punch Manga Meet"
        />
      </BlurbContainer>
      <GalleryContainer>
        <GalleryImage
          src={getGdayPunchStaticUrl("about2.jpg")}
          alt="Gday Punch Manga Meet"
        />
        <GalleryImage
          src={getGdayPunchStaticUrl("about3.png")}
          alt="Gday Punch Manga Meet"
        />
        <GalleryImage
          src={getGdayPunchStaticUrl("about4.jpg")}
          alt="Gday Punch Manga Meet"
        />
        <GalleryImage
          src={getGdayPunchStaticUrl("about5.png")}
          alt="Gday Punch Manga Meet"
        />
        <GalleryImage
          src={getGdayPunchStaticUrl("about6.jpg")}
          alt="Gday Punch Manga Meet"
        />
      </GalleryContainer>
    </FeaturedSection>
  );
}

export const BlurbContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  text-align: initial;
  justify-content: space-between;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
`;

export const BlurbText = styled.p`
  max-width: 400pt;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2em;
  font-size: 1.1em;

  p {
    font-family: system-ui;
    word-spacing: 2.3pt;
  }
`;

export const BlurbImage = styled.div`
  background-image: url("${(props) => props.src}");
  width: 40%;
  max-height: 350px;
  background-size: cover;
  background-position: center;
  -webkit-filter: saturate(0.5);
  filter: saturate(0.5);
  min-width: 300pt;
  min-height: 250px;
  margin-left: auto;
  margin-right: auto;
`;

export const GalleryContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4em;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  width: 80%;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media ${device.laptop} {
    margin-left: 10em;
    margin-right: 10em;
  }
`;

export const GalleryImage = styled.div`
  background-image: url("${(props) => props.src}");
  max-width: 190px;
  min-width: 190px;
  max-height: 150px;
  min-height: 150px;
  background-size: cover;
  background-position: center;
  filter: saturate(0.5);
  margin-left: 1pt;
  margin-right: 1pt;
  margin-bottom: 1pt;
  margin-top: 1pt;
`;
