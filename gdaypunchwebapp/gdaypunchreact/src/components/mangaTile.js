import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

function MangaTile(props) {
  const { cover, title } = props;
  const styles = getStyles();

  return (
    <a>
      <img src={cover} style={styles.tile} />
      <div className="pdf-details">
        <div>
          <h2>{title}</h2>
          <h4>by Edmundo Garol</h4>
        </div>
      </div>
    </a>
  );
}

function getStyles() {
  return {
    tile: {
      height: "30vh",
      margin: "15vh",
      marginTop: "10vh",
      marginBottom: "unset",
    }
  };
}

MangaTile.propTypes = {
  // Component Properites
  cover: PropTypes.string,
  title: PropTypes.string
  // Redux Properties
  // Redux Functions
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MangaTile);
