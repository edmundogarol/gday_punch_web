import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";

import {
  doTweet,
  doUpdateTweetImage,
  doUpdateTweetStatus
} from "actions/admin";

function Admin(props) {
  const { tweet, updateTweetStatus, updateTweetImage } = props;
  const [imageUpload, setImage] = useState(undefined);
  const {} = props;
  const { app } = useParams();
  const twitter = app === "twitter";

  function placeCaretAtEnd(el) {
    el.focus();
    if (
      typeof window.getSelection !== "undefined" &&
      typeof document.createRange !== "undefined"
    ) {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange !== "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

  function handleChangeText() {
    const editableDiv = document.querySelector("[contenteditable]");
    const innerText = editableDiv.innerText;

    updateTweetStatus(innerText);

    const hashtagLinkedText = innerText.replace(
      /#(\S+)/g,
      '<a href="http://twitter.com/#!/search/$1">#$1</a>'
    );
    editableDiv.innerHTML = hashtagLinkedText;
    placeCaretAtEnd(editableDiv);
  }

  function handleImageChange(imageFile) {
    setImage(imageFile);
    updateTweetImage(imageFile);
  }

  function handleTweet() {
    const editableDiv = document.querySelector("[contenteditable]");
    const innerText = editableDiv.innerText;

    updateTweetStatus(innerText);
    tweet();
  }

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
            {imageUpload ? (
              <img
                src={
                  imageUpload
                    ? window.URL.createObjectURL(imageUpload)
                    : undefined
                }
              />
            ) : (
              <input
                title=" "
                value={
                  imageUpload
                    ? window.URL.createObjectURL(imageUpload)
                    : undefined
                }
                className="upload-button"
                type="file"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            )}
            <div
              contentEditable
              onKeyDown={() => handleChangeText()}
              className="status-area"
              rows="10"
              cols="20"
            />
            <button
              onClick={() => handleTweet()}
              className="submit-button"
              type="submit"
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Admin.propTypes = {
  tweet: PropTypes.func,
  updateTweetImage: PropTypes.func,
  updateTweetStatus: PropTypes.func
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {
  tweet: doTweet,
  updateTweetImage: doUpdateTweetImage,
  updateTweetStatus: doUpdateTweetStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
