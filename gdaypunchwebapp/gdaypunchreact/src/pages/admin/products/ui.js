import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Input,
  Tooltip,
  Typography,
  Table,
  Radio,
  Button,
  Checkbox,
  Popconfirm,
  Transfer,
  Image,
} from "antd";
import {
  InfoCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  StockOutlined,
  DeleteOutlined,
  CopyOutlined,
  FileImageOutlined,
} from "@ant-design/icons";

import {
  FieldLabel,
  ProductsContainer,
  ProductCreateContainer,
  ProductLeftContainer,
  ProductRightContainer,
  SubmitButton,
  ProductTempImageFilenameInput,
} from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";

const { TextArea } = Input;
const { Title } = Typography;

const productType = {
  physical: "Physical",
  digital: "Digital",
  subscription: "Subscription",
  mag_subscription: "Magazine Subscription",
  dig_subscription: "Digital Subscription",
};

function Ui(props) {
  const {
    productsState,
    fetchProducts,
    createAdminProduct,
    deleteAdminProduct,
    setEditProduct,
    fetchStripePrices,
  } = props;
  const {
    stripePrices,
    stripePriceIds,
    adminProductList,
    fetchingAdminProducts,
    finishedFetchingAdminProducts,
    fetchingStripePrices,
    finishedFetchingStripePrices,
  } = productsState;

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [productPrices, updateProductPrices] = useState([]);
  const [transferStripePrices, updateTransferStripePrices] = useState([]);
  const [assigningCustomPrice, updateAssigningCustomPrice] = useState(false);
  const [newProduct, updateNewProduct] = useState({
    title: undefined,
    description: undefined,
    image: undefined,
    active_price: undefined,
    sale_price: 0,
    visible: false,
    stock: undefined,
    sku: undefined,
    product_type: "physical",
    price: 0,
    stripe_prices: productPrices,
    charge_type: "per_release",
    month_interval: undefined,
  });

  useEffect(() => {
    if (!fetchingAdminProducts && !finishedFetchingAdminProducts) {
      fetchProducts();
    }
  }, [fetchingAdminProducts, finishedFetchingAdminProducts]);

  useEffect(() => {
    if (!fetchingStripePrices && !finishedFetchingStripePrices) {
      fetchStripePrices();
    }
  }, [fetchingStripePrices, finishedFetchingStripePrices]);

  useEffect(() => {
    updateTransferStripePrices(stripePriceIds);
  }, [stripePriceIds]);

  useEffect(() => {
    if (assigningCustomPrice) {
      updateProductPrices([]);
      updateTransferStripePrices(stripePriceIds);
    }
  }, [assigningCustomPrice, newProduct]);

  useEffect(() => {
    if (!assigningCustomPrice) {
      let createProductPrice = 0;
      productPrices.map((price) => {
        createProductPrice += stripePrices.find(
          (e) => e.id === price
        ).price_amount;
      });
      updateNewProduct({
        ...newProduct,
        active_price: createProductPrice,
        stripe_prices: productPrices,
      });
    }
  }, [productPrices, assigningCustomPrice]);

  const handleCreate = () => createAdminProduct(newProduct);

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

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) =>
        value ? <Image width={40} src={getGdayPunchStaticUrl(value)} /> : "-",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "active_price",
      key: "active_price",
      render: (value, product) => (
        <>
          {`$${value}`}
          <span className="interval">
            {product.product_type.includes("subscription")
              ? `/${
                  product.subscription_interval < 2
                    ? "m"
                    : `${product.subscription_interval}m`
                }`
              : null}
          </span>
        </>
      ),
    },
    {
      title: "Visible",
      dataIndex: "visible",
      key: "visible",
      render: (value) => (value ? "Visible" : "Hidden"),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Type",
      dataIndex: "product_type",
      key: "product_type",
      render: (value) => productType[value],
    },
    {
      title: "Actions",
      render: (value, instance) => (
        <>
          <Tooltip title="Copy Product">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setEditProduct(instance.id);
                props.history.push(
                  `/admin/product-detail/${instance.id}-copy/`
                );
              }}
            >
              <CopyOutlined className="site-form-item-icon" />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this Product?"
            onConfirm={() => deleteAdminProduct(instance.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Product">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <DeleteOutlined className="site-form-item-icon" />
              </Button>
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ];

  const dataSource = adminProductList.map((product) => ({
    key: product.title,
    ...product,
  }));

  const stripePricesForTransfer = stripePrices.map((price) => ({
    key: price.id,
    title: `$${price.price_amount} ${price.price_title}`,
  }));

  const handleProductOpen = (product) => {
    return {
      onClick: (event) => {
        setEditProduct(product.id);
        props.history.push(`/admin/product-detail/${product.id}/`);
      },
    };
  };

  return (
    <ProductsContainer>
      <Title level={4}>Create Product</Title>
      <ProductCreateContainer>
        <ProductLeftContainer>
          <FieldLabel>Title</FieldLabel>
          <Input
            value={newProduct.title}
            onChange={(e) =>
              updateNewProduct({ ...newProduct, title: e.target.value })
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
            rows={5}
            value={newProduct.description}
            onChange={(e) =>
              updateNewProduct({ ...newProduct, description: e.target.value })
            }
            placeholder="Enter Product Description"
            maxLength={1000}
            showCount
          />
          <FieldLabel>Visibility</FieldLabel>
          <Checkbox
            onChange={(e) =>
              updateNewProduct({ ...newProduct, visible: e.target.checked })
            }
          >
            Visible
          </Checkbox>
          <FieldLabel>SKU</FieldLabel>
          <Input
            value={newProduct.sku}
            onChange={(e) =>
              updateNewProduct({ ...newProduct, sku: e.target.value })
            }
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
            value={newProduct.stock}
            onChange={(e) =>
              updateNewProduct({ ...newProduct, stock: e.target.value })
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
              updateNewProduct({ ...newProduct, product_type: e.target.value })
            }
            value={newProduct.product_type}
          >
            <Radio value={"physical"}>Physical</Radio>
            <Radio value={"digital"}>Digital</Radio>
            <Radio value={"subscription"}>Subscription</Radio>
          </Radio.Group>
          <FieldLabel>Admin Product Type</FieldLabel>
          <Radio.Group
            onChange={(e) =>
              updateNewProduct({ ...newProduct, product_type: e.target.value })
            }
            value={newProduct.product_type}
          >
            <Radio value={"mag_subscription"}>
              Magazine Issues Subscription
            </Radio>
            <Radio value={"dig_subscription"}>
              Digital Issues Subscription
            </Radio>
          </Radio.Group>
          {newProduct.product_type === "subscription" ? (
            <>
              <FieldLabel>Interval</FieldLabel>
              <Input
                value={newProduct.month_interval}
                onChange={(e) =>
                  updateNewProduct({
                    ...newProduct,
                    month_interval: e.target.value,
                  })
                }
                placeholder="Enter subscription interval in months"
                prefix={<StockOutlined className="site-form-item-icon" />}
                suffix={
                  <Tooltip title="Monthly interval">
                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                  </Tooltip>
                }
              />
            </>
          ) : null}
        </ProductLeftContainer>
        <ProductRightContainer>
          <FieldLabel>Image Filename</FieldLabel>
          <Input
            value={newProduct.image}
            onChange={(e) =>
              updateNewProduct({ ...newProduct, image: e.target.value })
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
            value={newProduct.sale_price}
            onChange={(e) =>
              updateNewProduct({ ...newProduct, sale_price: e.target.value })
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
          <Transfer
            dataSource={stripePricesForTransfer}
            titles={["Product Prices", "Stripe Prices"]}
            targetKeys={transferStripePrices}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            render={(item) => item.title}
            listStyle={{ direction: "left", width: "200px" }}
            showSelectAll={false}
          />
          <FieldLabel>Price</FieldLabel>
          <Input
            value={newProduct.active_price}
            onChange={(e) => {
              updateNewProduct({
                ...newProduct,
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
          <SubmitButton onClick={() => handleCreate()}>Create</SubmitButton>
        </ProductRightContainer>
      </ProductCreateContainer>
      <Title level={4}>
        {`Products | `}
        <NavLink to="/admin/stripe-products">Stripe Products</NavLink>
      </Title>
      <Table
        onRow={handleProductOpen}
        dataSource={dataSource}
        columns={columns}
      />
    </ProductsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
