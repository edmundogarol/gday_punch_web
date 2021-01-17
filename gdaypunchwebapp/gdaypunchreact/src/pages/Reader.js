import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Page, pdfjs } from "react-pdf";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Document } from "react-pdf/dist/entry.webpack";
import { openRegistration, doSuggestRegister } from "actions/user";
import {
  doGetManga,
  doSetReadingManga,
  doCommentManga,
  doGetComments,
  doLikeComment,
  doLikeManga
} from "actions/manga";
import { doUpdateUserDetails } from "actions/user";
import {
  selectLoginViewToggle,
  selectLoggedIn,
  selectUser
} from "selectors/app";
import { selectReadingManga, selectComments } from "selectors/manga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faSearchPlus,
  faSearchMinus,
  faHeart,
  faHome
} from "@fortawesome/free-solid-svg-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Reader(props) {
  const {
    file,
    orientation = "japanese",
    readerOnly,
    manga,
    getManga,
    updateUserDetails,
    commentManga,
    getComments,
    comments,
    likeComment,
    likeManga,
    loggedIn,
    user
  } = props;
  const [pageNumber, setPageNumber] = useState(1);
  const [sizeLevel, setSizeLevel] = useState(0);
  const [newUsername, setNewUsername] = useState();
  const [comment, setComment] = useState("");
  const [submittingUsername, setSubmittingUsername] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const { id } = useParams();
  const mangaId = parseInt(id);
  const styles = getStyles();

  let pageCount;
  if (manga && manga.title === "Escape") pageCount = 4;
  if (manga && manga.title === "Kingslore") pageCount = 8;

  const japaneseReading = orientation === "japanese";
  const firstPage = pageNumber === 1;
  const lastPage = pageNumber === pageCount;
  const leftNavigatorDisabled = japaneseReading ? lastPage : firstPage;
  const rightNavigatorDisabled = japaneseReading ? firstPage : lastPage;
  const lowerDisabled = sizeLevel === 0;
  const higerDisabled = sizeLevel === 2;

  const readerSizeLevels = [
    { container: "60", page: 500 },
    { container: "80", page: 750 },
    { container: "100", page: 1000 }
  ];

  const updateUsernameConfig = {
    title: "Update Account Details",
    cancelText: "Cancel",
    onCancel: () => console.log("CLOSE"),
    onOk: () => setSubmittingUsername(true),
    content: (
      <>
        <p>Update account username to comment</p>
        <Input
          size="large"
          placeholder="New username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          prefix={<UserOutlined />}
        />
      </>
    )
  };

  function handleCommentSubmit() {
    if (!user.username.length) {
      modal.confirm(updateUsernameConfig);
    } else {
      commentManga(comment, mangaId);
      setComment("");
    }
  }

  useEffect(() => {
    if (submittingUsername) {
      updateUserDetails({ username: newUsername });
    }
  }, [newUsername, submittingUsername]);

  useEffect(() => {
    if (file) return;

    const { setReadingManga, manga } = props;
    const newManga = manga?.id !== mangaId;

    if (manga === undefined || newManga) {
      setReadingManga(mangaId);
      getManga(mangaId);
      getComments(mangaId);
    }
  }, [manga]);

  return (
    <div
      className={classNames("pdf-reader", {
        "reader-only": readerOnly
      })}
    >
      <div style={styles.pdf}>
        <FontAwesomeIcon
          className="pdf-button"
          style={styles.pdfNavigator("left")}
          icon={leftNavigatorDisabled ? faHome : faChevronCircleLeft}
          onClick={() =>
            leftNavigatorDisabled
              ? (window.location.href = "/")
              : setPageNumber(japaneseReading ? pageNumber + 1 : pageNumber - 1)
          }
        />
        <Document
          style={{
            width: `${readerSizeLevels[sizeLevel].container}%`
          }}
          file={file ? file : manga?.pdf}
          className="pdf-container"
          options={{
            rangeChunkSize: 2000000
          }}
        >
          <Page
            loading={"Hang on! Loading page..."}
            pageNumber={pageNumber}
            width={readerSizeLevels[sizeLevel].page}
            object-fit="fill"
            onRenderSuccess={null}
            size="A4"
          />
        </Document>
        <FontAwesomeIcon
          className="pdf-button"
          style={styles.pdfNavigator("right")}
          icon={rightNavigatorDisabled ? faHome : faChevronCircleRight}
          onClick={() =>
            rightNavigatorDisabled
              ? (window.location.href = "/")
              : setPageNumber(japaneseReading ? pageNumber - 1 : pageNumber + 1)
          }
        />
        <FontAwesomeIcon
          className="pdf-button"
          style={styles.pdfMagnifier("left", false)}
          icon={faSearchMinus}
          onClick={() => (lowerDisabled ? null : setSizeLevel(sizeLevel - 1))}
        />
        <FontAwesomeIcon
          className="pdf-button"
          style={styles.pdfMagnifier("right", false)}
          icon={faSearchPlus}
          onClick={() => (higerDisabled ? null : setSizeLevel(sizeLevel + 1))}
        />
      </div>

      {!readerOnly && manga && (
        <div className="pdf-details">
          <h2 style={styles.mangaTitle}>{manga.title}</h2>
          <h4 style={styles.mangaArtist}>by Edmundo (Yungy) Garol</h4>
          <a onClick={() => (!manga.user_likes ? likeManga(manga.id) : null)}>
            <FontAwesomeIcon
              icon={faHeart}
              style={manga && manga.user_likes ? { color: "red" } : null}
            />
            {`(${manga ? manga.likes : 0})`}
          </a>
        </div>
      )}

      {!readerOnly && (
        <div className="comments-section">
          <h2>Comments</h2>
          <div className="comments-container">
            {comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <div className="author">{comment.user_username}</div>
                <div className="content">{comment.content}</div>
                <a
                  onClick={() =>
                    !comment.user_likes
                      ? likeComment(comment.id, user.id)
                      : null
                  }
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={comment.user_likes ? { color: "red" } : null}
                  />
                  {`${comment.likes}`}
                </a>
              </div>
            ))}
          </div>
          <div className="comment-creator">
            <input
              type="textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="effect-fade"
              onClick={() => handleCommentSubmit()}
            >
              Comment
            </button>
          </div>
        </div>
      )}
      {contextHolder}
    </div>
  );
}

