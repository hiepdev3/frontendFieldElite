import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, Select, InputNumber, DatePicker } from 'antd';
// import { getAllVouchersByUserId, addVoucher } from '../api/voucherService';
import { message } from 'antd';
import { getAllFieldByUserId } from '../api/fieldService';
import { addVoucher, updateVoucher } from '../api/voucherService';
import { getAllVouchersByUserId } from '../api/voucherService';
// const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
// const userId = currentUser.id;
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { v4 as uuidv4 } from 'uuid';

dayjs.extend(isSameOrAfter);

let previousVoucher = null;


export default function Voucher() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = currentUser.id;
  const [dataSource, setDataSource] = useState([]);
  const [search, setSearch] = useState('');
  const [originaldata, setOriginaldata] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 // let isDeleteModalOpen = false;
 // let currentVoucher = null;
 // let initialData ;

  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [fieldsAdd, setFieldsAdd] = useState([]); 
  //const [fieldsEdit, setFieldsEdit] = useState([]);
  // dùng khi tải trang 
  useEffect(() => {
    fetchVouchers(userId);
  }, [userId]);


  // const handleDelete = (record) => {
  //    const formattedRecord = {
  //     id: record.id,
  //     code: record.code,
  //     discountPercent: record.discountPercent,
  //     membershipTierId: record.membershipTierId,
  //     fieldId: record.fieldId,
  //     fieldName: record.fieldName,
  //     startDate: record.startDate.replace(' ', 'T'),
  //     endDate: record.endDate.replace(' ', 'T'),
  //     quantity: record.quantity,
  //     status: record.status,
  //   };
  //   setCurrentVoucher(formattedRecord);
  //   setIsDeleteModalOpen(true);
  // };
  // tạo bảng
  const columns = [
        {
          title: 'STT',
          key: 'index',
          render: (text, record, index) => index + 1, // Hiển thị số thứ tự (bắt đầu từ 1)
        },
        // {
        //   title: 'ID',
        //   dataIndex: 'id',
        //   key: 'id',
        // },
        {
          title: 'Code',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: 'Discount (%)',
          dataIndex: 'discountPercent',
          key: 'discountPercent',
        },
        {
          title: 'Membership Tier ',
          dataIndex: 'membershipTier',
          key: 'membershipTier',
        },
        {
          title: 'Field Name',
          dataIndex: 'fieldName',
          key: 'fieldName',
        },

        {
          title: 'Start Date',
          dataIndex: 'startDate',
          key: 'startDate',
        },
        {
          title: 'End Date',
          dataIndex: 'endDate',
          key: 'endDate',
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
      },
      
        {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              onClick={() => handleEditVoucher(record)}
              icon={<EditOutlined />}
              size="small"
            >
              Edit
            </Button>
            <Button
              danger
              type="link"
              onClick={() => handleEditVoucher(record)}
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Space>
        ),
      },
      ];
   
  //  lấy list danh sách field    
  const fetchFields = async () => {
      try {
        const res = await getAllFieldByUserId(userId);
        const formattedFields = res.data.map((item) => ({
        id: item.id,
        nameAddress: `${item.name} - ${item.ward}, ${item.district}, ${item.province} ${
          item.status == 1
            ? '- Đang hoạt động'
            : item.status == 0
            ? '- Ngừng hoạt động'
            : item.status == 2
            ? '- Bảo trì'
            : ''
        }`,
      }));
        setFieldsAdd(formattedFields);
      } catch (err) {
        console.error(err);
      }
  };
  // Lấy danh sách voucher theo userId
  const fetchVouchers = async (userId123) => {
  try {
    // Gọi API để lấy danh sách voucher theo userId
    const res = await getAllVouchersByUserId(userId123);

    // Định dạng dữ liệu trả về nếu cần
    const formattedVouchers = res.map((item) => ({
      id: item.id,
      code: item.code,
      discountPercent: item.discountPercent,
      membershipTier: item.membershipTierId == 1
        ? 'Silver'
        : item.membershipTierId == 2
        ? 'Gold'
        : 'Diamond', 
      fieldName : item.fieldName,
      fieldId: item.fieldId,
      userId: item.userId,
      startDate: item.startDate.replace('T', ' '), // Loại bỏ ký tự 'T'
      endDate: item.endDate.replace('T', ' '),   // L
      quantity: item.quantity,
      status:   item.status == 3 ? 'Expired' : 
                item.status == 1 ? 'Active' : 
                item.status == 0 ? 'Inactive' : 
                item.status == 2 ? 'In Use' : 'Unknown',
      }));
      setDataSource(formattedVouchers);
      setOriginaldata(formattedVouchers);
  } catch (err) {
    console.error('Error fetching vouchers:', err);
    message.error('Failed to fetch vouchers. Please try again.');
  }
};

  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase();
      setSearch(value);
      const filteredData = originaldata.filter((item) =>
        item.code.toLowerCase().includes(value) ||
        item.discountPercent.toString().includes(value) ||
        item.membershipTier.toLowerCase().includes(value) ||
        item.fieldName.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value)
      );
      setDataSource(filteredData);

  };

 
  const handleRefresh = () => {
    setSearch('');
    fetchVouchers(userId);
  };

 

  const handleModalAddOk = async () => {
    try {
      const values = await formAdd.validateFields();
      // Lấy giá trị startDate, endDate, và quantity
      const { startDate, endDate, quantity } = values;

      const now = dayjs(); 
      const formattedStartDate = dayjs(startDate);
      const formattedEndDate = dayjs(endDate);

      // Kiểm tra quantity > 0
      if (quantity <= 0) {
        message.error('Quantity must be greater than 0!');
        return;
      }
   
      if (!formattedStartDate.isSameOrAfter(now)) {
        message.error('Start Date must be greater than or equal to the current time!');
        return;
      }

      // Kiểm tra endDate phải lớn hơn startDate
      if (formattedEndDate.isBefore(formattedStartDate)) {
        message.error('End Date must be greater than Start Date!');
        return;
      }

      // Nếu tất cả điều kiện đều đúng, tiếp tục xử lý
      const voucherData = {
        code: values.code,
        discountPercent: values.discountPercent,
        membershipTierId: values.membershipTierId,
        fieldId: values.fieldId,
        userId: userId, // Lấy từ currentUser
        startDate: values.startDate.format('YYYY-MM-DD HH:mm:ss').replace(' ', 'T'),
        endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss').replace(' ', 'T'),
        quantity: values.quantity,
        status: values.status,
      };
      console.log("day la gia tri add thử"+values);
      const result = await addVoucher(voucherData);
      if (result.code == 200) {
          message.success('Voucher added successfully!');
          handleModalCancel();
          handleRefresh();
      } else {
        message.error('Failed to add voucher!');
        return;
       
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleModalCancel = () => {
    formAdd.resetFields();
    setIsAddModalOpen(false);
    formEdit.resetFields();
    setIsEditModalOpen(false);
  };


  const handleAddVoucher = async () => {
      await fetchFields();
      setIsAddModalOpen(true);
      formAdd.setFieldsValue({ code: uuidv4() });
      
  };
  
  const handleEditVoucher = async(record) => {
    
    const formattedRecord = {
      id: record.id,
      code: record.code,
      discountPercent: record.discountPercent,
      membershipTier: record.membershipTier,
      fieldId: record.fieldId,
      fieldName: record.fieldName,
      startDate: dayjs(record.startDate.replace(' ', 'T').replace(".000Z", "")),
      endDate: dayjs(record.endDate.replace(' ', 'T').replace(".000Z", "")),
      quantity: record.quantity,
      status: record.status,
    };

    previousVoucher = formattedRecord;
    formEdit.setFieldsValue(formattedRecord);
    await fetchFields();
    setIsEditModalOpen(true);
    
  };


const handleEditOK = async () => {
  try {
    const values = await formEdit.validateFields();
    const { startDate, endDate, quantity, status } = values;
 
    const now = dayjs(); // Lấy thời gian hiện tại
    // Kiểm tra trạng thái Inactive (status == '0')
    const formattedStartDate = dayjs(startDate);
    const formattedEndDate = dayjs(endDate);

    let membershipTierId = values.membershipTier; // Lấy giá trị ban đầu
      if (membershipTierId === 'Silver') {
        membershipTierId = 1;
      } else if (membershipTierId === 'Gold') {
        membershipTierId = 2;
      } else if (membershipTierId === 'Diamond') {
        membershipTierId = 3;
      }

    let updatedStatus = values.status; // Lấy giá trị ban đầu

    if (status == 'Inactive') {
        updatedStatus = 0;
    } else if (status == 'Active') {
          updatedStatus = 1;
    } else if (status == 'In Use') {
          updatedStatus = 2;
    } else if (status == 'Expired') {
          updatedStatus = 3;
    }
     const voucherData = {
        code: values.code,
        discountPercent: values.discountPercent,
        membershipTierId: membershipTierId,
        fieldId: values.fieldId,
        userId: userId, // Lấy từ currentUser
        startDate: values.startDate.format('YYYY-MM-DD HH:mm:ss').replace(' ', 'T'),
        endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss').replace(' ', 'T'),
        quantity: values.quantity,
        status: updatedStatus,
    };

    if (previousVoucher.status == 'Inactive') {
       if (!formattedStartDate.isAfter(now)) {
          message.error('Start Date must be greater than the current time!');
          return;
        }

        // Kiểm tra endDate phải lớn hơn startDate
        if (!formattedEndDate.isAfter(formattedStartDate)) {
          message.error('End Date must be greater than Start Date!');
          return;
        }

      if (quantity > 0 ) {
        Modal.confirm({
          title: 'Confirm Activation',
          content: 'This voucher still has unused quantity and is not expired. Do you want to activate it?',
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
              const result =  await updateVoucher(voucherData);
                if (result.code == 200) {
                    message.success('Voucher updated successfully!');
                    handleModalCancel();
                    handleRefresh();
                } else {
                  message.error('Failed to update voucher!');
                  return;
                }
          },
        });
        return;
      }
    }

    // Kiểm tra trạng thái Active (status == '1')
    if (previousVoucher.status == 'Active') {
      
      if (quantity > 0) {
        Modal.confirm({
          title: 'Confirm Deactivation',
          content: 'This voucher still has unused quantity. Are you sure you want to deactivate it?',
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
              const result =  await updateVoucher(voucherData);
                if (result.code == 200) {
                    message.success('Voucher updated successfully!');
                    handleModalCancel();
                    handleRefresh();
                } else {
                  message.error('Failed to update voucher!');
                  return;
                }
          },
        });
        return;
      }
    }

    // Kiểm tra trạng thái Expired (status == '4')
    if (previousVoucher.status == 'Expired') {
      
        voucherData.code = uuidv4(); // Tạo mã mới
     
        if (!formattedStartDate.isAfter(now)) {
          message.error('Start Date must be greater than the current time!');
          return;
        }

        // Kiểm tra endDate phải lớn hơn startDate
        if (!formattedEndDate.isAfter(formattedStartDate)) {
          message.error('End Date must be greater than Start Date!');
          return;
        }

        Modal.confirm({
            title: 'Voucher Expired',
            content: 'This voucher has already expired. Do you want to create a similar voucher?',
            okText: 'Create New',
            cancelText: 'Cancel',
            onOk: async () => {
                console.log("day la gia tri add thử", voucherData);
                const result =  await addVoucher(voucherData);
                if (result.code == 200) {
                    message.success('Voucher added successfully!');
                    handleModalCancel();
                    handleRefresh();
                } else {
                  message.error('Failed to add voucher!');
                  return;
                }
            },
          });
        return;
    }      

    // Kiểm tra trạng thái Inuse (status == '3')
    if (previousVoucher.status == 'In Use') {
      if (quantity > 0) {
        Modal.confirm({
          title: 'Confirm Deactivation',
          content: 'This voucher is currently in use and still has unused quantity. Are you sure you want to deactivate it?',
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
              const result =  await updateVoucher(voucherData);
                if (result.code == 200) {
                    message.success('Voucher updated successfully!');
                    handleModalCancel();
                    handleRefresh();
                } else {
                  message.error('Failed to update voucher!');
                  return;
                }
          },
        });
        return;
      }
    }

  
  } catch (err) {
    console.error(err);
    message.error('Failed to update voucher!');
  }
};



  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, letterSpacing: 1, marginBottom: 8 }}>VOUCHER</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Input.Search
            placeholder="Search Voucher"
            value={search}
            onChange={handleSearch}
            allowClear
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVoucher}>
            Add Voucher
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" />
 
      <Modal
        title="Add Voucher"
        open={isAddModalOpen}
        onOk={handleModalAddOk}
        onCancel={handleModalCancel}
        okText="Add"
        destroyOnClose
        width={800}
      >
        <Form form={formAdd} layout="vertical">
          <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Please enter voucher code' }]}>
            <Input />
          </Form.Item>

          {/* Discount (%) và Quantity trên cùng một hàng */}
         <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="discountPercent"
              label="Discount (%)"
              rules={[{ required: true, message: 'Please enter discount percentage' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  { required: true, message: 'Please enter quantity' },
                  { type: 'integer', min: 1, message: 'Quantity must be greater than 0 and an integer' },
                ]}
                style={{ flex: 1 }}
              >
                <InputNumber min={1} step={1} style={{ width: '100%' }} />
          </Form.Item>
          </div>

          {/* Membership Tier và Active trên cùng một hàng */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="membershipTierId"
              label="Membership Tier"
              rules={[{ required: true, message: 'Please select membership tier' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Select Membership Tier">
                <Select.Option value={1}>Silver</Select.Option>
                <Select.Option value={2}>Gold</Select.Option>
                <Select.Option value={3}>Diamond</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select active status' }]}
              style={{ flex: 1 }}
            >
              <Select>
                  <Select.Option value={1}>Active</Select.Option>
                  <Select.Option value={0}>Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="fieldId"
            label="Field"
            rules={[{ required: true, message: 'Please select a field' }]}
          >
            <Select placeholder="Select Field">
              {fieldsAdd.map((field) => (
                <Select.Option key={field.id} value={field.id}>
                  {field.nameAddress}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> 

         <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select start date' }]}
              style={{ flex: 1 }}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'Please select end date' }]}
              style={{ flex: 1 }}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal> 


      <Modal
          title="Edit Voucher"
          open={isEditModalOpen}
          onOk={handleEditOK}
          onCancel={handleModalCancel}
          okText="Save"
          destroyOnClose
          width={800}
        >
          <Form form={formEdit} layout="vertical" >
            <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Please enter voucher code' }]}>
              <Input disabled/>
            </Form.Item>
            <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="discountPercent"
              label="Discount (%)"
              rules={[{ required: true, message: 'Please enter discount percentage' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                { required: true, message: 'Please enter quantity' },
                { type: 'integer', min: 1, message: 'Quantity must be greater than 0 and an integer' },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} step={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

 
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="membershipTier"
              label="Membership Tier"
              rules={[{ required: true, message: 'Please select membership tier' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Select Membership Tier">
                <Select.Option value="Silver">Silver</Select.Option>
                <Select.Option value="Gold">Gold</Select.Option>
                <Select.Option value="Diamond">Diamond</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select active status' }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="fieldId"
            label="Field Name"
            rules={[{ required: true, message: 'Please select a field' }]}
          >
            <Select placeholder="Select Field">
              {fieldsAdd.map((field) => (
                <Select.Option key={field.id} value={field.id}>
                  {field.nameAddress}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>


          <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                    name="startDate"
                    label="Start Date"
                    rules={[{ required: true, message: 'Please select start date' }]}
                    style={{ flex: 1 }}
                  >
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    name="endDate"
                    label="End Date"
                    rules={[{ required: true, message: 'Please select end date' }]}
                    style={{ flex: 1 }}
                  >
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
             </div>
          </Form>
      
        </Modal> 



        {/* <Modal
              title="Delete Voucher"
              open={isDeleteModalOpen}
              onOk={async () => {
                try {
                  // Gọi API xóa voucher
                  await deleteVoucher(currentVoucher.id);
                  message.success('Voucher deleted successfully!');
                  setIsDeleteModalOpen(false);
                  fetchVouchers(); // Refresh dữ liệu
                } catch (err) {
                  console.error(err);
                  message.error('Failed to delete voucher!');
                }
              }}
              onCancel={() => setIsDeleteModalOpen(false)}
              okText="Delete"
              okButtonProps={{ danger: true }}
              destroyOnClose
            >
              <p>Are you sure you want to delete this voucher?</p>
            </Modal> */}
    </div>
  );
}