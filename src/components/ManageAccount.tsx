import React, { useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

export default function ManageAccount() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([
    {
      key: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'SuperAdmin',
    },
    {
      key: '2',
      username: 'manager',
      email: 'manager@example.com',
      role: 'Manager',
    },
    {
      key: '3',
      username: 'user1',
      email: 'user1@example.com',
      role: 'User',
    },
  ]);

  // Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const filteredData = data.filter(
    (item) =>
      item.username.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText) ||
      item.role.toLowerCase().includes(searchText)
  );

  // Cột của bảng
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record.key)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Xử lý thêm tài khoản
  const handleAdd = () => {
    console.log('Add Account');
    // Thêm logic thêm tài khoản ở đây
  };

  // Xử lý chỉnh sửa tài khoản
  const handleEdit = (key: string) => {
    console.log('Edit Account:', key);
    // Thêm logic chỉnh sửa tài khoản ở đây
  };

  // Xử lý xóa tài khoản
  const handleDelete = (key: string) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    console.log('Delete Account:', key);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Accounts</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Account
        </Button>
      </div>
      <Input
        placeholder="Search by username, email, or role"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        className="mb-4"
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />
    </div>
  );
}