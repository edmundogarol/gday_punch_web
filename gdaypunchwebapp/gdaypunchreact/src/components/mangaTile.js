import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";

function MangaTile(props) {
  const { id, cover, title } = props;
  const styles = getStyles();

  return (
    <Link to={`/manga/${id}`} style={styles.removeLinkStyle}>
      <img src={cover} style={styles.tile} />
      <div className="pdf-details">
        <div>
          <h2>{title}</h2>
          <h4>by Edmundo (Yungy) Garol</h4>
        </div>
      </div>
    </Link>
  );
}

function getStyles() {
  return {
    tile: {
      height: "30vh",
      margin: "15vh",
      marginTop: "10vh",
      marginBottom: "unset",
    },
    removeLinkStyle: {
      textDecoration: "none",
      color: "black"
    }
  };
}

MangaTile.propTypes = {
  // Component Properites
  id: PropTypes.string,
  cover: PropTypes.string,
  title: PropTypes.string
  // Redux Properties
  // Redux Functions
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MangaTile);
