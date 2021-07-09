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
} from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";

const stripePromise = loadStripe(
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

function Ui(props) {
  const { loggedIn, manga, likeManga, openRegister, suggestRegister } = props;
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

    const result = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <MangaTile>
      <a
        onClick={() =>
          stripe_prices
            ? handlePurchaseClick()
            : handleMangaClick(`/manga/${id}`, "manga")
        }
      >
        <MangaImage src={image ? getGdayPunchStaticUrl(image) : cover} />
      </a>
      <MangaDetails>
        <a onClick={() => handleMangaClick(`/manga/${id}`, "manga")}>
          <MangaTitle>{title}</MangaTitle>
          <MangaArtist>{author_name}</MangaArtist>
          {price && <p>{`A$${price}`}</p>}
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
    </MangaTile>
  );
}

export default Ui;
