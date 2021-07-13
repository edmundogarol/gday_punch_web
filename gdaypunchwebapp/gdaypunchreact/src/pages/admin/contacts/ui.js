import React, { useEffect } from "react";
import { Tooltip, Typography, Table, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

import { ContactsContainer } from "./styles";

const { Title } = Typography;

const contactReasons = {
  general: "General Enquiry",
  order: "Order Enquiry",
  advertising: "Advertising Enquiry",
  subscription: "Subscription Enquiry",
  subscription_cancellation: "Cancel Subscription",
  unsubscribe: "Email Unsubscribe",
};

function Ui(props) {
  const { contactsState, fetchContactEntries, deleteContactEntry } = props;
  const {
    contactEntries,
    fetchingContactEntries,
    finishedFetchingContactEntries,
  } = contactsState;

  useEffect(() => {
    if (!fetchingContactEntries && !finishedFetchingContactEntries) {
      fetchContactEntries();
    }
  }, [fetchingContactEntries, finishedFetchingContactEntries]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date_created",
      key: "date_created",
      render: (value) => (value ? moment(value).format("LL") : "-"),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (value) => (value ? `${value.substring(0, 50)}...` : "-"),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (value) => contactReasons[value],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Edit",
      render: (value, instance) => (
        <>
          <Popconfirm
            title="Are you sure to delete this entry?"
            onConfirm={() => deleteContactEntry(instance.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Contact Entry">
              <Button>
                <DeleteOutlined className="site-form-item-icon" />
              </Button>
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ];

  const dataSource = contactEntries.map((entry, idx) => ({
    key: idx + entry.email,
    ...entry,
  }));

  return (
    <ContactsContainer>
      <Title level={4}>Contact Entries</Title>
      <Table dataSource={dataSource} columns={columns} />
    </ContactsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
