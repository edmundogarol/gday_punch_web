import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";

import { doTweet } from "actions/admin";

function Admin(props) {
  const { tweet } = props;
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
    const hashtagLinkedText = innerText.replace(
      /#(\S+)/g,
      '<a href="http://twitter.com/#!/search/$1">#$1</a>'
    );

    editableDiv.innerHTML = hashtagLinkedText;
    console.log("innerText", innerText);
    console.log("hashtagLinkedText", hashtagLinkedText);

    placeCaretAtEnd(editableDiv);
  }

  function handleUpload() {
    const editableDiv = document.querySelector("[contenteditable]");
    const innerText = editableDiv.innerText;

    console.log("Uploading: ", innerText);

    tweet(innerText);
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
              <img src={imageUpload} />
            ) : (
              <input
                title=" "
                value={imageUpload}
                className="upload-button"
                type="file"
                onChange={(e) =>
                  setImage(window.URL.createObjectURL(e.target.files[0]))
                }
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
              onClick={() => handleUpload()}
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
  tweet: PropTypes.func
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {
  tweet: doTweet
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
