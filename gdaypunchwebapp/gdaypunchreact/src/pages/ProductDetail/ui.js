import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommentOutlined } from "@ant-design/icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import { Typography, Image, Select, Spin } from "antd";
import moment from "moment";
const { Title } = Typography;
const { Option } = Select;

import {
  PageContainer,
  ProductContainer,
  CategoryLinks,
  ProductDetailContainer,
  ProductDetailLeftContainer,
  ProductDetailRightContainer,
  PriceSkuContainer,
  SkuContainer,
  MoreDetailsContainer,
  MoreDetailsColumn,
  LabelFieldContainer,
  QuantityAddCartContainer,
  SocialContainer,
  TitleInteractionButtonsContainer,
  LikeCommentConainer,
  NumberLabel,
  InteractionContainer,
  InteractionButton,
} from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";

const productType = {
  1: "Paperback",
  2: "Digital",
  3: "Subscription",
};

const ageRating = {
  all_ages: "All Ages",
  teens: "Teens",
  young_adults: "Young Adults",
  adults: "Adults",
};

function Ui(props) {
  const {
    productState,
    fetchViewingProduct,
    setViewingProduct,
    updateCartItemQuantity,
  } = props;
  const {
    productList,
    viewingProduct,
    fetchingViewingProduct,
    finishedFetchingViewingProduct,
  } = productState;
  const product = productList[viewingProduct];
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();

  useEffect(() => {
    if (!fetchingViewingProduct && !finishedFetchingViewingProduct) {
      if (productId && !product) {
        setViewingProduct(productId);
        if (!productList[productId]) fetchViewingProduct(productId);
      }
    }
  }, [fetchingViewingProduct, finishedFetchingViewingProduct]);

  useEffect(() => {
    if (product && productId !== product.id) setViewingProduct(productId);
  }, [product]);

  const fbShare = () => {
    const url =
      "https://www.facebook.com/sharer.php?display=popup&u=" +
      window.location.href;
    const options = "toolbar=0,status=0,resizable=1,width=626,height=436";
    window.open(url, "sharer", options);
  };

  const twShare = () => {
    const url =
      "https://twitter.com/intent/tweet?display=popup&url=" +
      window.location.href +
      "&text=" +
      product.title.replace("#", "%23");
    const options = "toolbar=0,status=0,resizable=1,width=626,height=436";
    window.open(url, "sharer", options);
  };

  const pnShare = () => {
    const url =
      "https://www.pinterest.com/pin/create/button/?url=" +
      window.location.href +
      "&media=" +
      getGdayPunchStaticUrl(product.image) +
      "&description=" +
      product.title.replace("#", "%23");
    const options = "toolbar=0,status=0,resizable=1,width=626,height=436";
    window.open(url, "sharer", options);
  };

  const handleAddToCart = () => {
    updateCartItemQuantity(product.id, quantity, product.quantity);
  };

  const handleReadManga = () => {
    props.history.push(`/manga/${product.manga_details.id}`);
  };

  const freeProduct = product && product.active_price === 0;

  return (
    <PageContainer>
      <ProductContainer>
        {product && product.id ? (
          <ProductDetailContainer>
            <ProductDetailLeftContainer>
              <CategoryLinks>
                <NavLink to="/shop/#magazines">
                  <p>Magazines</p>
                </NavLink>
                <span>{">"}</span>
                <p>{product.title}</p>
              </CategoryLinks>
              <Image src={getGdayPunchStaticUrl(product.image)} />
            </ProductDetailLeftContainer>
            <ProductDetailRightContainer>
              <TitleInteractionButtonsContainer>
                <Title level={4}>{product.title}</Title>
                <LikeCommentConainer>
                  <InteractionButton>
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={
                        product.manga_details.user_likes
                          ? { color: "red" }
                          : null
                      }
                    />
                    <NumberLabel>{`${
                      product.manga_details.likes || 0
                    }`}</NumberLabel>
                  </InteractionButton>
                  <InteractionContainer>
                    <InteractionButton>
                      <CommentOutlined className="site-form-item-icon" />
                    </InteractionButton>
                    <NumberLabel>{`${
                      product.manga_details.comments || 0
                    }`}</NumberLabel>
                  </InteractionContainer>
                </LikeCommentConainer>
              </TitleInteractionButtonsContainer>
              <PriceSkuContainer>
                {freeProduct ? null : (
                  <h4>
                    {freeProduct
                      ? "Free"
                      : `A$${product.active_price.toFixed(2)}`}
                  </h4>
                )}
                {product.sku && (
                  <SkuContainer>
                    <label>SKU:</label>
                    <h4>{product.sku}</h4>
                  </SkuContainer>
                )}
              </PriceSkuContainer>
              <p>{product.description}</p>
              <SocialContainer>
                <a className="fb-hover" onClick={() => fbShare()}>
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a className="tw-hover" onClick={() => twShare()}>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a className="yt-hover" onClick={() => pnShare()}>
                  <FontAwesomeIcon icon={faPinterest} />
                </a>
              </SocialContainer>
              {product.manga_details.author && (
                <MoreDetailsContainer>
                  <MoreDetailsColumn>
                    <LabelFieldContainer>
                      <label>Author</label>
                      <p>{product.manga_details.author}</p>
                    </LabelFieldContainer>
                    <LabelFieldContainer>
                      <label>Release Date</label>
                      <p>
                        {product.manga_details.release_date
                          ? moment(product.manga_details.release_date).format(
                              "LL"
                            )
                          : null}
                      </p>
                    </LabelFieldContainer>
                  </MoreDetailsColumn>
                  <MoreDetailsColumn>
                    <LabelFieldContainer>
                      <label>Type</label>
                      <p>{productType[product.product_type]}</p>
                    </LabelFieldContainer>
                    <LabelFieldContainer>
                      <label>Age Range</label>
                      <p>{ageRating[product.manga_details.age_rating]}</p>
                    </LabelFieldContainer>
                  </MoreDetailsColumn>
                </MoreDetailsContainer>
              )}
              <QuantityAddCartContainer>
                {freeProduct ? null : (
                  <>
                    <label>Quantity</label>
                    <Select
                      defaultValue={1}
                      value={quantity}
                      onSelect={(val) => setQuantity(val)}
                    >
                      {[...Array(10)].map((x, i) => (
                        <Option
                          key={"product-qty-select-" + i + 1}
                          value={i + 1}
                        >
                          {i + 1}
                        </Option>
                      ))}
                    </Select>
                  </>
                )}
                <button
                  onClick={() =>
                    freeProduct ? handleReadManga() : handleAddToCart()
                  }
                >
                  {freeProduct ? "Read" : "Add to Cart"}
                </button>
              </QuantityAddCartContainer>
            </ProductDetailRightContainer>
          </ProductDetailContainer>
        ) : (
          fetchingViewingProduct && <Spin />
        )}
      </ProductContainer>
    </PageContainer>
  );
}

export default Ui;
