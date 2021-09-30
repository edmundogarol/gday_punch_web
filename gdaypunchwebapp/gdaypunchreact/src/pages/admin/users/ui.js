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
          </>
        );
      },
    },
    // {
    //   title: "Name",
    //   dataIndex: "user",
    //   key: "user",
    //   className: "email-or-name",
    //   render: (val, instance) =>
    //     instance.first_name
    //       ? `${instance.first_name} ${instance.last_name}`
    //       : instance.email,
    // },
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

  // const mobileColumns = [
  //   {
  //     title: "Customer/Amount/Status",
  //     dataIndex: "customer",
  //     key: "customer-amount-status",
  //     className: "left email-or-name",
  //     render: (val, instance) => {
  //       const StatusIcon = renderStatusIcons[instance.status];

  //       return (
  //         <div className="detail-3-column-compressed">
  //           <p>
  //             {instance.first_name
  //               ? `${instance.first_name} ${instance.last_name}`
  //               : instance.email}
  //           </p>
  //           <p>{`A$${instance.amount.toFixed(2)}`}</p>
  //           <span className={instance.status}>
  //             <StatusIcon /> {instance.status}
  //           </span>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     title: "Items",
  //     dataIndex: "product_qty_details",
  //     key: "product_qty_details",
  //     className: "center",
  //     render: (products) => {
  //       if (!products) return <>Problem retrieving items.</>;
  //       const firstProduct = products[0];
  //       const items = (
  //         <p>{`${firstProduct.qty} x ${firstProduct.product.title}`}</p>
  //       );
  //       let more = null;

  //       if (products.length > 1) {
  //         more = (
  //           <p>{`${products.length - 1} more item${
  //             products.length - 1 > 1 ? "s" : ""
  //           }`}</p>
  //         );
  //       }

  //       return (
  //         <>
  //           {items}
  //           {more}
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     title: "Number/Date/Type",
  //     dataIndex: "number",
  //     key: "customer-amount-status",
  //     className: "right",
  //     render: (val, instance) => {
  //       return (
  //         <div className="detail-3-column-compressed">
  //           <p>{`#${instance.number}`}</p>
  //           <p>{instance.readable_date.date}</p>
  //           <p>{instance.fulfillment_type}</p>
  //         </div>
  //       );
  //     },
  //   },
  // ];

  const handleUserOpen = (user, rowIndex) => {
    return {
      onClick: (event) => {
        setSelectedUser(user.id);
        if (!user.customer_details) {
          fetchUserCustomerDetails(user.id);
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
      {/* <Table
        className="mobile"
        onRow={handleOrderOpen}
        dataSource={dataSource}
        showHeader={false}
        columns={mobileColumns}
      /> */}
    </UsersContainer>
  );
}

export default Ui;
