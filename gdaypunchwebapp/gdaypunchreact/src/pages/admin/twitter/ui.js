import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarEditor from "react-avatar-editor";
import {
  faSearchPlus,
  faSearchMinus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import classNames from "classnames";
import { ErrorField } from "components/errorField";
import { isEqual } from "lodash";
import { useScrollTop } from "utils/hooks/useScrollTop";

function Ui(props) {
  const {
    tweet,
    resetTweet,
    embeddedTweet,
    updateTweetStatus,
    updateTweetImage,
    updateReTweetUrl,
    tweetState,
    pendingTweet,
    tweetError,
    deleteTweet,
  } = props;
  const { tweetLoading, tweetSuccess } = tweetState;
  const tweetImage = pendingTweet.image;
  const [imageUpdated, setImageUpdated] = useState(false);
  const [imageUpload, setImage] = useState(undefined);
  const [retweetUrl, setRetweetUrl] = useState();
  const [imagePosition, setPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setSize] = useState(1);
  const editorRef = useRef();
  const {} = props;
  const { app } = useParams();

  useScrollTop();

  useEffect(() => {
    if (tweetSuccess) {
      resetTweet();
      setRetweetUrl("");
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
    } else if (!!current && tweetImage && tweetImage.size) {
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

  function handleRetweetChange(e) {
    setRetweetUrl(e.target.value);
  }

  function handleImageUpload(imageFile) {
    setImage(imageFile);
    updateTweetImage(imageFile);
  }

  function handleTweet() {
    const editableDiv = document.querySelector("[contenteditable]");
    const innerText = editableDiv.innerText;

    if (retweetUrl && !innerText.length) {
      alert("If retweeting, please add a comment/status.");
      return;
    }

    handleImageChange();

    updateTweetStatus(innerText);
    updateReTweetUrl(retweetUrl);
    if (!tweetLoading) tweet();
  }

  function imageRenderer() {
    return imageUpload ? (
      <>
        <AvatarEditor
          className={classNames({
            loading: tweetLoading,
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
            loading: tweetLoading,
          })}
        >
          <FontAwesomeIcon
            className={classNames({
              loading: tweetLoading,
            })}
            icon={faSearchMinus}
          />
          <Slider
            disabled={tweetLoading}
            className={classNames("resize-slider", {
              loading: tweetLoading,
            })}
            onChange={(value) => setSize(1 + value / 100)}
          />
          <FontAwesomeIcon
            className={classNames({
              loading: tweetLoading,
            })}
            icon={faSearchPlus}
          />
        </div>
      </>
    ) : (
      <input
        title=" "
        value={
          imageUpload ? window.URL.createObjectURL(imageUpload) : undefined
        }
        className={classNames("upload-button", {
          loading: tweetLoading,
        })}
        disabled={tweetLoading}
        type="file"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
    );
  }

  return (
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
      {!retweetUrl && imageRenderer()}
      {tweetError && (
        <ErrorField style={{ width: "350px", whiteSpace: "normal" }}>
          <div>
            <label>Error:</label>
            {tweetError}
          </div>
        </ErrorField>
      )}
      {!imageUpload && (
        <input
          className={classNames("retweet-url", {
            loading: tweetLoading,
          })}
          value={retweetUrl}
          disabled={tweetLoading}
          placeholder="Retweet URL"
          onChange={handleRetweetChange}
        />
      )}
      <div
        disabled={tweetLoading}
        contentEditable
        suppressContentEditableWarning={true}
        onKeyDown={() => handleChangeText()}
        className={classNames("status-area", {
          loading: tweetLoading,
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
          loading: tweetLoading,
        })}
        type="submit"
      >
        Tweet
      </button>
    </div>
  );
}

export default Ui;
