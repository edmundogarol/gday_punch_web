import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Popconfirm, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
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
  bug_report: "Bug Report",
  report: "Report",
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
      render: (value) => {
        if (value) {
          try {
            const reportDetails = JSON.parse(value);
            return `${reportDetails.content.substring(0, 50)}...`;
          } catch (e) {
            return `${value.substring(0, 50)}...`;
          }
        }
        return "-";
      },
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

  const renderReportDetails = (entry) => {
    const reportDetails = JSON.parse(entry);
    return (
      <div>
        <p>
          <NavLink to={`/stall/${reportDetails.id}/report-view`}>
            {reportDetails.name}
          </NavLink>
        </p>
        {reportDetails.ref ? (
          <p>
            <NavLink to={`/product/${reportDetails.refId}/report-view`}>
              {reportDetails.ref}
            </NavLink>
          </p>
        ) : null}
        <p>{reportDetails.content}</p>
      </div>
    );
  };

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
        {entry.reason === "report" ? (
          renderReportDetails(entry.content)
        ) : (
          <p>{entry.content}</p>
        )}
      </Modal>
    );
  };

  const handleContactEntryOpen = (entry) => {
    return {
      onClick: () => {
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
