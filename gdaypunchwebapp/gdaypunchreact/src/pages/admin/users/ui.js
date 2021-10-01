import React, { useEffect } from "react";
import { Typography, Table } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";

import UserDetailsModal from "./userDetails";
import { UsersContainer } from "./styles";

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
  } = props;

  useEffect(() => {
    if (!fetching && !finishedFetching) {
      fetchUsers();
    }
  }, [fetching, finishedFetching]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      className: "email-or-name center",
      render: (val, instance) => {
        return (
          <>
            <p className={!instance.username ? "unset" : ""}>
              {instance.username || "Username unset"}
            </p>
            <p>{instance.email}</p>
            <p>
              {instance.first_name
                ? `${instance.first_name} ${instance.last_name}`
                : "Fullname unset"}
            </p>
          </>
        );
      },
    },
    {
      title: "Last Login",
      dataIndex: "readable_last_login",
      key: "readable_last_login",
      className: "center",
      render: (readable_last_login) => {
        return (
          <>
            <p>{readable_last_login.date}</p>
            <p className="time">{readable_last_login.time}</p>
          </>
        );
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
      render: (verified) => (verified ? "Verified" : "Unverified"),
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
      title: "Date Joined",
      dataIndex: "readable_date_joined",
      key: "readable_date_joined",
      className: "center",
      render: (readable_date_joined) => {
        return (
          <>
            <p>{readable_date_joined.date}</p>
            <p className="time">{readable_date_joined.time}</p>
          </>
        );
      },
    },
  ];

  const mobileColumns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      className: "email-or-name left",
      render: (val, instance) => {
        return (
          <div className="detail-3-column-compressed">
            <p className={!instance.username ? "unset" : ""}>
              {instance.username || "Username unset"}
            </p>
            <p>{instance.email}</p>
            <p>
              {instance.first_name
                ? `${instance.first_name} ${instance.last_name}`
                : "Fullname unset"}
            </p>
          </div>
        );
      },
    },
    {
      title: "Type/Verified/Subscribed",
      dataIndex: "type-verified-subscribed",
      key: "type-verified-subscribed",
      className: "right subscribed",
      render: (val, instance) => {
        return (
          <div className="detail-3-column-compressed">
            <p>{instance.is_staff ? "Staff" : "Normal"}</p>
            <p>{instance.verified ? "Verified" : "Unverified"}</p>
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

  const dataSource = Object.values(userList)
    .map((user) => ({
      key: user.id,
      ...user,
    }))
    .sort((a, b) => -(a.id - b.id));

  const currentUserCount = Object.values(userList).length;

  return (
    <UsersContainer>
      <Title level={4}>Users</Title>
      {selected && <UserDetailsModal />}
      <Table
        onRow={handleUserOpen}
        className="desktop"
        dataSource={dataSource}
        columns={columns}
        onChange={({ current, pageSize }) => {
          if (currentUserCount < availableCount) {
            if (current * pageSize === currentUserCount) {
              fetchOrders(true); // true = fetch next
            }
          }
        }}
      />
      <Table
        className="mobile"
        onRow={handleUserOpen}
        dataSource={dataSource}
        showHeader={false}
        columns={mobileColumns}
      />
    </UsersContainer>
  );
}

export default Ui;
