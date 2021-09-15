import React, { useEffect, useState } from "react";
import { Typography, Table, Modal } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";
import moment from "moment";

import { getGdayPunchStaticUrl } from "utils/utils";
import { OrdersContainer, OrderModal } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {
    ordersState: { orderList, fetching, finishedFetching },
    fetchOrders,
  } = props;
  const [orderOpen, updateOrderOpen] = useState(undefined);

  useEffect(() => {
    if (!fetching && !finishedFetching) {
      fetchOrders();
    }
  }, [fetching, finishedFetching]);

  const renderStatusIcons = {
    pending: PendingIcon,
    purchased: PurchasedIcon,
    shipped: ShippedIcon,
    declined: DeclinedIcon,
    refunded: RefundedIcon,
    partially_refunded: RefundedIcon,
  };

  const columns = [
    {
      title: "Order No.",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Date Ordered",
      dataIndex: "readable_date",
      key: "readable_date",
      className: "center",
      render: (readable_date) => {
        return (
          <>
            <p>{readable_date.date}</p>
            <p>{readable_date.time}</p>
          </>
        );
      },
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
      className: "center",
      render: (products) => {
        const firstProduct = products[0];
        const items = (
          <p>{`${firstProduct.qty} x ${firstProduct.product.title}`}</p>
        );

        let more = null;

        if (products.length > 1) {
          more = (
            <p>{`${products.length - 1} more item${
              products.length - 1 > 1 ? "s" : ""
            }`}</p>
          );
        }

        return (
          <>
            {items}
            {more}
          </>
        );
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
        const StatusIcon = renderStatusIcons[status];

        return (
          <span className={status}>
            <StatusIcon /> {status}
          </span>
        );
      },
    },
  ];

  const mobileColumns = [
    {
      title: "Customer/Amount/Status",
      dataIndex: "customer",
      key: "customer-amount-status",
      className: "left",
      render: (val, instance) => {
        const StatusIcon = renderStatusIcons[instance.status];

        return (
          <div className="detail-3-column-compressed">
            <p>{`${instance.first_name} ${instance.last_name}`}</p>
            <p>{`A$${instance.amount.toFixed(2)}`}</p>
            <span className={instance.status}>
              <StatusIcon /> {instance.status}
            </span>
          </div>
        );
      },
    },
    {
      title: "Items",
      dataIndex: "product_qty_details",
      key: "product_qty_details",
      className: "center",
      render: (products) => {
        const firstProduct = products[0];
        const items = (
          <p>{`${firstProduct.qty} x ${firstProduct.product.title}`}</p>
        );
        let more = null;

        if (products.length > 1) {
          more = (
            <p>{`${products.length - 1} more item${
              products.length - 1 > 1 ? "s" : ""
            }`}</p>
          );
        }

        return (
          <>
            {items}
            {more}
          </>
        );
      },
    },
    {
      title: "Number/Date/Type",
      dataIndex: "number",
      key: "customer-amount-status",
      className: "right",
      render: (val, instance) => {
        return (
          <div className="detail-3-column-compressed">
            <p>{`#${instance.number}`}</p>
            <p>{instance.readable_date.date}</p>
            <p>{instance.fulfillment_type}</p>
          </div>
        );
      },
    },
  ];

  const productColumns = [
    {
      title: "Item",
      dataIndex: "product",
      key: "order-item",
      render: (product) => {
        return (
          <div className="item-image-title">
            <img src={getGdayPunchStaticUrl(product.image)} />
            <p>{product.title}</p>
          </div>
        );
      },
    },
    {
      title: "SKU",
      dataIndex: "product",
      key: "order-sku",
      render: (product) => product.sku,
    },
    {
      title: "Price",
      dataIndex: "product",
      key: "order-price",
      render: (product) => `A$${product.price}`,
    },
    {
      title: "Price",
      dataIndex: "qty",
      key: "order-qty",
    },
    {
      title: "Total",
      dataIndex: "product",
      key: "order-total",
      render: (product, instance) => `A$${product.price * instance.qty}`,
    },
  ];

  const handleOrderOpen = (order, rowIndex) => {
    return {
      onClick: (event) => {
        updateOrderOpen(order);
      },
    };
  };

  const orderDetailsModal = (order) => {
    const StatusIcon = renderStatusIcons[order.status];

    return (
      <OrderModal
        title={
          <>
            {`Order #${order.number}`}
            <span className={order.status + " status"}>
              <StatusIcon /> {order.status}
            </span>
          </>
        }
        visible={orderOpen}
        onCancel={() => updateOrderOpen(undefined)}
        cancelText="Close"
        okButtonProps={{ style: { display: "none" } }}
      >
        <Table
          rowKey="id"
          columns={productColumns}
          dataSource={order.product_qty_details}
          pagination={false}
        />
      </OrderModal>
    );
  };

  const dataSource = orderList.map((order, idx) => ({
    key: idx + order.number,
    ...order,
  }));

  return (
    <OrdersContainer>
      <Title level={4}>Orders</Title>
      {orderOpen && orderDetailsModal(orderOpen)}
      <Table
        onRow={handleOrderOpen}
        className="desktop"
        dataSource={dataSource}
        columns={columns}
      />
      <Table
        className="mobile"
        onRow={handleOrderOpen}
        dataSource={dataSource}
        showHeader={false}
        columns={mobileColumns}
      />
    </OrdersContainer>
  );
}

Ui.propTypes = {};

export default Ui;