function getStyles() {
  return {
    pdf: {
      display: "grid",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      position: "relative",
      paddingBottom: 50,
      gridTemplateColumns: "50px auto 50px",
      gridTemplateRows: "auto 100px"
    },
    pdfMagnifier: (position, disabled) => ({
      bottom: 0,
      height: "4em",
      width: "4em",
      opacity: disabled ? "0" : "0.3",
      transform: position === "left" ? "translateX(-40px)" : "translateX(40px)",
      gridColumnStart: 2,
      gridColumnEnd: 2,
      gridRowStart: 2,
      gridRowEnd: 2,
      justifySelf: "center"
    }),
    pdfNavigator: (position) => ({
      position: "relative",
      opacity: 0.3,
      zIndex: 1,
      height: "4em",
      width: "4em",
      gridColumnStart: position === "left" ? 0 : 3,
      gridColumnEnd: position === "left" ? 0 : 3,
      gridRowStart: 1,
      gridRowEnd: 1,
      justifySelf: "center"
    })
  };
}

Reader.propTypes = {
  // Component Properites
  user: PropTypes.object,
  orientation: PropTypes.string,
  readerOnly: PropTypes.bool,
  pageCount: PropTypes.number,
  manga: PropTypes.object,
  // Redux Properties
  gpManga: PropTypes.object,
  loggedIn: PropTypes.bool.isRequired,
  loginView: PropTypes.bool.isRequired,
  userManga: PropTypes.object,
  // Redux Functions
  openRegister: PropTypes.func.isRequired,
  suggestRegister: PropTypes.func.isRequired,
  setReadingManga: PropTypes.func.isRequired,
  getManga: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
  manga: selectReadingManga,
  comments: selectComments
});

const mapDispatchToProps = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  setReadingManga: doSetReadingManga,
  getManga: doGetManga,
  updateUserDetails: doUpdateUserDetails,
  commentManga: doCommentManga,
  getComments: doGetComments,
  likeComment: doLikeComment,
  likeManga: doLikeManga
};

export default connect(mapStateToProps, mapDispatchToProps)(Reader);
