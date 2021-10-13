import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Typography } from "antd";
import Highlighter from "react-highlight-words";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
  SearchOutlined,
} from "@ant-design/icons";

import OrderDetailsModal from "./orderDetails";
import { OrdersContainer } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";

const { Title } = Typography;

function Ui(props) {
  const {
    ordersState: {
      orderList,
      count: availableCount,
      fetching,
      finishedFetching,
      selected,
    },
    fetchOrders,
    fetchOrderStatuses,
    setSelectedOrder,
  } = props;

  const [searchInput, updateSearchInput] = useState(undefined);
  const [searchText, updateSearchText] = useState("");
  const [searchedColumn, updateSearchedColumn] = useState("");

  useScrollTop();

  useEffect(() => {
    if (!fetching && !finishedFetching) {
      fetchOrders();
    }
  }, [fetching, finishedFetching]);

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

  const columns = [
    {
      title: "Order No.",
      dataIndex: "number",
      key: "number",
      ...getColumnSearchProps("number"),
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
      ...getColumnSearchProps("name"),
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

  const handleOrderOpen = (order, rowIndex) => {
    return {
      onClick: (event) => {
        setSelectedOrder(order.id);
        if (!order.statuses) {
          fetchOrderStatuses(order.id);
        }
      },
    };
  };

  const dataSource = Object.values(orderList)
    .map((order) => ({
      key: order.id,
      ...order,
    }))
    .sort((a, b) => -(a.id - b.id));

  const currentOrderCount = Object.values(orderList).length;

  return (
    <OrdersContainer>
      <Title level={4}>Orders</Title>
      {selected && <OrderDetailsModal />}
      <Table
        onRow={handleOrderOpen}
        className="desktop"
        dataSource={dataSource}
        columns={columns}
        onChange={({ current, pageSize }) => {
          if (currentOrderCount < availableCount) {
            if (current * pageSize === currentOrderCount) {
              fetchOrders(true); // true = fetch next
            }
          }
        }}
      />
      <Table
        className="mobile"
        onRow={handleOrderOpen}
        dataSource={dataSource}
        columns={mobileColumns}
      />
    </OrdersContainer>
  );
}

export default Ui;
