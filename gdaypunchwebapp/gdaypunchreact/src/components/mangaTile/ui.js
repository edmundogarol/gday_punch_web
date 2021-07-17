import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { loadStripe } from "@stripe/stripe-js";
import { gdayfetch } from "utils/gdayfetch";

import {
  MangaTile,
  MangaImage,
  MangaTitle,
  MangaArtist,
  MangaDetails,
  ActionButton,
} from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";
import { message } from "node_modules/antd/lib/index";

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
    updateCartItems,
    viewProduct,
  } = props;
  const {
    id,
    cover,
    title,
    user_likes,
    likes,
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
    updateCartItems(manga, true);
  };

  const handleViewProduct = () => {
    viewProduct(manga);
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
        {manga && likes && (
          <a onClick={() => handleMangaClick(undefined, "like")}>
            <FontAwesomeIcon
              icon={faHeart}
              style={manga && user_likes ? { color: "red" } : null}
            />
            {`(${likes || 0})`}
          </a>
        )}
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
