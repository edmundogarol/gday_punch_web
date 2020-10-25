import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { getCoverImage } from "utils/utils";

function MangaTile(props) {
  const { loggedIn, manga, likeManga, openRegister, suggestRegister } = props;
  const styles = getStyles();

  function handleMangaClick(destination, clickType) {
    const clickTypeMessages = {
      manga: "Info: Sign up or Log in to read this manga!",
      like: "Info: Sign up or Log in to like this manga!"
    };

    if (clickType === "manga") {
      if (!loggedIn) {
        window.location.href = "/#top";
        openRegister();
        suggestRegister(clickTypeMessages[clickType]);
      } else {
        // window.location.href = destination;
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
    <div className="manga-tile">
      <a
        onClick={() => handleMangaClick(`/manga/${manga.id}`, "manga")}
        style={styles.removeLinkStyle}
      >
        <img src={manga.cover} style={styles.tile} />
      </a>
      <div className="pdf-details">
        <a
          onClick={() => handleMangaClick(`/manga/${manga.id}`, "manga")}
          style={styles.removeLinkStyle}
        >
          <h2 style={styles.mangaTitle}>{manga.title}</h2>
          <h4 style={styles.mangaArtist}>by Edmundo (Yungy) Garol</h4>
        </a>
        <a onClick={() => handleMangaClick(undefined, "like")}>
          <FontAwesomeIcon
            icon={faHeart}
            style={manga && manga.user_likes ? { color: "red" } : null}
          />
          {`(${manga ? manga.likes : 0})`}
        </a>
      </div>
    </div>
  );
}

function getStyles() {
  return {
    tile: {
      height: "30vh",
      margin: "15vh",
      marginTop: "10vh",
      marginBottom: "unset"
    },
    removeLinkStyle: {
      textDecoration: "none",
      color: "black"
    },
    mangaTitle: {
      fontSize: "1em"
    },
    mangaArtist: {
      fontSize: "0.8em"
    }
  };
}

MangaTile.propTypes = {
  // Component Properites
  manga: PropTypes.object
  // Redux Properties
  // Redux Functions
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MangaTile));
