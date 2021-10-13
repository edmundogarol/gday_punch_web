import React, { useEffect, useState } from "react";
import { Tooltip, Typography, Table, Button, Popconfirm, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

import { ContactsContainer, ActionsContainer } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";

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
  const [showingEntry, updateShowingEntry] = useState(undefined);

  useScrollTop();

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
        <ActionsContainer>
          <Popconfirm
            title="Are you sure to delete this entry?"
            onConfirm={() => deleteContactEntry(instance.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button onClick={(e) => e.stopPropagation()}>
              <DeleteOutlined className="site-form-item-icon" />
            </Button>
          </Popconfirm>
        </ActionsContainer>
      ),
    },
  ];

  const contactEnquiryModal = (entry) => {
    return (
      <Modal
        title={contactReasons[entry.reason]}
        visible={showingEntry}
        onCancel={() => updateShowingEntry(undefined)}
        cancelText="Close"
        okButtonProps={{ style: { display: "none" } }}
      >
        <h4>{entry.name}</h4>
        <p>{entry.email}</p>
        <p>{moment(entry.date_created).format("LL")}</p>
        <br />
        <p>{entry.content}</p>
      </Modal>
    );
  };

  const handleContactEntryOpen = (entry, rowIndex) => {
    return {
      onClick: (event) => {
        updateShowingEntry(entry);
      },
    };
  };

  const dataSource = contactEntries.map((entry, idx) => ({
    key: idx + entry.email,
    ...entry,
  }));

  return (
    <ContactsContainer>
      <Title level={4}>Contact Entries</Title>
      <Table
        onRow={handleContactEntryOpen}
        dataSource={dataSource}
        columns={columns}
      />
      {showingEntry && contactEnquiryModal(showingEntry)}
    </ContactsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
