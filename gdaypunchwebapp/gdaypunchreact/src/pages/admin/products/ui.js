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
  1: "Physical",
  2: "Digital",
  3: "Subscription",
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
  const [newProduct, updateNewProduct] = useState({
    title: undefined,
    description: undefined,
    image: undefined,
    sale_price: undefined,
    visible: false,
    stock: undefined,
    product_type: 1,
    price: 0,
    stripe_prices: productPrices,
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
    let createProductPrice = 0;
    productPrices.map((price) => {
      createProductPrice += stripePrices.find(
        (e) => e.id === price
      ).price_amount;
    });
    updateNewProduct({
      ...newProduct,
      price: createProductPrice,
      stripe_prices: productPrices,
    });
  }, [productPrices]);

  const handleCreate = () => createAdminProduct(newProduct);

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onChange = (nextTargetKeys, direction, moveKeys) => {
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
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Visible",
      dataIndex: "visible",
      key: "visible",
      render: (value) => (value ? "Visible" : "Hidden"),
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
      title: "Edit",
      render: (value, instance) => (
        <>
          <Tooltip title="Edit Product">
            <Button
              onClick={() => {
                setEditProduct(instance.id);
                props.history.push(`/admin/product-detail/${instance.id}/`);
              }}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Copy Product">
            <Button
              onClick={() => {
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
              <Button>
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

  return (
    <ProductsContainer>
      <Title level={4}>Create Product</Title>
      <ProductCreateContainer>
        <ProductLeftContainer>
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
          <Radio.Group
            onChange={(e) =>
              updateNewProduct({ ...newProduct, product_type: e.target.value })
            }
            value={newProduct.product_type}
          >
            <Radio value={1}>Physical</Radio>
            <Radio value={2}>Digital</Radio>
            <Radio value={3}>Subscription</Radio>
          </Radio.Group>
          <Checkbox
            onChange={(e) =>
              updateNewProduct({ ...newProduct, visible: e.target.checked })
            }
          >
            Visible
          </Checkbox>
          <SubmitButton onClick={() => handleCreate()}>Create</SubmitButton>
        </ProductLeftContainer>
        <ProductRightContainer>
          <ProductTempImageFilenameInput
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
          <Title level={4}>{`Price: $${newProduct.price}`}</Title>
        </ProductRightContainer>
      </ProductCreateContainer>
      <Title level={4}>
        {`Products | `}
        <NavLink to="/admin/stripe-products">Stripe Products</NavLink>
      </Title>
      <Table dataSource={dataSource} columns={columns} />
    </ProductsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
