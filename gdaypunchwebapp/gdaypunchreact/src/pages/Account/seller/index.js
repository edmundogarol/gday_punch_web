import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Result, Button } from "antd";
import { isEmpty } from "lodash";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";

import LoadingSpinner from "components/loadingSpinner";
import { fetchSellerDetails, fetchSellerSales } from "actions/seller";
import { selectUser } from "selectors/app";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { selectSellerState } from "selectors/account";

import { DetailField } from "../styles";
import SellerDetails from "./SellerDetails";

function Seller(props) {
  const { history } = props;

  const user = useSelector(selectUser);

  const {
    sellerDetails,
    fetchingSellerDetails,
    finishedFetchingSellerDetails,
    sellerDetailsError,
    sellerSales,
    fetchingSellerSales,
    finishedFetchingSellerSales,
    sellerSalesError,
    finishedUpdatingSellerDetails,
    sellerDetailsUpdateError,
  } = useSelector(selectSellerState);

  const dispatch = useDispatch();

  const [sellerDetailsOpen, toggleSellerDetailsOpen] = useState(false);

  useScrollTop();

  useEffect(() => {
    if (
      user.id &&
      user.seller_id &&
      !fetchingSellerDetails &&
      !finishedFetchingSellerDetails
    ) {
      dispatch(fetchSellerDetails(user.seller_id));
    }
  }, [user, sellerSales, fetchingSellerSales, finishedFetchingSellerSales]);

  useEffect(() => {
    if (
      user.id &&
      user.seller_id &&
      isEmpty(sellerSales) &&
      !fetchingSellerSales &&
      !finishedFetchingSellerSales
    ) {
      dispatch(fetchSellerSales(user.seller_id));
    }
  }, [user, sellerSales, fetchingSellerSales, finishedFetchingSellerSales]);

  useEffect(() => {
    if (finishedUpdatingSellerDetails && !sellerDetailsUpdateError) {
      toggleSellerDetailsOpen(false);

      if (!sellerDetails.id) {
        dispatch(fetchSellerDetails(user.seller_id));
        dispatch(fetchSellerSales(user.seller_id));
      }
    }
  }, [finishedUpdatingSellerDetails]);

  const renderStatusIcons = {
    pending: PendingIcon,
    purchased: PurchasedIcon,
    shipped: ShippedIcon,
    declined: DeclinedIcon,
    refunded: RefundedIcon,
    partially_refunded: RefundedIcon,
  };

  const ordersColumns = [
    {
      title: "Date",
      dataIndex: "readable_date",
      key: "readable_date",
      width: "100px",
      render: (readable_date) => readable_date.date,
    },
    {
      title: "Order No.",
      dataIndex: "number",
      key: "number",
      render: (number, order) => {
        const StatusIcon = renderStatusIcons[order.status];

        return (
          <span className={`status ${order.status}`}>
            {`#${number}`}
            <StatusIcon />
          </span>
        );
      },
    },
    {
      title: "Items",
      className: "desktop-only",
      dataIndex: "product_qty_details",
      key: "product_qty_details",
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
      title: "Paid",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (amount) => `A$${amount.toFixed(2)}`,
    },
  ];

  const handleOrderOpen = (order) => {
    return {
      onClick: () => {
        history.push(`/order-confirmation/${order.secret}`);
      },
    };
  };

  return (
    <>
      {sellerDetailsOpen ? (
        <SellerDetails
          sellerDetailsOpen={sellerDetailsOpen}
          toggleSellerDetailsOpen={toggleSellerDetailsOpen}
        />
      ) : null}
      {!sellerDetails?.id ? (
        <Result
          title="You are currently not a Seller"
          extra={
            <Button
              type="primary"
              key="console"
              onClick={() => toggleSellerDetailsOpen(true)}
            >
              Activate Seller features
            </Button>
          }
        />
      ) : null}
      {finishedFetchingSellerDetails && sellerDetails?.id && (
        <Card className="non-first-tab" type="inner" title="Sales Summaries">
          <DetailField>
            <label>Weekly Total</label>
            <p className="large">A${sellerDetails.next_payout.toFixed(2)}</p>
          </DetailField>
          <DetailField>
            <label>All Time Total</label>
            <p>A${sellerDetails.total_sales.toFixed(2)}</p>
          </DetailField>
        </Card>
      )}
      {sellerDetails?.id ? (
        <Card
          className="non-first-tab"
          type="inner"
          title="Payout Details"
          extra={
            <a
              href="#"
              disabled={!sellerDetails?.id}
              onClick={() => toggleSellerDetailsOpen(true)}
            >
              Edit
            </a>
          }
        >
          {sellerDetails.use_paypal ? (
            <DetailField>
              <label>PayPal Email</label>
              <p>{sellerDetails.paypal_email}</p>
            </DetailField>
          ) : (
            <>
              <DetailField>
                <label>Account Name</label>
                <p>{sellerDetails.bank_acc_name}</p>
              </DetailField>
              <DetailField>
                <label>Bank Account</label>
                <p>{sellerDetails.bank_bsb}</p>
                <p>{sellerDetails.bank_acc}</p>
              </DetailField>
            </>
          )}
        </Card>
      ) : null}
      {fetchingSellerSales ? (
        <LoadingSpinner />
      ) : (
        <Card className="non-first-tab" type="inner" title="Stall Sales">
          <Table
            dataSource={sellerSales.map((order) => ({
              ...order,
              key: order.id,
            }))}
            columns={ordersColumns}
            onRow={handleOrderOpen}
          />
        </Card>
      )}
    </>
  );
}

export default withRouter(Seller);
