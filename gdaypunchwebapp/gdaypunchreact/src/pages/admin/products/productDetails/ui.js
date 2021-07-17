import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Input, Tooltip, Typography, Radio, Checkbox, Transfer } from "antd";
import {
  InfoCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  StockOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { isEqual } from "lodash";

import {
  FieldLabel,
  ProductsContainer,
  ProductDetailContainer,
  SubmitButton,
  ProductDetailLeftContainer,
  ProductDetailRightContainer,
  ProductImage,
  ProductPriceTransfer,
} from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";

const { TextArea } = Input;
const { Title } = Typography;

function Ui(props) {
  const {
    productsState,
    fetchStripePrices,
    currentProduct,
    updateAdminProduct,
    createAdminProduct,
    history,
  } = props;
  const {
    stripePrices,
    stripePriceIds,
    fetchingStripePrices,
    finishedFetchingStripePrices,
  } = productsState;
  const { productId } = useParams();
  const creatingProduct = productId && productId.includes("copy");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [productPrices, updateProductPrices] = useState(
    currentProduct ? currentProduct.stripe_prices : []
  );
  const [transferStripePrices, updateTransferStripePrices] = useState([]);
  const [assigningCustomPrice, updateAssigningCustomPrice] = useState(false);

  const [product, updateProduct] = useState({
    ...currentProduct,
    title: `${currentProduct.title}${creatingProduct ? " COPY" : ""}`,
  });

  useEffect(() => {
    if (!assigningCustomPrice) {
      let currentProductPrice = 0;
      productPrices.map((price) => {
        currentProductPrice += stripePrices.find(
          (e) => e.id === price
        ).price_amount;
      });
      updateProduct({
        ...product,
        active_price: currentProductPrice,
        stripe_prices: productPrices,
      });
    }
  }, [productPrices]);

  useEffect(() => {
    if (!fetchingStripePrices && !finishedFetchingStripePrices) {
      fetchStripePrices();
    }
  }, [fetchingStripePrices, finishedFetchingStripePrices]);

  useEffect(() => {
    const currentProductPriceIds = currentProduct.stripe_prices;

    updateTransferStripePrices(
      stripePriceIds.filter((id) => !currentProductPriceIds.includes(id))
    );
  }, [stripePriceIds]);

  useEffect(() => {
    if (assigningCustomPrice) {
      updateProductPrices([]);
      updateTransferStripePrices(stripePriceIds);
    }
  }, [assigningCustomPrice, currentProduct]);

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    updateAssigningCustomPrice(false);

    if (direction === "left") {
      updateProductPrices([...productPrices, ...moveKeys]);
    } else {
      const newPrices = productPrices.filter((elem) => {
        return moveKeys.indexOf(elem) < 0;
      });
      updateProductPrices(newPrices);
    }
    updateTransferStripePrices(nextTargetKeys);
  };

  const handleUpdate = () => updateAdminProduct(product, history);

  const handleCreate = () => createAdminProduct(product, history);

  const stripePricesForTransfer = stripePrices.map((price) => ({
    key: price.id,
    title: `$${price.price_amount} ${price.price_title}`,
  }));

  return (
    <ProductsContainer>
      <Title level={4}>
        {creatingProduct ? "Create Product" : "Edit Product"}
      </Title>
      <ProductDetailContainer>
        <ProductDetailLeftContainer>
          <FieldLabel>Title</FieldLabel>
          <Input
            value={product.title}
            onChange={(e) =>
              updateProduct({ ...product, title: e.target.value })
            }
            placeholder="Enter Product Title"
            prefix={<ShoppingOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Product Title">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <FieldLabel>Description</FieldLabel>
          <TextArea
            rows={10}
            showCount
            maxLength={1000}
            value={product.description}
            onChange={(e) =>
              updateProduct({ ...product, description: e.target.value })
            }
            placeholder="Enter Product Description"
          />
          <FieldLabel>Visibility</FieldLabel>
          <Checkbox
            checked={product.visible}
            onChange={(e) =>
              updateProduct({ ...product, visible: e.target.checked })
            }
          >
            Visible
          </Checkbox>
          <FieldLabel>SKU</FieldLabel>
          <Input
            value={product.sku}
            onChange={(e) => updateProduct({ ...product, sku: e.target.value })}
            placeholder="Enter product SKU"
            prefix={<StockOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Product SKU">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <FieldLabel>Stock</FieldLabel>
          <Input
            value={product.stock}
            onChange={(e) =>
              updateProduct({ ...product, stock: e.target.value })
            }
            placeholder="Enter product stock"
            prefix={<StockOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Product stock">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <FieldLabel>Product Type</FieldLabel>
          <Radio.Group
            onChange={(e) =>
              updateProduct({ ...product, product_type: e.target.value })
            }
            value={product.product_type}
          >
            <Radio value={1}>Physical</Radio>
            <Radio value={2}>Digital</Radio>
            <Radio value={3}>Subscription</Radio>
          </Radio.Group>
        </ProductDetailLeftContainer>
        <ProductDetailRightContainer>
          <ProductImage src={getGdayPunchStaticUrl(product.image)} />
          <FieldLabel>Image Filename</FieldLabel>
          <Input
            value={product.image}
            onChange={(e) =>
              updateProduct({ ...product, image: e.target.value })
            }
            placeholder="Enter product image filename"
            prefix={<FileImageOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Temporary product image filename applier">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <FieldLabel>Sale Price</FieldLabel>
          <Input
            value={product.sale_price}
            onChange={(e) =>
              updateProduct({ ...product, sale_price: e.target.value })
            }
            placeholder="Enter product sale price"
            prefix={<DollarOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Product sale price in AUD$(00.00)">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <FieldLabel>Stripe Prices</FieldLabel>
          <ProductPriceTransfer
            dataSource={stripePricesForTransfer}
            titles={["Product Prices", "Stripe Prices"]}
            targetKeys={transferStripePrices}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            render={(item) => item.title}
            listStyle={{ direction: "left", width: "250px" }}
            showSelectAll={false}
          />
          <FieldLabel>Price</FieldLabel>
          <Input
            value={product.active_price}
            onChange={(e) => {
              updateProduct({
                ...product,
                active_price: e.target.value,
              });
              updateAssigningCustomPrice(true);
            }}
            placeholder="Enter product price"
            prefix={<DollarOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Product price">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <SubmitButton
            disabled={isEqual(currentProduct, product)}
            onClick={() => (creatingProduct ? handleCreate() : handleUpdate())}
          >
            {creatingProduct ? "Create" : "Update"}
          </SubmitButton>
        </ProductDetailRightContainer>
      </ProductDetailContainer>
    </ProductsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
