import React, { useEffect, useState } from "react";
import {
  Input,
  Tooltip,
  Typography,
  Table,
  Radio,
  Button,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

import {
  StripeProductsContainer,
  StripeProductCreateContainer,
  SubmitButton,
} from "./styles";

const { Title } = Typography;

const productType = {
  one_time: "Single",
  recurring: "Subscription",
};

function Ui(props) {
  const {
    productsState,
    fetchStripeProducts,
    registerStripePrice,
    createStripePrice,
  } = props;
  const {
    stripeProductList,
    fetchingStripeProducts,
    finishedFetchingStripeProducts,
  } = productsState;

  const [stripeProduct, updateStripeProduct] = useState({
    name: undefined,
    unit_amount: undefined,
    type: undefined,
  });

  const normaliseStripeProduct = () => {
    return stripeProductList.map((stripeProduct) => ({
      key: stripeProduct.stripe_id,
      name: stripeProduct.name,
      stripeId: stripeProduct.stripe_id,
      type: productType[stripeProduct.type],
      price_type: stripeProduct.type,
      price: stripeProduct.price,
      registered: stripeProduct.registered,
    }));
  };

  const handleCreateStripe = () => {
    if (
      !stripeProduct.name ||
      !stripeProduct.unit_amount ||
      !stripeProduct.type
    ) {
      message.warn("Missing fields in submission");
      return;
    }
    createStripePrice(stripeProduct);
  };

  const dataSource = stripeProductList?.length ? normaliseStripeProduct() : [];

  useEffect(() => {
    if (!fetchingStripeProducts && !finishedFetchingStripeProducts) {
      fetchStripeProducts();
    }
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: (value, instance) => `${instance.key}-name`,
    },
    {
      title: "Stripe Id",
      dataIndex: "stripeId",
      key: "stripeId",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: (value, instance) => `${instance.key}-type`,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      key: (value, instance) => `${instance.key}-price`,
    },
    {
      key: (value, instance) => `${instance.key}-registered-${value}`,
      title: (
        <Tooltip title="Activate Stripe Price in Gday Punch">Register</Tooltip>
      ),
      render: (value, instance) => (
        <Tooltip
          title={
            instance.registered
              ? "Product already active"
              : "Activate Stripe Price in Gday Punch"
          }
        >
          <Button
            style={
              instance.registered
                ? { background: "#c8ffab", color: "green" }
                : null
            }
            disabled={instance.registered}
            onClick={() =>
              registerStripePrice({
                price_id: instance.stripeId,
                price_amount: instance.price,
                price_title: instance.name,
                price_type: instance.price_type,
              })
            }
          >
            {instance.registered ? "Active" : "Register"}
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <StripeProductsContainer>
      <Title level={4}>Create Stripe Product</Title>
      <StripeProductCreateContainer>
        <Input
          value={stripeProduct.name}
          onChange={(e) =>
            updateStripeProduct({ ...stripeProduct, name: e.target.value })
          }
          placeholder="Enter Product Name"
          prefix={<ShoppingOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Prompt description">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Input
          value={stripeProduct.unit_amount}
          onChange={(e) =>
            updateStripeProduct({
              ...stripeProduct,
              unit_amount: e.target.value,
            })
          }
          placeholder="Enter product price"
          prefix={<DollarOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Product price in AUD$(00.00)">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Radio.Group
          onChange={(e) =>
            updateStripeProduct({ ...stripeProduct, type: e.target.value })
          }
          value={stripeProduct.type}
        >
          <Radio value={"one_time"}>Single</Radio>
          <Radio value={"recurring"}>Subscription</Radio>
        </Radio.Group>
        <SubmitButton onClick={() => handleCreateStripe()}>Create</SubmitButton>
      </StripeProductCreateContainer>
      <Title level={4}>Stripe Products</Title>
      <Table dataSource={dataSource} columns={columns} />
    </StripeProductsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
