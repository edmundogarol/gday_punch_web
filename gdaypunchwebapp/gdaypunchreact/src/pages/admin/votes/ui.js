import React, { useEffect } from "react";
import { Typography, Table, Badge } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import { VotesContainer, VotingItem, VotingItemsContainer } from "./styles";
import { getGdayPunchStaticUrl } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

const { Title } = Typography;

function Ui(props) {
  const {
    votingDashboardState: {
      fetching,
      finishedFetching,
      issue_number,
      items,
      latest_10,
      vote_tally,
    },
    fetchVotingDashboard,
  } = props;

  useScrollTop();

  useEffect(() => {
    if (!fetching && !finishedFetching) {
      fetchVotingDashboard();
    }
  }, [fetching, finishedFetching]);

  const voteIconPicker = (val) => {
    if (val.value === 1) {
      return <CheckCircleOutlined className="first" />;
    } else if (val.value === 2) {
      return <CheckCircleOutlined className="second" />;
    } else if (val.value === 3) {
      return <CheckCircleOutlined className="third" />;
    }
  };

  const votingItemColumns = () => {
    return items.map((item) => ({
      title: `#${item.idx}`,
      dataIndex: `item${item.idx}`,
      key: `position-${item.idx}`,
      render: (val, instance) => (val ? voteIconPicker(val) : null),
    }));
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "created_date",
      key: "created_date",
      render: (created_date) => `${created_date.date}`,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    ...votingItemColumns(),
  ];

  const dataSource = latest_10.map((entry, idx) => ({
    key: idx + entry.customer,
    ...entry,
  }));

  return (
    <VotesContainer>
      <Title level={4}>Votes</Title>
      <VotingItemsContainer>
        {items.map(({ item, idx }) => (
          <div key={idx}>
            <Badge
              className="site-badge-count-109"
              count={vote_tally[`item${idx}`]}
              style={{ backgroundColor: "#52c41a" }}
            >
              <VotingItem src={getGdayPunchStaticUrl(item.img)} />
              <span>{`#${idx} ${item.title}`}</span>
            </Badge>
          </div>
        ))}
      </VotingItemsContainer>
      <Table dataSource={dataSource} columns={columns} />
    </VotesContainer>
  );
}

Ui.propTypes = {};

export default Ui;
