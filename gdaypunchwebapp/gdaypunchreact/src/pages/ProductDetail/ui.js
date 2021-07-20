import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import { Typography, Image, Select } from "antd";
import {} from "@ant-design/icons";
import moment from "moment";
const { Title } = Typography;
const { Option } = Select;

import {
  PageContainer,
  ProductContainer,
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
    updateCartItems,
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
    if (
      product &&
      Object.values(productList).length &&
      productId &&
      productId !== product.id
    )
      setViewingProduct(product.id);
  }, [product]);

  const fbShare = () => {
    const url =
      "https://www.facebook.com/sharer.php?display=popup&u=" +
      window.location.href;
    const options = "toolbar=0,status=0,resizable=1,width=626,height=436";
    window.open(url, "sharer", options);
  };

  const handleAddToCart = () => {
    updateCartItemQuantity(product.id, quantity, product.quantity);
  };

  return (
    <PageContainer>
      {product && product.id && (
        <ProductContainer>
          <ProductDetailContainer>
            <ProductDetailLeftContainer>
              <Image src={getGdayPunchStaticUrl(product.image)} />
            </ProductDetailLeftContainer>
            <ProductDetailRightContainer>
              <Title level={4}>{product.title}</Title>
              <PriceSkuContainer>
                <h4>$A{product.price.toFixed(2)}</h4>
                <SkuContainer>
                  <label>SKU:</label>
                  <h4>{product.sku}</h4>
                </SkuContainer>
              </PriceSkuContainer>
              <p>{product.description}</p>
              <SocialContainer>
                <a className="fb-hover" onClick={() => fbShare()}>
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a className="ig-hover" onClick={() => fbShare()}>
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a className="tw-hover" onClick={() => fbShare()}>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a className="yt-hover" onClick={() => fbShare()}>
                  <FontAwesomeIcon icon={faPinterest} />
                </a>
              </SocialContainer>
              <MoreDetailsContainer>
                <MoreDetailsColumn>
                  <LabelFieldContainer>
                    <label>Author</label>
                    <p>{product.manga_details.author}</p>
                  </LabelFieldContainer>
                  <LabelFieldContainer>
                    <label>Release Date</label>
                    <p>
                      {moment(product.manga_details.release_date).format("LL")}
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
              <QuantityAddCartContainer>
                <label>Quantity</label>
                <Select
                  defaultValue={1}
                  value={quantity}
                  onSelect={(val) => setQuantity(val)}
                >
                  {[...Array(10)].map((x, i) => (
                    <Option key={"product-qty-select-" + i + 1} value={i + 1}>
                      {i + 1}
                    </Option>
                  ))}
                </Select>
                <button onClick={() => handleAddToCart()}>Add to Cart</button>
              </QuantityAddCartContainer>
            </ProductDetailRightContainer>
          </ProductDetailContainer>
        </ProductContainer>
      )}
    </PageContainer>
  );
}

export default Ui;
