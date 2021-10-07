import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
import { Modal, Input, Slider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Document } from "react-pdf/dist/entry.webpack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faSearchPlus,
  faSearchMinus,
  faHeart,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "components/loadingSpinner";
import { ReaderContainer, LikeButton } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { getGdayPunchStaticUrl } from "utils/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Ui(props) {
  const {
    defaultManga,
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
    user,
  } = props;
  const [pageNumber, setPageNumber] = useState(1);
  const [sizeLevel, setSizeLevel] = useState(0);
  const [newUsername, setNewUsername] = useState();
  const [comment, setComment] = useState("");
  const [submittingUsername, setSubmittingUsername] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const { id } = useParams();
  const mangaId = parseInt(
    // Temporary Fix for deploying new site and still give access to current gdaypunch.com manga
    defaultManga ? (defaultManga === 1 ? 3 : defaultManga) : id
  );
  const styles = getStyles();

  const pageCount = manga?.page_count;
  const japaneseReading = manga?.japanese_reading;
  const firstPage = pageNumber === 1;
  const lastPage = pageNumber === pageCount;
  const leftNavigatorDisabled = japaneseReading ? lastPage : firstPage;
  const rightNavigatorDisabled = japaneseReading ? firstPage : lastPage;
  const lowerDisabled = sizeLevel === 0;
  const higerDisabled = sizeLevel === 2;

  const readerSizeLevels = [
    { container: "60", page: 500 },
    { container: "80", page: 750 },
    { container: "100", page: 1000 },
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
    ),
  };

  useScrollTop();

  useEffect(() => {
    if (manga) {
      document.title = `Reading ${manga.title} | Gday Punch`;
    }
  }, [manga]);

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
    const { setReadingManga, manga } = props;
    const newManga = manga?.id !== mangaId;

    if (defaultManga && (manga === undefined || newManga)) {
      setReadingManga(defaultManga === 1 ? 3 : defaultManga);
      getManga(defaultManga === 1 ? 3 : defaultManga);
      getComments(defaultManga === 1 ? 3 : defaultManga);
    } else if (manga === undefined || newManga) {
      setReadingManga(mangaId);
      getManga(mangaId);
      getComments(mangaId);
    }
  }, [manga]);

  const leftClick = () =>
    leftNavigatorDisabled
      ? props.history.push("/")
      : setPageNumber(japaneseReading ? pageNumber + 1 : pageNumber - 1);

  const rightClick = () =>
    rightNavigatorDisabled
      ? props.history.push("/")
      : setPageNumber(japaneseReading ? pageNumber - 1 : pageNumber + 1);

  return (
    <ReaderContainer
      className={classNames("pdf-reader", {
        "reader-only": readerOnly,
      })}
    >
      <div className="reader-container" style={styles.pdf}>
        <div
          className="left-overlay-clicker-top"
          onClick={() => (leftNavigatorDisabled ? null : leftClick())}
        />
        <div
          className="left-overlay-clicker-bottom"
          onClick={() => (leftNavigatorDisabled ? null : leftClick())}
        />
        <div
          className="right-overlay-clicker-top"
          onClick={() => (rightNavigatorDisabled ? null : rightClick())}
        />
        <div
          className="right-overlay-clicker-bottom"
          onClick={() => (rightNavigatorDisabled ? null : rightClick())}
        />
        <FontAwesomeIcon
          className="pdf-button"
          style={styles.pdfNavigator("left")}
          icon={leftNavigatorDisabled ? faHome : faChevronCircleLeft}
          onClick={() => leftClick()}
        />
        {!manga ? (
          <LoadingSpinner />
        ) : (
          <Document
            style={{
              width: `${readerSizeLevels[sizeLevel].container}%`,
            }}
            file={getGdayPunchStaticUrl(manga?.pdf_live)}
            className="pdf-container"
            options={{
              rangeChunkSize: 2000000,
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
        )}
        <FontAwesomeIcon
          className="pdf-button"
          style={styles.pdfNavigator("right")}
          icon={rightNavigatorDisabled ? faHome : faChevronCircleRight}
          onClick={() => rightClick()}
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
      <Slider
        min={1}
        value={pageNumber}
        reverse={japaneseReading}
        defaultValue={1}
        onChange={(val) => setPageNumber(val)}
        max={pageCount}
      />
      {!readerOnly && manga && (
        <div className="pdf-details">
          <h2 style={styles.mangaTitle}>{manga.title}</h2>
          <h4 style={styles.mangaArtist}>{manga.author}</h4>
          <LikeButton
            onClick={() => (!manga.user_likes ? likeManga(manga.id) : null)}
          >
            <FontAwesomeIcon
              icon={faHeart}
              style={manga && manga.user_likes ? { color: "red" } : null}
            />
            {`${manga ? manga.likes : 0}`}
          </LikeButton>
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
                <LikeButton
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
                </LikeButton>
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
    </ReaderContainer>
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
      gridTemplateRows: "auto 100px",
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
      justifySelf: "center",
      margin: "1em",
      zIndex: 3,
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
      justifySelf: "center",
    }),
  };
}

export default Ui;
