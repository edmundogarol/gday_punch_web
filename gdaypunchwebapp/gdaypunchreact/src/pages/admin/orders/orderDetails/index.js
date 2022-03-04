import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Modal, Button, Input, Alert } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { getGdayPunchStaticUrl, getSellerFee } from "utils/utils";
import {
  OrderModal,
  ProductTotalsContainer,
  AddressContactField,
  AddressBillingContainer,
  LeftContainer,
  RightContainer,
  OrderStatuses,
  ModalTitle,
  TitleStatus,
  ModalItemSummary,
  StatusButtons,
} from "./styles";

const { confirm } = Modal;
const { TextArea } = Input;

function OrderDetails(props) {
  const {
    selectOrderState,
    setSelectedOrder,
    updateOrderStatus,
    updateStatusReason,
    updatePartialRefund,
    accountSeller,
    customerId,
  } = props;
  const { orderList, selected, reason, partial_refund } =
    useSelector(selectOrderState);
  const order = orderList[selected];

  const dispatch = useDispatch();

  const markShipped = (orderId, products) => {
    confirm({
      title: "Mark this order as shipped?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <ModalItemSummary>
          {"Confirm shipment of all shippable items included in order."}
          <div>
            {products.map((product) => (
              <p key={product.id}>{`- ${product.title} x${product.qty}`}</p>
            ))}
          </div>
          <div>
            {"Provide any notes for shipment."}
            <div>
              <TextArea
                rows={10}
                showCount
                maxLength={500}
                value={reason}
                onChange={(e) => dispatch(updateStatusReason(e.target.value))}
                placeholder="Enter shipment notes."
              />
            </div>
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        dispatch(updateOrderStatus(orderId, "shipped", customerId));
      },
      onCancel() {
        dispatch(updateStatusReason(undefined));
      },
    });
  };

  const decline = () => {
    confirm({
      title: "Decline this order?",
      icon: <ExclamationCircleOutlined />,
      okText: "Decline",
      okType: "danger",
      content: (
        <ModalItemSummary>
          {"Provide description for order decline reasons."}
          <div>
            <TextArea
              rows={10}
              showCount
              maxLength={500}
              value={reason}
              onChange={(e) => dispatch(updateStatusReason(e.target.value))}
              placeholder="Enter decline reason."
            />
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        dispatch(updateOrderStatus(order.id, "declined", customerId));
      },
      onCancel() {
        dispatch(updateStatusReason(undefined));
      },
    });
  };

  const refund = () => {
    confirm({
      title: "Refund this full order?",
      icon: <ExclamationCircleOutlined />,
      okText: "Refund",
      okType: "danger",
      content: (
        <ModalItemSummary>
          {"Provide description for order refund reasons."}
          <Alert
            type="error"
            message={
              <p>
                This does not automatically process the customer's refund to
                their card. Please email{" "}
                <a
                  href="mailto:info@gdaypunch.com.au"
                  target="_blank"
                  rel="noopener" // rel="noreferrer"
                >
                  info@gdaypunch.com.au
                </a>{" "}
                with the details of this request before processing the refund.
                For example: Order No. 1234, Refund amount: $2.50, Reason:
                Discount applied
              </p>
            }
          />
          <div>
            <TextArea
              rows={10}
              showCount
              maxLength={500}
              value={reason}
              onChange={(e) => dispatch(updateStatusReason(e.target.value))}
              placeholder="Enter refund reason."
            />
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        dispatch(updateOrderStatus(order.id, "refunded", customerId));
      },
      onCancel() {
        dispatch(updateStatusReason(undefined));
      },
    });
  };

  const partialRefund = () => {
    confirm({
      title: "Partially refund this order?",
      icon: <ExclamationCircleOutlined />,
      okText: "Refund",
      okType: "danger",
      content: (
        <ModalItemSummary>
          {"Provide description for order partial refund reasons."}
          <Alert
            type="error"
            message={
              <p>
                This does not automatically process the customer's refund to
                their card. Please email{" "}
                <a
                  href="mailto:info@gdaypunch.com.au"
                  target="_blank"
                  rel="noopener"
                >
                  info@gdaypunch.com.au
                </a>{" "}
                with the details of this request before processing the refund.
                For example: Order No. 1234, Refund amount: $2.50, Reason:
                Discount applied
              </p>
            }
          />
          <div>
            <Input
              value={partial_refund}
              onChange={(e) => dispatch(updatePartialRefund(e.target.value))}
              placeholder="Enter partial refund amount."
            />
          </div>
          <div>
            <TextArea
              rows={10}
              showCount
              maxLength={500}
              value={reason}
              onChange={(e) => dispatch(updateStatusReason(e.target.value))}
              placeholder="Enter partial refund reason."
            />
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        dispatch(updateOrderStatus(order.id, "partially_refunded", customerId));
      },
      onCancel() {
        dispatch(updateStatusReason(undefined));
      },
    });
  };

  const renderStatusIcons = {
    pending: PendingIcon,
    purchased: PurchasedIcon,
    shipped: ShippedIcon,
    declined: DeclinedIcon,
    refunded: RefundedIcon,
    partially_refunded: RefundedIcon,
  };

  const productColumns = [
    {
      title: "Item",
      dataIndex: "product",
      key: "order-item",
      render: (product, instance) => {
        let currentStatus = "purchased";

        if (instance.status === "pending") {
          if (product.type === "digital") {
            currentStatus = "purchased";
          } else {
            currentStatus = "pending";
          }
        } else if (instance.status === "shipped") {
          if (product.type === "digital") {
            currentStatus = "purchased";
          } else {
            currentStatus = "shipped";
          }
        } else {
          currentStatus = instance.status;
        }

        const StatusIcon = renderStatusIcons[currentStatus];

        return (
          <div>
            <div className="item-image-title">
              <img src={getGdayPunchStaticUrl(product.image)} />
              <p>{product.title}</p>
              <span className={`status ${currentStatus}`}>
                <StatusIcon /> {currentStatus}
              </span>
            </div>
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
      render: (product) => `A$${product.total.toFixed(2)}`,
    },
  ];

  const mobileProductColumns = [
    {
      title: "Item",
      dataIndex: "product",
      key: "order-item",
      render: (product, instance) => {
        let currentStatus = "purchased";

        if (instance.status === "pending") {
          if (product.type === "digital") {
            currentStatus = "purchased";
          } else {
            currentStatus = "pending";
          }
        } else if (instance.status === "shipped") {
          if (product.type === "digital") {
            currentStatus = "purchased";
          } else {
            currentStatus = "shipped";
          }
        }

        const StatusIcon = renderStatusIcons[currentStatus];

        return (
          <div className="item-image-title">
            <img src={getGdayPunchStaticUrl(product.image)} />
            <div className="title-status-qty">
              <p>{product.title}</p>
              <span className={currentStatus + " status"}>
                <StatusIcon /> {currentStatus} {`(${instance.qty})`}
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
      render: (product) => `A$${product.total.toFixed(2)}`,
    },
  ];

  const statusColumns = [
    {
      title: "Date",
      dataIndex: "readable_date",
      key: "readable_date",
      render: ({ date, time }) => (
        <div>
          {date}
          <span>{time}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => description,
    },
  ];

  const StatusIcon = renderStatusIcons[order.status];

  return (
    <OrderModal
      width="80%"
      title={
        <ModalTitle>
          <TitleStatus>
            {`Order #${order.number}`}
            <span className={order.status + " status"}>
              <StatusIcon /> {order.status}
            </span>
          </TitleStatus>
          {order.status === "pending" ? (
            <Button
              onClick={() =>
                markShipped(
                  order.id,
                  order.product_qty_details
                    .map((elem) => ({
                      id: elem.id,
                      qty: elem.qty,
                      ...elem.product,
                    }))
                    .filter((prod) => prod.type !== "digital")
                )
              }
            >
              Mark as Shipped
            </Button>
          ) : null}
        </ModalTitle>
      }
      visible={selected}
      onCancel={() => dispatch(setSelectedOrder(undefined))}
      cancelText="Close"
      okButtonProps={{ style: { display: "none" } }}
    >
      <Table
        rowKey="id"
        className="desktop"
        columns={productColumns}
        dataSource={
          order.product_qty_details
            ? order.product_qty_details.map((product) => ({
                ...product,
                status: order.status,
              }))
            : []
        }
        pagination={false}
      />
      <Table
        rowKey="id"
        className="mobile"
        columns={mobileProductColumns}
        dataSource={
          order.product_qty_details
            ? order.product_qty_details.map((product) => ({
                ...product,
                status: order.status,
              }))
            : []
        }
        pagination={false}
      />
      <ProductTotalsContainer>
        <div>
          Shipping
          <span>{`A$${order.country === "AU" ? "0.00" : "13.00"}`}</span>
        </div>
        {order.coupon !== null && order.coupon.length > 1 && (
          <div>
            {`Discount [Coupon: ${order.coupon_details.description}]`}
            <span>{`- A$${order.coupon_details.discount_amount}`}</span>
          </div>
        )}
        <div>
          Tax (included in item prices): [GST]
          <span>{`A$${order.tax ? order.tax.toFixed(2) : "Error"}`}</span>
        </div>
        <div>
          Subtotal{" "}
          <span>{`A$${
            order.products_total_price
              ? order.products_total_price.toFixed(2)
              : "Error"
          }`}</span>
        </div>
        {accountSeller ? (
          <div>
            {`Seller Fee (10% + 30c)`}
            <span>{`- A$${getSellerFee(order.amount).toFixed(2)}`}</span>
          </div>
        ) : null}
        {!accountSeller ? (
          <div>
            Total:
            <span>{`A$${order.amount.toFixed(2)}`}</span>
          </div>
        ) : (
          <div>
            Total:
            <span>{`A$${(order.amount - getSellerFee(order.amount)).toFixed(
              2
            )}`}</span>
          </div>
        )}
      </ProductTotalsContainer>
      {accountSeller && order.status === "refunded" ? null : (
        <StatusButtons>
          {accountSeller ? null : (
            <Button onClick={() => decline()}>Decline</Button>
          )}
          <Button onClick={() => refund()}>Refund</Button>
          <Button onClick={() => partialRefund()}>Partial Refund</Button>
        </StatusButtons>
      )}
      <AddressBillingContainer>
        <LeftContainer>
          {order.address_line_1 ? (
            <AddressContactField>
              <h4>Fulfillment details</h4>
              <div>
                <p>{`${order.first_name} ${order.last_name}`}</p>
                <p>{`${order.address_line_1} ${order.address_line_2}`}</p>
                <p>{`${order.city}, ${order.state} ${order.postcode}`}</p>
                <p>{`${order.country}`}</p>
              </div>
            </AddressContactField>
          ) : null}
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
                <p>{`${order.city}, ${order.state} ${order.postcode}`}</p>
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
      {order.statuses ? (
        <OrderStatuses>
          <Table
            columns={statusColumns}
            dataSource={order.statuses.map((status) => ({
              key: status.id,
              ...status,
            }))}
            pagination={false}
          />
        </OrderStatuses>
      ) : null}
    </OrderModal>
  );
}

export default OrderDetails;
