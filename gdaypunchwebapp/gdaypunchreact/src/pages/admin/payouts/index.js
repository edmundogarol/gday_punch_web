import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, Space, Typography } from "antd";
import Highlighter from "react-highlight-words";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
  SearchOutlined,
} from "@ant-design/icons";

import PayoutDetailsModal from "./payoutDetails";
import { PayoutsContainer } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { selectPayoutsState } from "selectors/admin";
import { fetchAdminPayouts, setSelectedAdminPayout } from "actions/admin";

const { Title } = Typography;

function Payouts() {
  const payoutsState = useSelector(selectPayoutsState);
  const { payoutsList, fetching, finishedFetching, selected } = payoutsState;

  const dispatch = useDispatch();

  const [searchInput, updateSearchInput] = useState(undefined);
  const [searchText, updateSearchText] = useState("");
  const [searchedColumn, updateSearchedColumn] = useState("");

  useScrollTop();

  useEffect(() => {
    if (!fetching && !finishedFetching) {
      dispatch(fetchAdminPayouts());
    }
  }, [fetching, finishedFetching]);

  const renderStatusIcons = {
    scheduled: PendingIcon,
    processing: PendingIcon,
    succeeded: PurchasedIcon,
    failed: DeclinedIcon,
    retrying: RefundedIcon,
  };

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
      let valueToSearch = instance[dataIndex];

      return instance[dataIndex]
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
          textToUse = `${instance.author}`;
        }

        if (dataIndex === "amount") {
          textToUse = `A$${text}`;
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
        if (dataIndex === "amount" && isMobile) {
          return (
            <div className="detail-3-column-compressed">
              <p>{renderHighliter(searchedColumn === dataIndex)}</p>
              <p>{instance.readable_date.date}</p>
              <p>{instance.fulfillment_type}</p>
            </div>
          );
        } else if (dataIndex === "author" && isMobile) {
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

  const columns = [
    {
      title: "Last Update",
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
      title: "Seller",
      dataIndex: "name",
      key: "name",
      className: "email-or-name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `A$${amount.toFixed(2)}`,
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

  const mobileColumns = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "customer-amount-status",
      className: "left email-or-name",
      ...getColumnSearchProps("name", true),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "customer-amount-status",
      className: "right",
      ...getColumnSearchProps("amount", true),
    },
  ];

  const handlePayoutOpen = (payout) => {
    return {
      onClick: () => {
        dispatch(setSelectedAdminPayout(payout.id));
        if (!payout.statuses) {
          // dispatch(fetchOrderStatusUpdates(order.id));
          console.log(payout);
        }
      },
    };
  };

  const dataSource = Object.values(payoutsList)
    .map((order) => ({
      key: order.id,
      ...order,
    }))
    .sort((a, b) => -(a.id - b.id));

  return (
    <PayoutsContainer>
      <Title level={4}>Payouts</Title>
      {selected && (
        <PayoutDetailsModal
        // selectOrderState={selectOrderState}
        // setSelectedOrder={setSelectedOrder}
        // updateOrderStatus={updateOrderStatus}
        // updateStatusReason={updateStatusReason}
        // updatePartialRefund={updatePartialRefund}
        />
      )}
      <Table
        onRow={handlePayoutOpen}
        className="desktop"
        dataSource={dataSource}
        columns={columns}
      />
      <Table
        className="mobile"
        onRow={handlePayoutOpen}
        dataSource={dataSource}
        columns={mobileColumns}
      />
    </PayoutsContainer>
  );
}

export default Payouts;
