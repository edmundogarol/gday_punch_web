import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Typography, message } from "antd";
import Highlighter from "react-highlight-words";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
  UserOutlined,
  UserAddOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

import UserDetailsModal from "./userDetails";
import { UsersContainer, UserCreateContainer, SubmitButton } from "./styles";
import { emailValidator } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

const { Title } = Typography;

function Ui(props) {
  const {
    usersState: {
      userList,
      count: availableCount,
      fetching,
      finishedFetching,
      selected,
    },
    fetchUsers,
    fetchUserCustomerDetails,
    setSelectedUser,
    adminCreateUser,
  } = props;
  const [searchInput, updateSearchInput] = useState(undefined);
  const [searchText, updateSearchText] = useState("");
  const [searchedColumn, updateSearchedColumn] = useState("");
  const [newUser, updateNewUser] = useState({
    email: undefined,
    firstName: undefined,
    lastName: undefined,
  });

  useScrollTop();

  useEffect(() => {
    if (!fetching && !finishedFetching) {
      fetchUsers();
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
              fetchUsers(undefined, selectedKeys[0]);
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
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text, instance) => {
      const renderUserColumn = (highlighted) => (
        <div className="detail-3-column-compressed">
          {mobile ? (
            <p>{instance.customer_id ? <ShoppingOutlined /> : null}</p>
          ) : null}
          <p className={!instance.username ? "unset" : ""}>
            {instance.username || "Username unset"}
          </p>
          {highlighted ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            <p>{instance.email}</p>
          )}
          <p className="extra">
            {instance.first_name
              ? `${instance.first_name} ${instance.last_name}`
              : "Fullname unset"}
          </p>
        </div>
      );

      return renderUserColumn(searchedColumn === dataIndex);
    },
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "User",
      dataIndex: "email",
      key: "email",
      className: "email-or-name center",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Customer",
      dataIndex: "customer_id",
      key: "customer_id",
      className: "right",
      render: (customer_id) => {
        return customer_id ? <ShoppingOutlined /> : null;
      },
    },
    {
      title: "Subscribed",
      dataIndex: "subscribed",
      key: "subscribed",
      className: "subscribed",
      render: (subscribed) => (subscribed ? <PurchasedIcon /> : null),
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified) =>
        verified === "verified" ? "Verified" : "Not verified",
    },
    {
      title: "Type",
      dataIndex: "is_staff",
      key: "is_staff",
      render: (is_staff, instance) => (is_staff ? "Staff" : "Normal"),
    },
    {
      title: "Privileges",
      dataIndex: "privileges",
      key: "privileges",
      render: (privileges) => `${privileges.join(", ")}`,
    },
    {
      title: "Last Login",
      dataIndex: "readable_last_login",
      key: "readable_last_login",
      className: "center",
      render: (readable_last_login, instance) => {
        if (readable_last_login) {
          return (
            <>
              <p>{readable_last_login.date}</p>
              <p className="time">{readable_last_login.time}</p>
              <a
                target="_blank"
                href={`https://tools.keycdn.com/geo?host=${instance.last_ip}`}
              >
                <p className="time">{instance.last_ip}</p>
              </a>
            </>
          );
        } else {
          return "Never logged in";
        }
      },
    },
  ];

  const mobileColumns = [
    {
      title: "User",
      dataIndex: "email",
      key: "email",
      className: "email-or-name left",
      ...getColumnSearchProps("email", true),
    },
    {
      dataIndex: "type-verified-subscribed",
      key: "type-verified-subscribed",
      className: "right subscribed",
      render: (val, instance) => {
        return (
          <div className="detail-3-column-compressed">
            <p>{instance.is_staff ? "Staff" : "Normal"}</p>
            <p>
              {instance.verified === "verified" ? "Verified" : "Not verified"}
            </p>
            <p>{instance.subscribed ? <PurchasedIcon /> : null}</p>
          </div>
        );
      },
    },
  ];

  const handleUserOpen = (user, rowIndex) => {
    return {
      onClick: (event) => {
        setSelectedUser(user.id);
        if (!user.customer_details) {
          fetchUserCustomerDetails(user.customer_id);
        }
      },
    };
  };

  const handleCreateUser = () => {
    if (!emailValidator(newUser.email)) {
      message.error("Email invalid. Check and try again.");
    } else {
      adminCreateUser(newUser);
    }
  };

  const dataSource = Object.values(userList)
    .map((user) => ({
      key: user.id,
      ...user,
    }))
    .sort((a, b) => -(a.id - b.id));

  const currentUserCount = Object.values(userList).length;

  return (
    <UsersContainer>
      <Title level={4}>Create User</Title>
      <UserCreateContainer>
        <Input
          value={newUser.email}
          onChange={(e) => updateNewUser({ ...newUser, email: e.target.value })}
          placeholder="Enter Email"
          prefix={<UserAddOutlined className="site-form-item-icon" />}
        />
        <div className="name-row">
          <Input
            value={newUser.firstName}
            onChange={(e) =>
              updateNewUser({ ...newUser, firstName: e.target.value })
            }
            placeholder="Enter first name"
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
          <Input
            value={newUser.lastName}
            onChange={(e) =>
              updateNewUser({ ...newUser, lastName: e.target.value })
            }
            placeholder="Enter last name"
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
        </div>
        <SubmitButton onClick={() => handleCreateUser()}>Create</SubmitButton>
      </UserCreateContainer>
      <Title level={4}>Users</Title>
      {selected && <UserDetailsModal user={userList[selected]} />}
      <Table
        onRow={handleUserOpen}
        className="desktop"
        dataSource={dataSource}
        columns={columns}
        onChange={({ current, pageSize }) => {
          if (currentUserCount < availableCount) {
            if (current * pageSize === currentUserCount) {
              fetchUsers(true); // true = fetch next
            }
          }
        }}
      />
      <Table
        className="mobile"
        onRow={handleUserOpen}
        dataSource={dataSource}
        columns={mobileColumns}
        onChange={({ current, pageSize }) => {
          if (currentUserCount < availableCount) {
            if (current * pageSize === currentUserCount) {
              fetchUsers(true); // true = fetch next
            }
          }
        }}
      />
    </UsersContainer>
  );
}

export default Ui;
