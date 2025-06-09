import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import {getAllUsersForAdmin,editAccountForAdmin} from '../api/adminService'; // Import API service
import { message } from 'antd';
import { Modal, Form, Select } from 'antd';



export default function ManageAccount() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<any>(null);


    useEffect(() => {
      const roleId = sessionStorage.getItem('roleid');
      if (roleId === '1') {
        fetchUsersForAdmin();
      } else {
        message.error('You do not have permission to access this page.');
      }
    }, []);

    const fetchUsersForAdmin = async () => {
      try {
        const response = await getAllUsersForAdmin();
         setData(response.data.data.map((user: any, index: number) => ({
            key: user.id, // Sử dụng ID của người dùng làm key
            fullName: user.fullName, // Cột Full Name
            email: user.email,       // Cột Email
            role: user.role,         // Cột Role
            tier: user.tier,         // Cột Tier
            totalAmount: user.totalAmount, // Cột Total Amount
            status: user.status,     // Cột Status
            id: user.id, // Lưu ID để sử dụng trong các thao tác khác
          })));
      } catch (error) {
        console.error('Failed to fetch users:', error);
        message.error('Failed to fetch users. Please try again.');
      }
    };
  // Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

 const filteredData = data.filter(
    (item) =>
      (item.fullName && item.fullName.toLowerCase().includes(searchText)) ||
      (item.email && item.email.toLowerCase().includes(searchText)) ||
      (item.role && item.role.toLowerCase().includes(searchText))
  );

  // Cột của bảng
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
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
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString()} VND`, // Hiển thị số tiền với định dạng
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Active' : 'Inactive'), // Hiển thị trạng thái
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record.key)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Xử lý thêm tài khoản
  // const handleAdd = () => {
  //   console.log('Add Account');
  //   // Thêm logic thêm tài khoản ở đây
  // };

   const handleEdit = (key: string) => {
      const record = data.find((item) => item.key === key);
      if (record) {
        setCurrentRecord(record); // Lưu toàn bộ record, bao gồm cả key
        const { key: _, ...formValues } = record; // Loại bỏ key trước khi set vào form
        editForm.setFieldsValue(formValues); // Điền dữ liệu vào form (không bao gồm key)
        setIsEditModalOpen(true); // Hiển thị modal
      } else {
        message.error('Record not found.');
      }
    };


    const handleEditSubmit = async () => {
      try {
        const values = await editForm.validateFields(); // Lấy giá trị từ form
        const payload = { ...values, key: currentRecord.key }; // Kết hợp giá trị từ form với key
        console.log('Submitting edit for record:', payload);
        const response = await editAccountForAdmin(payload);
        if (response.data.code === 200) {
          message.success('Account updated successfully!');
          const updatedData = data.map((item) =>
            item.key === currentRecord.key ? { ...item, ...values } : item
          );
          setData(updatedData); // Cập nhật state data
          setIsEditModalOpen(false); // Đóng modal sau khi cập nhật thành công
      
        } else {
          message.error('Failed to update account. Please try again.');
        }
      } catch (error) {
        console.error('Error updating account:', error);
        message.error('An error occurred while updating the account.');
      }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false); // Đóng modal
    editForm.resetFields(); // Xóa dữ liệu trong form
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Accounts</h1>
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Account
        </Button> */}
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

    <Modal
      title="Edit Account"
      open={isEditModalOpen}
      onOk={handleEditSubmit}
      onCancel={handleEditCancel}
      okText="Save"
      cancelText="Cancel"
    >
  <Form form={editForm} layout="vertical">
    {/* Full Name và Email trên cùng một hàng */}
    <div style={{ display: 'flex', gap: '16px' }}>
      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[{ required: true, message: 'Please enter full name' }]}
        style={{ flex: 1 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        style={{ flex: 1 }}
      >
        <Input />
      </Form.Item>
    </div>

    {/* Role và Tier trên cùng một hàng */}
    <div style={{ display: 'flex', gap: '16px' }}>
      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select role' }]}
        style={{ flex: 1 }}
      >
          <Select>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Manager">Manager</Select.Option>
            <Select.Option value="Customer">Customer</Select.Option>
          </Select>
      </Form.Item>
        <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select status' }]}
        style={{ flex: 1 }}
      >
        <Select>
          <Select.Option value={true}>Active</Select.Option>
          <Select.Option value={false}>Inactive</Select.Option>
        </Select>
      </Form.Item>
    </div>

    {/* Total Amount và Status trên cùng một hàng */}
    <div style={{ display: 'flex', gap: '16px' }}>
      <Form.Item
        name="totalAmount"
        label="Total Amount"
        rules={[{ required: true, message: 'Please enter total amount' }]}
        style={{ flex: 1 }}
        >
        <Input />
      </Form.Item>
        <Form.Item
        name="tier"
        label="Tier"
        rules={[{ required: true, message: 'Please select tier' }]}
        style={{ flex: 1 }}
      >
        <Select>
          <Select.Option value="Silver">Silver</Select.Option>
          <Select.Option value="Gold">Gold</Select.Option>
          <Select.Option value="Diamond">Diamond</Select.Option>
        </Select>
      </Form.Item>
     
    </div>
  </Form>
</Modal>

    </div>
  );
}