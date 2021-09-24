import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { CommentOutlined } from "@ant-design/icons";
import { Badge } from "antd";

import { getGdayPunchStaticUrl, scrollToTop } from "utils/utils";

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
  LowStock,
} from "./styles";

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
    quantity,
    stock,
    visible,
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
  const buyableProduct = active_price && active_price > 0;
  const digitalProduct = product_type !== "physical";

  const handleAddToCart = () => {
    updateCartItemQuantity(id, 1, true);
  };

  const handleLikeClick = () => {
    if (!loggedIn) {
      scrollToTop();
      props.history.push("/#top");
      openRegister();
      suggestRegister("Info: Sign up or Log in to like this manga!");
    } else if (!user_likes) {
      likeManga(mangaId, false);
    } else {
      // Implement Unlike Manga
    }
  };

  const handleViewProduct = () => {
    viewProduct(id);
    props.history.push(`/product/${id}/gday-punch-${perma_link}`);
  };

  const renderActionButton = () => {
    if (buyableProduct) {
      if (digitalProduct) {
        return (
          <ActionButton
            disabled={quantity}
            onClick={() =>
              !quantity || quantity < 1 ? handleAddToCart() : null
            }
          >
            {quantity ? "ALREADY IN CART" : "Add to Cart"}
          </ActionButton>
        );
      } else {
        return (
          <ActionButton onClick={() => handleAddToCart()}>
            Add to Cart
          </ActionButton>
        );
      }
    } else {
      return (
        <ActionButton onClick={() => handleViewProduct()}>
          Read Now
        </ActionButton>
      );
    }
  };

  const BadgeWrapper =
    product.stock < 10 && product.product_type === "physical"
      ? Badge.Ribbon
      : LowStock;

  return (
    <ProductTileContainer>
      <BadgeWrapper
        text={
          product.stock < 10
            ? product.stock == 0
              ? "Sold out"
              : `Only ${product.stock} left`
            : undefined
        }
        color="red"
      >
        <a className="img-link" onClick={() => handleViewProduct()}>
          <ProductImage alt={title} src={getGdayPunchStaticUrl(image)} />
        </a>
      </BadgeWrapper>
      <ProductDetails>
        {renderActionButton()}
        <ProductAuthor>{author || creator}</ProductAuthor>
        <PriceLikeCommentConainer>
          {buyableProduct ? (
            <p>{`A$${active_price} ${
              product.product_type.includes("subscription")
                ? `/ ${
                    product.subscription_interval < 2
                      ? "per month"
                      : `every ${product.subscription_interval} months`
                  }`
                : null
            }`}</p>
          ) : (
            <p>{`FREE`}</p>
          )}
          {digitalProduct && (
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
      <a onClick={() => handleViewProduct()}>
        <ProductTitle>
          {!visible ? "[Hidden]" : ""} {title}
        </ProductTitle>
      </a>
    </ProductTileContainer>
  );
}

export default Ui;
