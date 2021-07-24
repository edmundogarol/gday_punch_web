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
  PriceLikeCommentConainer,
  LikeCommentConainer,
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
  const {
    id,
    title,
    image,
    active_price,
    product_type,
    user_string: creator,
  } = product;
  const {
    id: mangaId,
    author,
    comments,
    likes,
    user_likes,
  } = manga_details || {
    id: undefined,
    author: undefined,
    comments: undefined,
    likes: undefined,
    user_likes: undefined,
  };

  const perma_link = product.title.toLowerCase().split(" ").join("-");

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
    }
  }

  const handleAddToCart = () => {
    updateCartItemQuantity(id, 1, true);
  };

  const handleLikeClick = () => {
    if (!loggedIn) {
      window.location.href = "/#top";
      openRegister();
      suggestRegister("Info: Sign up or Log in to like this manga!");
    } else if (!user_likes) {
      likeManga(mangaId, false);
    } else {
      // Implement Unlike Manga
    }
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

  return (
    <ProductTileContainer>
      <a onClick={() => handleViewProduct()}>
        <ProductImage src={getGdayPunchStaticUrl(image)} />
      </a>
      <ProductDetails>
        <a onClick={() => handleViewProduct()}>
          <ProductTitle>{title}</ProductTitle>
        </a>
        <ProductAuthor>{author || creator}</ProductAuthor>
        <PriceLikeCommentConainer>
          {active_price && active_price > 0 ? (
            <p>{`A$${active_price}`}</p>
          ) : (
            <p>{`FREE`}</p>
          )}
          {!productType[product_type] && (
            <LikeCommentConainer>
              <a onClick={() => handleLikeClick()}>
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
            </LikeCommentConainer>
          )}
        </PriceLikeCommentConainer>
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
