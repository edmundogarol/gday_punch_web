import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, Space, Result, Card } from "antd";
import Highlighter from "react-highlight-words";

import { isEmpty } from "lodash";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
  SearchOutlined,
} from "@ant-design/icons";

import LoadingSpinner from "components/loadingSpinner";
import {
  fetchSaleStatusUpdates,
  fetchSellerDetails,
  fetchSellerSales,
  setSelectedSale,
  updateSalePartialRefund,
  updateSaleStatus,
  updateSaleStatusReason,
} from "actions/seller";
import { selectUser } from "selectors/app";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { selectSellerState } from "selectors/account";

import { SellerContainer } from "./styles";
import { DetailField } from "../styles";
import SellerDetails from "./SellerDetails";
import OrderDetailsModal from "pages/Admin/orders/orderDetails";

function Seller() {
  const user = useSelector(selectUser);

  const {
    sellerDetails,
    fetchingSellerDetails,
    finishedFetchingSellerDetails,
    // sellerDetailsError,
    orderList: sellerSales,
    fetchingSellerSales,
    finishedFetchingSellerSales,
    // sellerSalesError,
    finishedUpdatingSellerDetails,
    sellerDetailsUpdateError,
    selected,
  } = useSelector(selectSellerState);

  const dispatch = useDispatch();

  const [sellerDetailsOpen, toggleSellerDetailsOpen] = useState(false);

  const [searchInput, updateSearchInput] = useState(undefined);
  const [searchText, updateSearchText] = useState("");
  const [searchedColumn, updateSearchedColumn] = useState("");

  const sellerSalesData = !isEmpty(sellerSales)
    ? Object.values(sellerSales).map((sale) => ({ id: sale.id, ...sale }))
    : [];

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    updateSearchText(selectedKeys[0]);
    updateSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    updateSearchText("");
  };

  const getColumnSearchProps = (dataIndex, mobile) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            updateSearchInput(node);
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              updateSearchText(selectedKeys[0]);
              updateSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, instance) => {
      const searchingNames = dataIndex === "name";
      let valueToSearch = instance[dataIndex];

      if (searchingNames) {
        valueToSearch = instance.first_name
          ? `${instance.first_name} ${instance.last_name}`
          : instance.email;
      }

      return (searchingNames ? searchingNames : instance[dataIndex])
        ? valueToSearch.toLowerCase().includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text, instance) => {
      const renderHighliter = (highlighted) => {
        let textToUse = text;

        if (dataIndex === "name") {
          textToUse = instance.first_name
            ? `${instance.first_name} ${instance.last_name}`
            : instance.email;
        }
        if (dataIndex === "number") {
          textToUse = `#${text}`;
        }

        if (highlighted) {
          return (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={textToUse ? textToUse.toString() : ""}
            />
          );
        } else {
          return <span>{textToUse}</span>;
        }
      };

      const renderColumn = (isMobile) => {
        if (dataIndex === "number" && isMobile) {
          return (
            <div className="detail-3-column-compressed">
              <p>{renderHighliter(searchedColumn === dataIndex)}</p>
              <p>{instance.readable_date.date}</p>
              <p>{instance.fulfillment_type}</p>
            </div>
          );
        } else if (dataIndex === "name" && isMobile) {
          const StatusIcon = renderStatusIcons[instance.status];

          return (
            <div className="detail-3-column-compressed">
              <p>{renderHighliter(searchedColumn === dataIndex)}</p>
              <p>{`A$${instance.amount.toFixed(2)}`}</p>
              <span className={instance.status}>
                <StatusIcon /> {instance.status}
              </span>
            </div>
          );
        } else {
          return renderHighliter(searchedColumn === dataIndex);
        }
      };

      return renderColumn(mobile);
    },
  });

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
      ...getColumnSearchProps("number"),
    },
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      className: "email-or-name",
      ...getColumnSearchProps("name"),
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

  const mobileColumns = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "customer-amount-status",
      className: "left email-or-name",
      ...getColumnSearchProps("name", true),
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
      ...getColumnSearchProps("number", true),
    },
  ];

  const handleSaleOpen = (order) => {
    return {
      onClick: () => {
        dispatch(setSelectedSale(order.id));
        if (!order.statuses) {
          dispatch(fetchSaleStatusUpdates(order.id));
        }
      },
    };
  };

  return (
    <SellerContainer>
      {sellerDetailsOpen ? (
        <SellerDetails
          sellerDetailsOpen={sellerDetailsOpen}
          toggleSellerDetailsOpen={toggleSellerDetailsOpen}
        />
      ) : null}
      {selected && (
        <OrderDetailsModal
          accountSeller
          selectOrderState={selectSellerState}
          setSelectedOrder={setSelectedSale}
          updateOrderStatus={updateSaleStatus}
          updateStatusReason={updateSaleStatusReason}
          updatePartialRefund={updateSalePartialRefund}
        />
      )}
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
            <label>Next Payout (Week&apos;s Sales)</label>
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
            className="desktop"
            dataSource={sellerSalesData.map((order) => ({
              ...order,
              key: order.id,
            }))}
            columns={ordersColumns}
            onRow={handleSaleOpen}
          />
          <Table
            className="mobile"
            onRow={handleSaleOpen}
            dataSource={sellerSalesData.map((order) => ({
              ...order,
              key: order.id,
            }))}
            columns={mobileColumns}
          />
        </Card>
      )}
    </SellerContainer>
  );
}

export default withRouter(Seller);
