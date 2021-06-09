import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { Input, Tooltip, Typography, Table, Radio, Button } from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  BulbOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { StripeProductsContainer } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {} = props;
  const dataSource = [];
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Visible",
      dataIndex: "visible",
      key: "visible",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Edit",
      render: (value, instance) => (
        <Button onClick={() => console.log("Edit")}>Edit</Button>
      ),
    },
  ];

  // useEffect(() => {
  //   if (!fetchingPromptsSucess && !fetchingPrompts) fetchPrompts();
  // }, [fetchingPromptsSucess]);

  return (
    <StripeProductsContainer>
      <Title level={4}>Stripe Products</Title>
      <Table dataSource={dataSource} columns={columns} />
    </StripeProductsContainer>
  );
}

Ui.propTypes = {
  // tweetSuccess: PropTypes.bool,
  // embeddedTweet: PropTypes.object,
  // tweetError: PropTypes.string,
  // tweet: PropTypes.func,
};

export default Ui;
