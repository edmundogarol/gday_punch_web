import React, { useEffect, useState } from "react";
import { Typography, Table } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";
import moment from "moment";

import { OrdersContainer } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {
    ordersState: { orderList, fetching, finishedFetching },
    fetchOrders,
  } = props;

  useEffect(() => {
    if (!fetching && !finishedFetching) {
      fetchOrders();
    }
  }, [fetching, finishedFetching]);

  const columns = [
    {
      title: "Order No.",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Date Ordered",
      dataIndex: "date_created",
      key: "date_created",
      render: (date_created) => moment(date_created).format("llll"),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (val, instance) => `${instance.first_name} ${instance.last_name}`,
    },
    {
      title: "Items",
      dataIndex: "product_qty_details",
      key: "product_qty_details",
      render: (products) => {
        const firstProduct = products[0];
        let itemsString = `${firstProduct.qty} x ${firstProduct.product}`;

        if (products.length > 1) {
          itemsString = itemsString.concat(
            `\n ${products.length - 1} more item${
              products.length - 1 > 1 ? "s" : ""
            }`
          );
        }

        return itemsString;
      },
    },
    {
      title: "Total",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `A$${amount.toFixed(2)}`,
    },
    {
      title: "Type",
      dataIndex: "fulfillment_type",
      key: "fulfillment_type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, instance) => {
        const renderIcons = {
          pending: PendingIcon,
          purchased: PurchasedIcon,
          shipped: ShippedIcon,
          declined: DeclinedIcon,
          refunded: RefundedIcon,
          partially_refunded: RefundedIcon,
        };

        const StatusIcon = renderIcons[status];

        return (
          <span className={status}>
            <StatusIcon /> {status}
          </span>
        );
      },
    },
  ];
  const dataSource = orderList.map((order, idx) => ({
    key: idx + order.number,
    ...order,
  }));

  return (
    <OrdersContainer>
      <Title level={4}>Orders</Title>
      <Table dataSource={dataSource} columns={columns} />
    </OrdersContainer>
  );
}

Ui.propTypes = {};

export default Ui;
