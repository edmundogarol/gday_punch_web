import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarEditor from "react-avatar-editor";
import {
  faSearchPlus,
  faSearchMinus,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import Slider from "rc-slider";
import classNames from "classnames";
import { doResetTweet } from "actions/admin";
import { ErrorField } from "components/errorField";
import { isEqual } from "lodash";
import {
  selectTweetLoading,
  selectEmbeddedTweetCode,
  selectTweetError,
  selectPendingTweet,
} from "selectors/admin";
import "rc-slider/assets/index.css";

import {
  doTweet,
  doUpdateTweetImage,
  doUpdateTweetStatus,
  setDeletingTweet
} from "actions/admin";

function Admin(props) {
  const {
    tweet,
    resetTweet,
    embeddedTweet,
    updateTweetStatus,
    updateTweetImage,
    tweetState,
    pendingTweet,
    tweetError,
    deleteTweet
  } = props;
  const { tweetLoading, tweetSuccess } = tweetState;
  const tweetImage = pendingTweet.image;
  const [imageUpdated, setImageUpdated] = useState(false);
  const [imageUpload, setImage] = useState(undefined);
  const [imagePosition, setPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setSize] = useState(1);
  const editorRef = useRef();
  const {} = props;
  const { app } = useParams();
  const twitter = app === "twitter";

  useEffect(() => {
    if (tweetSuccess) {
      resetTweet();
      setImage(undefined);
      setPosition({ x: 0, y: 0 });

      const editableDiv = document.querySelector("[contenteditable]");
      editableDiv.innerHTML = "";
    }
  });

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

  async function handleImageChange(positionChanged = false) {
    const { current } = editorRef;

    // Tweet not updated? -> change image
    if (!!current && !tweetLoading && !imageUpdated) {
      const blob = await new Promise((resolve) =>
        editorRef.current.getImage().toBlob(resolve)
      );

      // Image same? -> don't change
      if (isEqual(blob.size, tweetImage.size) && !positionChanged) {
        return;
      }

      updateTweetImage(blob);
      setImageUpdated(true);
      // Tweet was recently updated
    } else {
      const blob = await new Promise((resolve) =>
        editorRef.current.getImage().toBlob(resolve)
      );

      // Updating again -> are sizes different? -> update image
      if (!isEqual(blob.size, tweetImage.size) || positionChanged) {
        setImageUpdated(false);
        handleImageChange();
      }
    }
  }

  function handleImageUpload(imageFile) {
    console.log("UPLOAD CHANGE");
    setImage(imageFile);
    updateTweetImage(imageFile);
  }

  function handleTweet() {
    handleImageChange();

    const editableDiv = document.querySelector("[contenteditable]");
    const innerText = editableDiv.innerText;

    updateTweetStatus(innerText);
    if (!tweetLoading) tweet();
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
            {!!embeddedTweet.id && (
              <div className="embedded-group">
                <div dangerouslySetInnerHTML={{ __html: embeddedTweet.html }} />
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="delete-icon"
                  onClick={() => deleteTweet(embeddedTweet.id)}
                />
              </div>
            )}
            {imageUpload ? (
              <>
                <AvatarEditor
                  className={classNames({
                    loading: tweetLoading
                  })}
                  ref={editorRef}
                  image={window.URL.createObjectURL(imageUpload)}
                  width={250}
                  height={250}
                  border={50}
                  onImageChange={() => handleImageChange()}
                  onPositionChange={(position) => {
                    setPosition(position);
                    handleImageChange(true);
                  }}
                  position={imagePosition}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={imageSize}
                  rotate={0}
                />
                <div
                  className={classNames("avatar-buttons", {
                    loading: tweetLoading
                  })}
                >
                  <FontAwesomeIcon icon={faSearchMinus} />
                  <Slider onChange={(value) => setSize(1 + value / 100)} />
                  <FontAwesomeIcon icon={faSearchPlus} />
                </div>
              </>
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
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            )}
            {tweetError && (
              <ErrorField style={{ width: "350px", whiteSpace: "normal" }}>
                <div>
                  <label>Error:</label>
                  {tweetError}
                </div>
              </ErrorField>
            )}
            <div
              disabled={tweetLoading}
              contentEditable
              suppressContentEditableWarning={true}
              onKeyDown={() => handleChangeText()}
              className={classNames("status-area", {
                loading: tweetLoading
              })}
              rows="10"
              cols="20"
            >
              {tweetLoading && <div className="loader"></div>}
            </div>
            <button
              disabled={tweetLoading}
              onClick={() => handleTweet()}
              className={classNames("submit-button", {
                loading: tweetLoading
              })}
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
  tweetLoading: PropTypes.bool,
  tweetSuccess: PropTypes.bool,
  embeddedTweet: PropTypes.object,
  tweetError: PropTypes.string,
  pendingTweet: PropTypes.object,

  tweet: PropTypes.func,
  updateTweetImage: PropTypes.func,
  updateTweetStatus: PropTypes.func,
  deleteTweet: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  tweetState: selectTweetLoading,
  embeddedTweet: selectEmbeddedTweetCode,
  tweetError: selectTweetError,
  pendingTweet: selectPendingTweet
});

const mapDispatchToProps = {
  tweet: doTweet,
  updateTweetImage: doUpdateTweetImage,
  updateTweetStatus: doUpdateTweetStatus,
  resetTweet: doResetTweet,
  deleteTweet: setDeletingTweet
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
