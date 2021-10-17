import React, { useEffect } from "react";
import styled from "styled-components";
import AboutSection from "components/about";
import { getGdayPunchResourceUrl } from "utils/utils";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

function About(props) {
  useEffect(() => {
    document.head.querySelector('meta[name="og:title"]').content =
      "Our Vision | Gday Punch Manga Magazine";
    document.head.querySelector(
      'meta[name="og:description"]'
    ).content = `Gday Punch Manga Magazine's vision is to ultimately give a platform to
      Australian creators! We aim to nurture and grow the Manga culture in
      Australia and give Aussie manga artists an opportunity to showcase
      their Japanese inspired art to the country! Our goals for the future
      are focused on creating manga and anime careers in Australia - jobs
      that our future Aussie generations will be able to say, "When I grow
      up, I want to be a full time Manga artist!" - and they will be able to
      do this, right here on our very own soil... down under!`;
    document.head.querySelector('meta[name="og:image"]').content =
      getGdayPunchResourceUrl("about1.jpg");
  }, []);

  return (
    <App id="top" className="App">
      <AboutSection top />
    </App>
  );
}

export default About;
