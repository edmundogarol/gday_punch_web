import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { CommentOutlined, BookOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";

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
    saveProduct,
    unsaveProduct,
  } = props;
  const { manga_details } = product;
  const {
    id,
    title,
    image,
    active_price,
    product_type,
    quantity,
    purchased,
    saved,
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
  const purchasedDigital = purchased && digitalProduct;

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
    if (product_type.includes("_subscription") && purchased) {
      return (
        <Badge color="#87d068">
          <ActionButton disabled>Already Subscribed</ActionButton>
        </Badge>
      );
    }

    if (!buyableProduct || purchasedDigital) {
      if (purchasedDigital) {
        return (
          <Badge color="#87d068">
            <ActionButton onClick={() => handleViewProduct()}>
              Read Now
            </ActionButton>
          </Badge>
        );
      }
      return (
        <ActionButton onClick={() => handleViewProduct()}>
          Read Now
        </ActionButton>
      );
    }

    if (digitalProduct) {
      return (
        <ActionButton
          disabled={quantity}
          onClick={() => (!quantity || quantity < 1 ? handleAddToCart() : null)}
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
  };

  const handleSaveClick = () => {
    if (!saved) {
      saveProduct(id);
    } else {
      unsaveProduct(saved);
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
            purchasedDigital ? (
              <p>Purchased</p>
            ) : (
              <p>
                {`A$${active_price}`}
                <span className="interval">
                  {product.product_type.includes("subscription")
                    ? product_type === "mag_subscription"
                      ? "/ per release"
                      : `/ ${
                          product.subscription_interval < 2
                            ? "per month"
                            : `every ${product.subscription_interval} months`
                        }`
                    : null}
                </span>
              </p>
            )
          ) : (
            <p>{`FREE`}</p>
          )}
          {digitalProduct && !product_type.includes("_subscription") && (
            <LikeCommentConainer>
              <Tooltip title="Like">
                <a onClick={() => handleLikeClick()}>
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={product && user_likes ? { color: "red" } : null}
                  />
                  <NumberLabel>{`${likes || 0}`}</NumberLabel>
                </a>
              </Tooltip>
              <Tooltip title="Comments">
                <InteractionContainer onClick={() => handleViewProduct()}>
                  <CommentOutlined className="site-form-item-icon" />
                  <NumberLabel>{`${comments || 0}`}</NumberLabel>
                </InteractionContainer>
              </Tooltip>
              <Tooltip title={saved ? "Saved" : "Save"}>
                <BookOutlined
                  className={`site-form-item-icon ${saved ? "saved" : ""}`}
                  onClick={() => handleSaveClick()}
                />
              </Tooltip>
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
