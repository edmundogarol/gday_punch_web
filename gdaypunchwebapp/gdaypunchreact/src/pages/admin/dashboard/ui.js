import React from "react";
import { Typography, Table } from "antd";
import { NavLink } from "react-router-dom";

import { PromptsContainer } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {} = props;

  const columns = [
    {
      title: "Admin Route",
      dataIndex: "route",
      key: "route",
      render: (route) => (
        <NavLink className="nav-link" to={`/admin/${route}`}>
          {route}
        </NavLink>
      ),
    },
  ];

  const websiteRoutes = [
    { key: 1, route: "contacts" },
    { key: 2, route: "prompts" },
  ];

  return (
    <PromptsContainer>
      <Title level={4}>Website</Title>
      <Table
        showHeader={false}
        pagination={false}
        dataSource={websiteRoutes}
        columns={columns}
      />
    </PromptsContainer>
  );
}

export default Ui;
