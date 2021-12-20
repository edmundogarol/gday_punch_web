import React, { useState, useEffect } from "react";
import moment from "moment";
import { Page, pdfjs } from "react-pdf";
import { useParams, NavLink, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Input, Slider, Tooltip, message } from "antd";
import { UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Document } from "react-pdf/dist/entry.webpack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { TextArea } = Input;
const { confirm } = Modal;
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faSearchPlus,
  faSearchMinus,
  faHeart,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import LoadingSpinner from "components/loadingSpinner";
import UserAvatar from "components/UserAvatar";
import { ConfirmUploadSummary } from "pages/Stall/styles";
import { submitContactForm } from "actions/app";
import { doUpdateUserDetails } from "actions/user";
import {
  doGetManga,
  doSetReadingManga,
  doCommentManga,
  doGetComments,
  doLikeComment,
  doLikeManga,
  unlikeManga,
  recordView,
} from "actions/manga";
import { selectUser } from "selectors/app";
import { selectReadingManga, selectComments } from "selectors/manga";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { getGdayPunchStaticUrl, makeSafeUrl } from "utils/utils";

import { ReaderContainer, LikeButton } from "./styles";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Reader({ history }) {
  const manga = useSelector(selectReadingManga);
  const comments = useSelector(selectComments);
  const user = useSelector(selectUser);

  const [pageNumber, setPageNumber] = useState(1);
  const [sizeLevel, setSizeLevel] = useState(0);
  const [newUsername, setNewUsername] = useState();
  const [comment, setComment] = useState("");
  const [submittingUsername, setSubmittingUsername] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const { id } = useParams();
  const mangaId = parseInt(id);

  const styles = getStyles();

  const dispatch = useDispatch();

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

  useEffect(() => {
    if (pageCount && pageNumber === 3) {
      dispatch(recordView(mangaId));
    }
  }, [pageCount, pageNumber]);

  function handleCommentSubmit() {
    if (!user.username.length) {
      modal.confirm(updateUsernameConfig);
    } else {
      dispatch(doCommentManga(comment, mangaId));
      setComment("");
    }
  }

  useEffect(() => {
    if (submittingUsername) {
      dispatch(doUpdateUserDetails({ username: newUsername }));
    }
  }, [newUsername, submittingUsername]);

  useEffect(() => {
    const newManga = manga?.id !== mangaId;

    if (manga === undefined || newManga) {
      dispatch(doSetReadingManga(mangaId));
      dispatch(doGetManga(mangaId));
      dispatch(doGetComments(mangaId));
    }
  }, [manga]);

  const leftClick = () =>
    leftNavigatorDisabled
      ? history.push("/")
      : setPageNumber(japaneseReading ? pageNumber + 1 : pageNumber - 1);

  const rightClick = () =>
    rightNavigatorDisabled
      ? history.push("/")
      : setPageNumber(japaneseReading ? pageNumber - 1 : pageNumber + 1);

  const reportComment = (comment) => {
    let reportDetails = undefined;

    const handleReport = () => {
      if (!reportDetails?.length) {
        message.error(
          "Please add details to your report to help us better deal with the problem."
        );
      } else {
        dispatch(
          submitContactForm({
            name: user.author_details.name,
            email: user.email,
            reason: "report",
            content: JSON.stringify({
              id: comment.author.id,
              name: comment.author.name,
              ref: manga.title,
              refId: manga.product_id,
              content: `${reportDetails} [comment]: ${comment.content}`,
            }),
          })
        );
        message.success(
          "Report submitted! We will get back to you as soon as possible."
        );
      }
    };

    confirm({
      title: `Reporting comment from user: ${comment.author.name}`,
      icon: <ExclamationCircleOutlined />,
      okText: "Submit",
      content: (
        <ConfirmUploadSummary>
          <div className="summary-item">
            <h4>{"User"}</h4>
            <p>{comment.author.name}</p>
          </div>
          <div className="summary-item">
            <h4>{"Comment"}</h4>
            <p>{comment.content}</p>
          </div>
          <div className="summary-item">
            <h4>{"Report Date"}</h4>
            <p>{moment(moment.now()).format("LLL")}</p>
          </div>
          <TextArea
            rows={5}
            value={reportDetails}
            placeholder="Report details"
            onChange={(e) => (reportDetails = e.target.value)}
          />
        </ConfirmUploadSummary>
      ),
      onOk() {
        handleReport();
      },
      onCancel() {},
    });
  };

  const reportManga = () => {
    let reportDetails = undefined;

    const handleReport = () => {
      if (!reportDetails?.length) {
        message.error(
          "Please add details to your report to help us better deal with the problem."
        );
      } else {
        dispatch(
          submitContactForm({
            name: user.author_details.name,
            email: user.email,
            reason: "report",
            content: JSON.stringify({
              id: manga.author_id,
              name: manga.author,
              ref: manga.title,
              refId: manga.product_id,
              content: `${reportDetails} [page no.]: ${pageNumber}`,
            }),
          })
        );
        message.success(
          "Report submitted! We will get back to you as soon as possible."
        );
      }
    };

    confirm({
      title: `Reporting user manga: ${manga.author} - ${manga.title}`,
      icon: <ExclamationCircleOutlined />,
      okText: "Submit",
      content: (
        <ConfirmUploadSummary>
          <div className="summary-item">
            <h4>{"Manga"}</h4>
            <p>{manga.title}</p>
          </div>
          <div className="summary-item">
            <h4>{"User"}</h4>
            <p>{manga.author}</p>
          </div>
          <div className="summary-item">
            <h4>{"Report Date"}</h4>
            <p>{moment(moment.now()).format("LLL")}</p>
          </div>
          <TextArea
            rows={5}
            value={reportDetails}
            placeholder="Report details"
            onChange={(e) => (reportDetails = e.target.value)}
          />
        </ConfirmUploadSummary>
      ),
      onOk() {
        handleReport();
      },
      onCancel() {},
    });
  };

  return (
    <ReaderContainer className="pdf-reader">
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
      {manga && (
        <div className="pdf-details">
          <h2 style={styles.mangaTitle}>{manga.title}</h2>
          <h4 style={styles.mangaArtist}>{manga.author}</h4>
          <LikeButton
            onClick={() =>
              !manga.user_likes
                ? dispatch(doLikeManga(manga.id))
                : dispatch(unlikeManga(manga.user_likes))
            }
          >
            <FontAwesomeIcon
              icon={faHeart}
              style={manga && manga.user_likes ? { color: "red" } : null}
            />
            {`${manga ? manga.likes : 0}`}
          </LikeButton>
          <Tooltip title="Report Manga">
            <LikeButton onClick={() => reportManga()}>
              <ExclamationCircleOutlined />
            </LikeButton>
          </Tooltip>
        </div>
      )}

      <div className="comments-section">
        <h2>Comments</h2>
        <div className="comments-container">
          {comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <UserAvatar author={comment.author} />
              <div className="author">
                <NavLink
                  to={`/stall/${comment.author.id}/${makeSafeUrl(
                    comment.author.name
                  )}`}
                >
                  {comment.author.name}
                </NavLink>
              </div>
              <div className="content">{comment.content}</div>
              <LikeButton
                onClick={() =>
                  !comment.user_likes
                    ? dispatch(doLikeComment(comment.id, user.id))
                    : null
                }
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  style={comment.user_likes ? { color: "red" } : null}
                />
                {`${comment.likes}`}
              </LikeButton>
              <Tooltip title="Report comment">
                <LikeButton onClick={() => reportComment(comment)}>
                  <ExclamationCircleOutlined />
                </LikeButton>
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="comment-creator">
          <input
            type="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="effect-fade" onClick={() => handleCommentSubmit()}>
            Comment
          </button>
        </div>
      </div>
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

export default withRouter(Reader);
