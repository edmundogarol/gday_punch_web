import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { CommentOutlined } from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import { message } from "antd";

import { gdayfetch } from "utils/gdayfetch";
import { getGdayPunchStaticUrl } from "utils/utils";

import {
  MangaTile,
  MangaImage,
  MangaTitle,
  MangaArtist,
  MangaDetails,
  ActionButton,
  NumberLabel,
  InteractionContainer,
} from "./styles";

const stripePromise = loadStripe(
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

function Ui(props) {
  const {
    loggedIn,
    manga,
    likeManga,
    openRegister,
    suggestRegister,
    updateCartItemQuantity,
    viewProduct,
  } = props;
  const {
    id,
    cover,
    title,
    user_likes,
    likes,
    comments,
    author_name,
    image,
    price,
    stripe_prices,
  } = manga;
  const perma_link = manga.title.toLowerCase().split(" ").join("-");

  function handleMangaClick(destination, clickType) {
    const clickTypeMessages = {
      manga: "Info: Sign up or Log in to read this manga!",
      like: "Info: Sign up or Log in to like this manga!",
    };

    console.log({
      clickType,
      loggedIn,
      manga,
      "!manga.user_likes": !manga.user_likes,
    });

    if (clickType === "manga") {
      if (!loggedIn) {
        window.location.href = "/#top";
        openRegister();
        suggestRegister(clickTypeMessages[clickType]);
      } else {
        props.history.push(destination);
      }
    } else if (clickType === "like") {
      if (!loggedIn) {
        window.location.href = "/#top";
        openRegister();
        suggestRegister(clickTypeMessages[clickType]);
      } else if (!manga.user_likes) {
        likeManga(manga.id);
      } else {
        // Implement Unlike Manga
      }
    }
  }

  const handlePurchaseClick = async (event) => {
    const stripe = await stripePromise;
    const response = await gdayfetch("payments/create-checkout-session/", {
      method: "POST",
      body: {
        stripe_ids: stripe_prices,
      },
    });

    if (response && response.ok) {
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } else {
      console.log("Checkout Purchase error", JSON.stringify(response));
      message.error({
        content: "Checkout Purchase error",
        className: "antd-message-capitalize",
        style: {
          textTransform: "capitalize",
        },
      });
    }
  };

  const handleAddToCart = () => {
    updateCartItemQuantity(manga.id, 1, true);
  };

  const handleViewProduct = () => {
    viewProduct(manga.id);
    props.history.push(`/product/${manga.id}/${perma_link}`);
  };

  return (
    <MangaTile>
      <a
        onClick={() =>
          stripe_prices
            ? handleViewProduct()
            : handleMangaClick(`/manga/${id}`, "manga")
        }
      >
        <MangaImage src={image ? getGdayPunchStaticUrl(image) : cover} />
      </a>
      <MangaDetails>
        <a
          onClick={() =>
            stripe_prices
              ? handleViewProduct()
              : handleMangaClick(`/manga/${id}`, "manga")
          }
        >
          <MangaTitle>{title}</MangaTitle>
          <MangaArtist>{author_name}</MangaArtist>
          {price && price > 0 ? <p>{`A$${price}`}</p> : <p>{`FREE`}</p>}
        </a>
        <a onClick={() => handleMangaClick(undefined, "like")}>
          <FontAwesomeIcon
            icon={faHeart}
            style={manga && user_likes ? { color: "red" } : null}
          />
          <NumberLabel>{`${likes || 0}`}</NumberLabel>
        </a>
        <InteractionContainer
          onClick={() => handleMangaClick(undefined, "like")}
        >
          <CommentOutlined className="site-form-item-icon" />
          <NumberLabel>{`${comments || 0}`}</NumberLabel>
        </InteractionContainer>
      </MangaDetails>
      {price && price > 0 && (
        <ActionButton onClick={() => handleAddToCart()}>
          Add To Cart
        </ActionButton>
      )}
    </MangaTile>
  );
}

export default Ui;
