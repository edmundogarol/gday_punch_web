import React from "react";
import { Typography, Table } from "antd";

import { AdminMobileNavLinks } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const { user, history, pageType } = props;

  function hasPrivilege(privilege) {
    if (!user.id) return false;

    const superUser = user.privileges.includes("super");
    if (superUser) return true;

    return user.privileges.includes(privilege);
  }

  const columns = [
    {
      title: "Admin Route",
      dataIndex: "route",
      key: "route",
      className: "admin-link",
      render: (route) => route,
    },
  ];

  const routerPageTypes = {
    dashboard: {
      title: "Website",
      routes: hasPrivilege("admin")
        ? [
            { key: 1, route: "users" },
            { key: 2, route: "contacts" },
            { key: 3, route: "prompts" },
          ]
        : [],
    },
    store: {
      title: "Store",
      routes: hasPrivilege("admin")
        ? [
            { key: 1, route: "orders" },
            { key: 2, route: "products" },
            { key: 3, route: "coupons" },
          ]
        : [],
    },
    socials: {
      title: "Socials",
      routes:
        hasPrivilege("twitter") || hasPrivilege("instagram")
          ? [
              { key: 1, route: "twitter" },
              { key: 2, route: "instagram" },
            ]
          : [],
    },
  };

  const handleLinkOpen = (link, rowIndex) => {
    return {
      onClick: (event) => history.push(link.route),
    };
  };

  const { title, routes } = routerPageTypes[pageType];

  return (
    <AdminMobileNavLinks>
      <Title level={4}>{title}</Title>
      <Table
        onRow={handleLinkOpen}
        showHeader={false}
        pagination={false}
        dataSource={routes}
        columns={columns}
      />
    </AdminMobileNavLinks>
  );
}

export default Ui;
