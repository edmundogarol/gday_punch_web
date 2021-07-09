import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import {
  MangaTile,
  MangaImage,
  MangaTitle,
  MangaArtist,
  MangaDetails,
} from "./styles";

function Ui(props) {
  const { loggedIn, manga, likeManga, openRegister, suggestRegister } = props;

  function handleMangaClick(destination, clickType) {
    const clickTypeMessages = {
      manga: "Info: Sign up or Log in to read this manga!",
      like: "Info: Sign up or Log in to like this manga!",
    };

    if (clickType === "manga") {
      if (!loggedIn) {
        window.location.href = "/#top";
        openRegister();
        suggestRegister(clickTypeMessages[clickType]);
      } else {
        props.history.push(destination);
      }
    } else if (clickType === "like") {
      if (!loggedIn) {
        window.location.href = "/#top";
        openRegister();
        suggestRegister(clickTypeMessages[clickType]);
      } else if (!manga.user_likes) {
        likeManga(manga.id);
      } else {
        // Implement Unlike Manga
      }
    }
  }

  return (
    <MangaTile>
      <a onClick={() => handleMangaClick(`/manga/${manga.id}`, "manga")}>
        <MangaImage src={manga.cover} />
      </a>
      <MangaDetails>
        <a onClick={() => handleMangaClick(`/manga/${manga.id}`, "manga")}>
          <MangaTitle>{manga.title}</MangaTitle>
          <MangaArtist>by Edmundo (Yungy) Garol</MangaArtist>
        </a>
        <a onClick={() => handleMangaClick(undefined, "like")}>
          <FontAwesomeIcon
            icon={faHeart}
            style={manga && manga.user_likes ? { color: "red" } : null}
          />
          {`(${manga ? manga.likes : 0})`}
        </a>
      </MangaDetails>
    </MangaTile>
  );
}

export default Ui;
