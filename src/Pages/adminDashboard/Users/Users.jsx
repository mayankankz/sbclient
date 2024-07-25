import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../utils/constant";
import axios from "axios";
import { toast } from "react-toastify";
import { Space, Table } from "antd";
import { Edit } from "@mui/icons-material";
import EditUser from "./EditUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const toggle = () => {
    setOpenEdit(!openEdit);
    setUserData({});
  };
  const colums = [
    { title: "User Name", dataIndex: "username", key: "username", width: 150 },

    {
      title: "School Name",
      dataIndex: "Schoolname",
      key: "Schoolname",
      width: 150,
      ellipsis: true,
    },
    {
      title: "School Code",
      dataIndex: "schoolcode",
      key: "schoolcode",
      width: 150,
    },

    {
      title: "Validation Options",
      dataIndex: "validationoptions",
      key: "validationoptions",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <a>{record.createdAt.split("T")[0]}</a>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 50,
      render: (_, record) => (
        <Space size="middle">
          <Edit onClick={() => handleEdit(record)} />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await axios.get(`${apiUrl}/user/getallusers`);
        setUsers(users.data.data);
      } catch (error) {
        toast.error("Something went wrong fetching users.");
      }
    }
    fetchUsers();
  }, []);
  function handleEdit(stu) {
    setUserData(stu);
    setOpenEdit(true);
  }
  return (
    <div style={{ padding: "20px" }}>
      <h4>Manage Users</h4>
      <Table
        dataSource={users}
        columns={[...colums]}
        rowKey="userid"
        bordered
        style={{ overflowX: "scroll" }}
        pagination={true}
        size="large"
      />
      {openEdit && (
        <EditUser
          isOpen={openEdit}
          toggle={toggle}
          studentsData={userData}
          validationOptions={colums}
        />
      )}
    </div>
  );
};

export default Users;
