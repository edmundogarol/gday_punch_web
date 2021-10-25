import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { CommentOutlined, BookOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";

import UserAvatar from "components/userAvatar";
import { doLikeManga, unlikeManga } from "actions/manga";
import { doSuggestRegister, openRegistration } from "actions/user";
import { updateCartItemQuantity } from "actions/cart";
import {
  saveProduct,
  setViewingProduct,
  unsaveProduct,
} from "actions/products";
import { selectLoggedIn } from "selectors/app";
import {
  generatePermaLink,
  getGdayPunchStaticUrl,
  scrollToTop,
} from "utils/utils";

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
  ArtistActionsContainer,
} from "./styles";

function ProductTile(props) {
  const { history, product } = props;
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
    saves,
    visible,
    user_avatar,
    user_string: creator,
  } = product;
  const {
    id: mangaId,
    author,
    author_id,
    comments,
    likes,
    user_likes,
    author_avatar,
    author_likes,
    author_friends,
    author_followers,
    following_author,
  } = manga_details || {
    id: undefined,
    author_id: undefined,
    author: undefined,
    author_avatar: undefined,
    author_likes: undefined,
    comments: undefined,
    likes: undefined,
    user_likes: undefined,
    author_friends: 0,
    author_followers: 0,
    following_author: false,
  };

  const loggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();

  const perma_link = generatePermaLink(product);
  const buyableProduct = active_price && active_price > 0;
  const digitalProduct = product_type !== "physical";
  const purchasedDigital = purchased && digitalProduct;

  const handleAddToCart = () => {
    dispatch(updateCartItemQuantity(id, 1, true));
  };

  const handleLikeClick = () => {
    if (!loggedIn) {
      scrollToTop();
      history.push("/#top");
      dispatch(openRegistration());
      dispatch(
        doSuggestRegister("Info: Sign up or Log in to like this manga!")
      );
    } else if (!user_likes) {
      dispatch(doLikeManga(mangaId, false));
    } else {
      dispatch(unlikeManga(user_likes));
      // Implement Unlike Manga
    }
  };

  const handleViewProduct = () => {
    dispatch(setViewingProduct(id));
    history.push(`/product/${id}/${perma_link}`);
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
    if (!loggedIn) {
      scrollToTop();
      history.push("/#top");
      dispatch(openRegistration());
      dispatch(
        doSuggestRegister("Info: Sign up or Log in to favourite this manga!")
      );
    } else {
      if (!saved) {
        dispatch(saveProduct(id));
      } else {
        dispatch(unsaveProduct(saved));
      }
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
      {renderActionButton()}
      <ProductDetails>
        <UserAvatar
          author_id={author_id}
          image={
            manga_details && manga_details.id ? author_avatar : user_avatar
          }
          author={author || creator}
          author_likes={author_likes}
          author_followers={author_followers}
          author_friends={author_friends}
          following_author={following_author}
        />
        <ArtistActionsContainer>
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
                <Tooltip title={saved ? "Favourited" : "Add to Favourites"}>
                  <BookOutlined
                    className={`site-form-item-icon ${saved ? "saved" : ""}`}
                    onClick={() => handleSaveClick()}
                  />
                </Tooltip>
                {saves && saves > 0 ? (
                  <Tooltip title={"Total Saves (Admin only)"}>
                    <InteractionContainer>
                      <BookOutlined
                        className={`site-form-item-icon ${
                          saves ? "saved" : ""
                        }`}
                      />
                      <NumberLabel>{`${saves || 0}`}</NumberLabel>
                    </InteractionContainer>
                  </Tooltip>
                ) : null}
              </LikeCommentConainer>
            )}
          </PriceLikeCommentConainer>
        </ArtistActionsContainer>
      </ProductDetails>
      <a onClick={() => handleViewProduct()}>
        <ProductTitle>
          {!visible ? "[Hidden]" : ""} {title}
        </ProductTitle>
      </a>
    </ProductTileContainer>
  );
}

export default withRouter(ProductTile);
