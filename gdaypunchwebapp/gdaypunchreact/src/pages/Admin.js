import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarEditor from "react-avatar-editor";
import { faSearchPlus, faSearchMinus } from "@fortawesome/free-solid-svg-icons";
import Slider from "rc-slider";
import classNames from "classnames";
import { doResetTweet } from "actions/admin";
import { selectTweetLoading, selectEmbeddedTweetCode } from "selectors/admin";
import "rc-slider/assets/index.css";

import {
  doTweet,
  doUpdateTweetImage,
  doUpdateTweetStatus
} from "actions/admin";

function Admin(props) {
  const {
    tweet,
    resetTweet,
    embeddedTweet,
    updateTweetStatus,
    updateTweetImage,
    tweetState
  } = props;
  const { tweetLoading, tweetSuccess } = tweetState;
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

  async function handleImageChange() {
    const { current } = editorRef;
    if (!!current && !tweetLoading) {
      const blob = await new Promise((resolve) =>
        editorRef.current.getImageScaledToCanvas().toBlob(resolve)
      );

      updateTweetImage(blob);
    }
  }

  function handleImageUpload(imageFile) {
    console.log("UPLOAD CHANGE");
    setImage(imageFile);
    updateTweetImage(imageFile);
  }

  function handleTweet() {
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
            {!!embeddedTweet && (
              <div dangerouslySetInnerHTML={{ __html: embeddedTweet }} />
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
                  onMouseUp={() => handleImageChange()}
                  onPositionChange={(position) => setPosition(position)}
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
  embeddedTweet: PropTypes.string,

  tweet: PropTypes.func,
  updateTweetImage: PropTypes.func,
  updateTweetStatus: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  tweetState: selectTweetLoading,
  embeddedTweet: selectEmbeddedTweetCode
});

const mapDispatchToProps = {
  tweet: doTweet,
  updateTweetImage: doUpdateTweetImage,
  updateTweetStatus: doUpdateTweetStatus,
  resetTweet: doResetTweet
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
