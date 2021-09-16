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
import {
  OrdersContainer,
  OrderModal,
  ProductTotalsContainer,
  AddressContactField,
  AddressBillingContainer,
  LeftContainer,
  RightContainer,
} from "./styles";

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
      render: (product) => `A$${product.price.toFixed(2)}`,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "order-qty",
    },
    {
      title: "Total",
      dataIndex: "product",
      key: "order-total",
      className: "total",
      render: (product, instance) =>
        `A$${(product.price * instance.qty).toFixed(2)}`,
    },
  ];

  const mobileProductColumns = [
    {
      title: "Item",
      dataIndex: "product",
      key: "order-item",
      render: (product, instance) => {
        const StatusIcon = renderStatusIcons[instance.status];

        return (
          <div className="item-image-title">
            <img src={getGdayPunchStaticUrl(product.image)} />
            <div className="title-status-qty">
              <p>{product.title}</p>
              <span className={instance.status + " status"}>
                <StatusIcon /> {instance.status} {`(${instance.qty})`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "product",
      key: "order-total",
      className: "total",
      render: (product, instance) =>
        `A$${(product.price * instance.qty).toFixed(2)}`,
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
        width="80%"
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
          className="desktop"
          columns={productColumns}
          dataSource={order.product_qty_details}
          pagination={false}
        />
        <Table
          rowKey="id"
          className="mobile"
          columns={mobileProductColumns}
          dataSource={order.product_qty_details.map((product) => ({
            ...product,
            status: order.status,
          }))}
          pagination={false}
        />
        <ProductTotalsContainer>
          <div>
            Subtotal <span>{`A$${order.products_total_price.toFixed(2)}`}</span>
          </div>
          <div>
            Shipping
            <span>{`A$${order.country === "AU" ? "0.00" : "13.00"}`}</span>
          </div>
          {order.coupon && (
            <div>
              {`Discount [Coupon: ${order.coupon_details.description}]`}
              <span>{`- A$${order.coupon_details.discount_amount}`}</span>
            </div>
          )}
          <div>
            Tax (included in item prices): [GST]
            <span>{`A$${order.tax.toFixed(2)}`}</span>
          </div>
          <div>
            Total:
            <span>{`A$${order.amount.toFixed(2)}`}</span>
          </div>
        </ProductTotalsContainer>
        <AddressBillingContainer>
          <LeftContainer>
            <AddressContactField>
              <h4>Fulfillment details</h4>
              <div>
                <p>{`${order.first_name} ${order.last_name}`}</p>
                <p>{`${order.address_line_1} ${order.address_line_2}`}</p>
                <p>{`${order.city} ${order.state}, ${order.postcode}`}</p>
                <p>{`${order.country}`}</p>
              </div>
            </AddressContactField>
            <AddressContactField>
              <h4>Contact Information</h4>
              <div>
                <p>{`Phone: ${order.phone_number}`}</p>
                <p>{`Email: ${order.email}`}</p>
              </div>
            </AddressContactField>
          </LeftContainer>
          <RightContainer>
            <AddressContactField>
              <h4>Billing details</h4>
              <div>
                <p>{`CC ending in ${order.last_four} [exp. ${order.exp_month}/${order.exp_year}]`}</p>
              </div>
            </AddressContactField>
            <AddressContactField>
              <h4>Billing Address</h4>
              {order.billing_same_address ? (
                <div>
                  <p>{`${order.first_name} ${order.last_name}`}</p>
                  <p>{`${order.address_line_1} ${order.address_line_2}`}</p>
                  <p>{`${order.city} ${order.state}, ${order.postcode}`}</p>
                  <p>{`${order.country}`}</p>
                </div>
              ) : (
                <div>
                  <p>{`${order.billing_first_name} ${order.billing_last_name}`}</p>
                  <p>{`${order.billing_address_line_1} ${order.billing_address_line_2}`}</p>
                  <p>{`${order.billing_city} ${order.billing_state}, ${order.billing_postcode}`}</p>
                  <p>{`${order.billing_country}`}</p>
                </div>
              )}
            </AddressContactField>
            <AddressContactField>
              <h4>Contact Information</h4>
              {order.billing_same_address ? (
                <div>
                  <p>{`Phone: ${order.phone_number}`}</p>
                  <p>{`Email: ${order.email}`}</p>
                </div>
              ) : (
                <div>
                  <p>{`Phone: ${order.billing_number}`}</p>
                  <p>{`Email: ${order.billing_email}`}</p>
                </div>
              )}
            </AddressContactField>
          </RightContainer>
        </AddressBillingContainer>
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
