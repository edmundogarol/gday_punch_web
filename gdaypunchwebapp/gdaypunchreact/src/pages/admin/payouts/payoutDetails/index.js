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
  PayoutModal,
  ProductTotalsContainer,
  AddressContactField,
  AddressBillingContainer,
  LeftContainer,
  RightContainer,
  PayoutStatuses,
  ModalTitle,
  TitleStatus,
  ModalItemSummary,
  StatusButtons,
} from "./styles";
import { selectPayoutsState } from "selectors/admin";
import {
  setSelectedAdminPayout,
  updatePayoutStatus,
  updatePayoutStatusReason,
} from "actions/admin";

const { confirm } = Modal;
const { TextArea } = Input;

function PayoutDetailsModal() {
  const { payoutsList, selected, reason } = useSelector(selectPayoutsState);
  const payout = payoutsList[selected];

  const dispatch = useDispatch();

  const markProcessing = (payoutId) => {
    confirm({
      title: "Mark this payout as processing?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <ModalItemSummary>
          <div>
            {"Provide any notes for update."}
            <div>
              <TextArea
                rows={10}
                showCount
                maxLength={500}
                value={reason}
                onChange={(e) =>
                  dispatch(updatePayoutStatusReason(e.target.value))
                }
                placeholder="Enter shipment notes."
              />
            </div>
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        dispatch(updatePayoutStatus(payoutId, "processing"));
      },
      onCancel() {
        dispatch(updatePayoutStatusReason(undefined));
      },
    });
  };

  const markFailed = (payoutId) => {
    confirm({
      title: "Payout Failed?",
      icon: <ExclamationCircleOutlined />,
      okText: "Failed",
      okType: "danger",
      content: (
        <ModalItemSummary>
          {"Provide description for payout failure reasons."}
          <div>
            <TextArea
              rows={10}
              showCount
              maxLength={500}
              value={reason}
              onChange={(e) =>
                dispatch(updatePayoutStatusReason(e.target.value))
              }
              placeholder="Enter reason for failure."
            />
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        dispatch(updatePayoutStatus(payoutId, "failed"));
      },
      onCancel() {
        dispatch(updatePayoutStatusReason(undefined));
      },
    });
  };

  const markRetrying = (payoutId) => {
    confirm({
      title: "Retry payment of this payout?",
      icon: <ExclamationCircleOutlined />,
      okText: "Retry",
      okType: "danger",
      content: (
        <ModalItemSummary>
          {"Provide any notes related to this payout retry."}
          <div>
            <TextArea
              rows={10}
              showCount
              maxLength={500}
              value={reason}
              onChange={(e) =>
                dispatch(updatePayoutStatusReason(e.target.value))
              }
              placeholder="Enter retry notes."
            />
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        dispatch(updatePayoutStatus(payoutId, "retrying"));
      },
      onCancel() {
        dispatch(updatePayoutStatusReason(undefined));
      },
    });
  };

  const markSucceeded = (payoutId) => {
    confirm({
      title: "Mark payout as succeeded?",
      icon: <ExclamationCircleOutlined />,
      okText: "Succeeded",
      content: (
        <ModalItemSummary>
          {"Provide any notes for this successful payout."}
          <div>
            <TextArea
              rows={10}
              showCount
              maxLength={500}
              value={reason}
              onChange={(e) =>
                dispatch(updatePayoutStatusReason(e.target.value))
              }
              placeholder="Enter any notes for successful payout."
            />
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        dispatch(updatePayoutStatus(payoutId, "succeeded"));
      },
      onCancel() {
        dispatch(updatePayoutStatusReason(undefined));
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

  const renderPayoutStatusIcons = {
    scheduled: PendingIcon,
    processing: PendingIcon,
    succeeded: PurchasedIcon,
    failed: DeclinedIcon,
    retrying: RefundedIcon,
  };

  const orderColumns = [
    {
      title: "Order No.",
      dataIndex: "number",
      key: "number",
      render: (number) => `#${number}`,
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
      dataIndex: "name",
      key: "name",
      className: "email-or-name",
      render: (name, instance) => {
        return instance.first_name
          ? `${instance.first_name} ${instance.last_name}`
          : instance.email;
      },
    },
    {
      title: "Items",
      dataIndex: "product_qty_details",
      key: "product_qty_details",
      className: "center",
      render: (products) => {
        if (!products) return <>Problem retrieving items.</>;

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
      render: (amount) => `A$${(amount - getSellerFee(amount)).toFixed(2)}`,
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
      render: (status) => {
        const StatusIcon = renderStatusIcons[status];

        return (
          <span className={status}>
            <StatusIcon /> {status}
          </span>
        );
      },
    },
  ];

  const mobileOrderColumns = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "customer-amount-status",
      className: "left email-or-name",
      render: (name, instance) => {
        return instance.first_name
          ? `${instance.first_name} ${instance.last_name}`
          : instance.email;
      },
    },
    {
      dataIndex: "product_qty_details",
      key: "product_qty_details",
      className: "center",
      render: (products) => {
        if (!products) return <>Problem retrieving items.</>;
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
      title: "Number",
      dataIndex: "number",
      key: "customer-amount-status",
      className: "right",
      render: (number) => `#${number}`,
    },
  ];

  const statusColumns = [
    {
      title: "Last Update",
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: () => `A$${payout.amount.toFixed(2)}`,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => description,
    },
  ];

  const StatusIcon = renderPayoutStatusIcons[payout.status];

  return (
    <PayoutModal
      width="80%"
      title={
        <ModalTitle>
          <TitleStatus>
            {`Payout: ${payout.author}`}
            <span className={payout.status + " status"}>
              <StatusIcon /> {payout.status}
            </span>
          </TitleStatus>
        </ModalTitle>
      }
      visible={selected}
      onCancel={() => dispatch(setSelectedAdminPayout(undefined))}
      cancelText="Close"
      okButtonProps={{ style: { display: "none" } }}
    >
      {payout.statuses ? (
        <PayoutStatuses>
          <Table
            columns={statusColumns}
            dataSource={payout.statuses.map((status) => ({
              key: status.id,
              ...status,
            }))}
            pagination={false}
          />
        </PayoutStatuses>
      ) : null}
      <StatusButtons>
        <Button onClick={() => markProcessing(payout.id)}>Processing</Button>
        <Button onClick={() => markSucceeded(payout.id)}>Succeeded</Button>
        <Button onClick={() => markFailed(payout.id)}>Failed</Button>
        <Button onClick={() => markRetrying(payout.id)}>Retrying</Button>
      </StatusButtons>
      <AddressBillingContainer>
        <LeftContainer>
          <AddressContactField>
            <h4>Seller Information</h4>
            <div>
              <p>{`Seller: ${payout.author}`}</p>
              <p>{`Email: ${payout.email}`}</p>
            </div>
          </AddressContactField>
        </LeftContainer>
        <RightContainer>
          <AddressContactField>
            <h4>Payment Method</h4>
            <div>
              <p>{`Method: ${
                payout.use_paypal ? "PayPal" : "Bank Account"
              }`}</p>
              <p>{`Account: ${payout.payout_destination}`}</p>
            </div>
          </AddressContactField>
        </RightContainer>
      </AddressBillingContainer>
      <PayoutStatuses>
        <Table
          rowKey="id"
          className="desktop"
          columns={orderColumns}
          dataSource={payout.order_summaries}
          pagination={false}
        />
        <Table
          rowKey="id"
          className="mobile"
          columns={mobileOrderColumns}
          dataSource={payout.order_summaries}
          pagination={false}
        />
      </PayoutStatuses>
    </PayoutModal>
  );
}

export default PayoutDetailsModal;
