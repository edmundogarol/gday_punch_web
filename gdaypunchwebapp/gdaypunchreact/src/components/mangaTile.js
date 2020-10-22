import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { getCoverImage } from "utils/utils";

function MangaTile(props) {
  const { clickNotAllowedCallback, loggedIn, likeManga, manga } = props;
  const { id, cover, title } = manga;
  const styles = getStyles();

  return (
    <div>
      <Link to={`/manga/${id}`} style={styles.removeLinkStyle}>
        <img src={getCoverImage(cover)} style={styles.tile} />
      </Link>
      <div className="pdf-details">
        <Link to={`/manga/${id}`} style={styles.removeLinkStyle}>
          <h2 style={styles.mangaTitle}>{title}</h2>
          <h4 style={styles.mangaArtist}>by Edmundo (Yungy) Garol</h4>
        </Link>
        <a
          onClick={() => {
            if (!loggedIn) {
              window.location.href = "/#top";
              openRegister();
              suggestRegister("Info: Sign up or Log in to like this manga!");
            } else if (!manga.user_likes) {
              likeManga(manga.id);
            } else {
              // unlikeManga(manga[1].id);
            }
          }}
        >
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

export default connect(mapStateToProps, mapDispatchToProps)(MangaTile);
