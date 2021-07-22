import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { CommentOutlined } from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import { message } from "antd";

import { gdayfetch } from "utils/gdayfetch";
import { getGdayPunchStaticUrl } from "utils/utils";

import {
  ProductTileContainer,
  ProductImage,
  ProductTitle,
  ProductAuthor,
  ProductDetails,
  ActionButton,
  NumberLabel,
  InteractionContainer,
} from "./styles";

const stripePromise = loadStripe(
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

const productType = {
  1: "Physical",
};

function Ui(props) {
  const {
    loggedIn,
    product,
    likeManga,
    openRegister,
    suggestRegister,
    updateCartItemQuantity,
    viewProduct,
  } = props;
  const { manga_details } = product;
  const { id: mangaId } = manga_details || { id: undefined };
  const {
    //manga
    id,
    cover,
    title,
    comments,
    author_name,
    image,
    //product
    active_price,
    stripe_prices,
    product_type,
  } = product;
  const user_likes =
    product.user_likes || (manga_details ? manga_details.user_likes : false);
  const likes = product.likes || (manga_details ? manga_details.likes : 0);

  const perma_link = product.title.toLowerCase().split(" ").join("-");

  console.log({ active_price });

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
      } else if (!user_likes) {
        likeManga(manga_details ? mangaId : id, !!manga_details);
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
    updateCartItemQuantity(id, 1, true);
  };

  const handleViewProduct = () => {
    const purchased = false;
    viewProduct(id);
    if (!active_price || purchased) {
      handleMangaClick(`/manga/${!active_price ? id : mangaId}`, "manga");
    } else {
      props.history.push(`/product/${id}/${perma_link}`);
    }
  };

  console.log({ product });
  return (
    <ProductTileContainer>
      <a
        onClick={() =>
          stripe_prices
            ? handleViewProduct()
            : handleMangaClick(`/manga/${id}`, "manga")
        }
      >
        <ProductImage src={image ? getGdayPunchStaticUrl(image) : cover} />
      </a>
      <ProductDetails>
        <a
          onClick={() =>
            stripe_prices
              ? handleViewProduct()
              : handleMangaClick(`/manga/${id}`, "manga")
          }
        >
          <ProductTitle>{title}</ProductTitle>
          <ProductAuthor>{author_name}</ProductAuthor>
          {active_price && active_price > 0 ? (
            <p>{`A$${active_price}`}</p>
          ) : (
            <p>{`FREE`}</p>
          )}
        </a>
        {!productType[product_type] && (
          <>
            <a onClick={() => handleMangaClick(undefined, "like")}>
              <FontAwesomeIcon
                icon={faHeart}
                style={product && user_likes ? { color: "red" } : null}
              />
              <NumberLabel>{`${likes || 0}`}</NumberLabel>
            </a>
            <InteractionContainer onClick={() => handleViewProduct()}>
              <CommentOutlined className="site-form-item-icon" />
              <NumberLabel>{`${comments || 0}`}</NumberLabel>
            </InteractionContainer>
          </>
        )}
      </ProductDetails>
      {active_price && active_price > 0 && (
        <ActionButton onClick={() => handleAddToCart()}>
          Add To Cart
        </ActionButton>
      )}
    </ProductTileContainer>
  );
}

export default Ui;
