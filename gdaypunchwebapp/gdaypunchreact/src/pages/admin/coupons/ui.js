import React, { useEffect, useState } from "react";
import moment from "moment";
import { Input, Tooltip, Typography, Table, Radio, DatePicker } from "antd";
import {
  InfoCircleOutlined,
  PercentageOutlined,
  DollarCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";

import {
  CouponsContainer,
  CouponCreateContainer,
  SubmitButton,
} from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {
    couponState: { couponList: coupons, fetching, finishedFetching },
    fetchCoupons,
    createCoupon,
  } = props;
  const [newCoupon, updateNewCoupon] = useState({
    name: "",
    coupon_type: "percentage",
    expiry_date: undefined,
    date_created: moment(new Date()).format("YYYY-MM-DD"),
    amount: undefined,
  });

  const dataSource = coupons.map((coupon, idx) => ({ key: idx, ...coupon }));

  const columns = [
    {
      title: "Coupon",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "coupon_type",
      key: "coupon_type",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Created Date",
      dataIndex: "date_created",
      key: "date_created",
      render: (date) => moment(date).format("LL"),
      sorter: (a, b) => moment(b.date_created) - moment(a.date_created),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (date) => moment(date).format("LL"),
      sorter: (a, b) => moment(b.expiry_date) - moment(a.expiry_date),
    },
  ];

  useEffect(() => {
    if (!finishedFetching && !fetching) fetchCoupons();
  }, [fetching, finishedFetching]);

  const handleCouponSubmit = () => {
    createCoupon(newCoupon);
  };

  return (
    <CouponsContainer>
      <Title level={4}>Create Coupon</Title>
      <CouponCreateContainer>
        <Input
          value={newCoupon.name}
          onChange={(e) =>
            updateNewCoupon({
              ...newCoupon,
              name: e.target.value.toUpperCase(),
            })
          }
          placeholder="Enter Coupon Code"
          prefix={<TagOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Coupon Code">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Radio.Group
          onChange={(e) =>
            updateNewCoupon({ ...newCoupon, coupon_type: e.target.value })
          }
          value={newCoupon.coupon_type}
        >
          <Radio value={"percentage"}>Percentage</Radio>
          <Radio value={"amount"}>Amount</Radio>
        </Radio.Group>
        <Input
          value={newCoupon.amount}
          onChange={(e) =>
            updateNewCoupon({ ...newCoupon, amount: e.target.value })
          }
          placeholder="Enter discount amount"
          prefix={
            newCoupon.coupon_type === "amount" ? (
              <DollarCircleOutlined className="site-form-item-icon" />
            ) : (
              <PercentageOutlined className="site-form-item-icon" />
            )
          }
        />
        <DatePicker
          value={newCoupon.expiry_date}
          onChange={(val) =>
            updateNewCoupon({ ...newCoupon, expiry_date: val })
          }
        />
        <SubmitButton onClick={() => handleCouponSubmit()}>Create</SubmitButton>
      </CouponCreateContainer>
      <Table
        rowClassName={(record) =>
          moment(record.expiry_date) < moment.now() ? "expired" : ""
        }
        dataSource={dataSource}
        columns={columns}
      />
    </CouponsContainer>
  );
}

export default Ui;
