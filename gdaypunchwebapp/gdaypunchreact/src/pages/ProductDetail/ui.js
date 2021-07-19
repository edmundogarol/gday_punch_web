import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
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
} from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";

const productType = {
  1: "Paperback",
  2: "Digital",
  3: "Subscription",
};

function Ui(props) {
  const {
    viewingProductState,
    productList,
    fetchViewingProduct,
    setViewingProduct,
  } = props;
  const { product, fetchingViewingProduct, finishedFetchingViewingProduct } =
    viewingProductState;
  const { productId } = useParams();

  useEffect(() => {
    if (!fetchingViewingProduct && !finishedFetchingViewingProduct) {
      if (productId && !product.id) fetchViewingProduct(productId);
    }
  }, [fetchingViewingProduct, finishedFetchingViewingProduct]);

  useEffect(() => {
    if (
      product &&
      product.id &&
      productList.length &&
      productId &&
      productId !== product.id
    )
      setViewingProduct(
        productList.find((product) => product.id === parseInt(productId))
      );
  }, [product]);

  const fbShare = () => {
    const url =
      "https://www.facebook.com/sharer.php?display=popup&u=" +
      window.location.href;
    const options = "toolbar=0,status=0,resizable=1,width=626,height=436";
    window.open(url, "sharer", options);
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
              <h4>$A{product.price.toFixed(2)}</h4>
              <h4>{product.sku}</h4>
              <p>{product.description}</p>
              <div>
                <a className="fb-hover" onClick={() => fbShare()}>
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              </div>
              <div>
                <div>
                  <label>Author</label>
                  <p>{productType[product.product_type]}</p>
                  <label>Release Date</label>
                  <p>
                    {moment(product.manga_details.release_date).format("LL")}
                  </p>
                </div>
                <div></div>
              </div>
              <label>Quantity</label>
              <Select defaultValue={1}>
                {[...Array(10)].map((x, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
              <button>Add to Cart</button>
            </ProductDetailRightContainer>
          </ProductDetailContainer>
        </ProductContainer>
      )}
    </PageContainer>
  );
}

export default Ui;
