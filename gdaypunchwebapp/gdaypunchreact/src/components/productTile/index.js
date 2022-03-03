import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import {
  CommentOutlined,
  BookOutlined,
  MoreOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Badge, Tooltip, Popover } from "antd";

import UserAvatar, { initialAuthor } from "components/UserAvatar";
import { doLikeManga, unlikeManga, updateMangaProduct } from "actions/manga";
import { doSuggestRegister, openRegistration } from "actions/user";
import { updateCartItemQuantity } from "actions/cart";
import {
  saveProduct,
  setViewingProduct,
  unsaveProduct,
} from "actions/products";
import { selectLoggedIn, selectUserById } from "selectors/app";
import {
  generatePermaLink,
  getGdayPunchStaticUrl,
  makeSafeUrl,
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
  TilePopover,
} from "./styles";

const initialProduct = {
  id: "",
  title: "",
  image: "",
  active_price: 0,
  product_type: "",
  quantity: 0,
  purchased: false,
  saved: false,
  saves: 0,
  visible: true,
  manga_details: {
    id: "",
    author_id: "",
    comments: 0,
    likes: 0,
    user_likes: false,
  },
};

function ProductTile(props) {
  const {
    history,
    product = initialProduct,
    editable,
    editCallback,
    deleteCallback,
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
    saves,
    visible,
    editable: can_edit,
  } = product;
  const {
    id: mangaId,
    author_id,
    comments,
    likes,
    user_likes,
    views,
  } = manga_details;

  const loggedIn = useSelector(selectLoggedIn);
  const author = useSelector(selectUserById(author_id)) || initialAuthor;
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
      {editable && (
        <Popover
          placement="rightTop"
          title={product.name}
          content={
            <TilePopover>
              <Tooltip
                title={
                  can_edit
                    ? "Edit manga details"
                    : "This product cannot be edited as it has been previously sold."
                }
              >
                <button
                  disabled={!can_edit}
                  className={`pop-over-button ${can_edit ? "" : "coming-soon"}`}
                  onClick={() =>
                    editCallback({
                      ...product,
                      ...manga_details,
                      id: product.id,
                    })
                  }
                >
                  Edit
                </button>
              </Tooltip>
              <Tooltip
                title={
                  can_edit
                    ? "Delete manga"
                    : "This product cannot be deleted as it has been previously sold."
                }
              >
                <button
                  className="pop-over-button"
                  onClick={() =>
                    can_edit
                      ? deleteCallback({
                          ...product,
                          ...manga_details,
                          id: product.id,
                        })
                      : dispatch(
                          updateMangaProduct({
                            ...product,
                            ...manga_details,
                            visible: false,
                          })
                        )
                  }
                >
                  {can_edit ? "Delete" : "Archive (Unlist)"}
                </button>
              </Tooltip>
            </TilePopover>
          }
          trigger="click"
        >
          <MoreOutlined />
        </Popover>
      )}
      <ProductDetails>
        <UserAvatar author={author} />
        <ArtistActionsContainer>
          <ProductAuthor>
            <NavLink to={`/stall/${product.user}/${makeSafeUrl(author.name)}`}>
              {author.name}
            </NavLink>
          </ProductAuthor>
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
                <Tooltip title="Views">
                  <span className="right-space">
                    <EyeOutlined className="site-form-item-icon" />
                    <NumberLabel>{`${views || 0}`}</NumberLabel>
                  </span>
                </Tooltip>
                <Tooltip title="Likes">
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
