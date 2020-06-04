import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";

function Admin(props) {
  const {} = props;
  const { app } = useParams();
  const twitter = app === "twitter";
  const styles = getStyles();

  return (
    <div className="admin">
      <div className="side-menu">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/admin/twitter">Twitter</NavLink>
        <NavLink to="/admin/instagram">Instagram</NavLink>
      </div>
      <div className="admin-dashboard">
        {twitter && (
          <div className="twitter">
            <input title=" " className="upload-button" type="file" />
            <input
              className="status-area"
              type="textarea"
              rows="10"
              cols="20"
              placeholder="Type tweet here"
            />
            <button className="submit-button" type="submit">
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getStyles() {
  return {};
}

Admin.propTypes = {};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
