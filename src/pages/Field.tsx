import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, Select, InputNumber,Upload } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAllFieldByUserId } from '../api/fieldService';
import { message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { uploadImage, deleteImage, addField } from '../api/fieldService';

// const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
// const userId = currentUser.id;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    // render: (value) => value === 'artificial' ? 'Cỏ nhân tạo' : 'Cỏ tự nhiên',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    // render: (value) => `${value} người`,
  },
  {
    title: 'Price(per hour)',
    dataIndex: 'price',
    key: 'price',
    // render: (value) => `${value} VNĐ`,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    // render: (value) => {
    //   if (value === 'active') return 'Đang sử dụng';
    //   if (value === 'maintenance') return 'Bảo trì';
    //   return 'Ngừng hoạt động';
    // },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
   {
    title: 'image',
    dataIndex: 'image',
    key: 'image',
  },
];


export default function Field() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = currentUser.id;
  const [search, setSearch] = useState('');
  const [initialData, setInitialData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  const handleProvinceChange = (provinceCode) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict(null);
    setWards([]);
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then(res => res.json())
      .then(data => setDistricts(data.districts));
  };

  const handleDistrictChange = (districtCode) => {
    setSelectedDistrict(districtCode);
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then(res => res.json())
      .then(data => setWards(data.wards));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(e.target.value);
    setDataSource(
      initialData.filter(
        (item) =>
          item.name.toLowerCase().includes(value) ||
          item.address.toLowerCase().includes(value) ||
          String(item.id).includes(value) ||
          (item.type && item.type.toLowerCase().includes(value)) ||
          (item.size && String(item.size).includes(value)) ||
          (item.price && String(item.price).includes(value)) ||
          (item.status && item.status.toLowerCase().includes(value)) ||
          (item.description && item.description.toLowerCase().includes(value))
      )
    );
  };

  const fetchFields = async () => {
    try {
      console.log(userId);
      const res = await getAllFieldByUserId(userId);
      const initialData = res.data.map(item => ({
        ...item,
        address: `${item.specificAddress}, ${item.ward}, ${item.district}, ${item.province}`,
        status:
          item.status === 1
            ? 'Đang hoạt động'
            : item.status === 0
            ? 'Ngừng hoạt động'
            : item.status === 2
            ? 'Bảo trì'
            : '',
      }));
      setDataSource(initialData);
      setInitialData(initialData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [userId]);

  const handleRefresh = () => {
    setSearch('');
    fetchFields();
  };

  const handleAddField = () => {
    setIsModalOpen(true);
  };

 const handleModalOk = async () => {
  try {
    const values = await form.validateFields();
   
    // Lấy file ảnh từ form
    const file = values.image[0].originFileObj;

    // Đổi tên file ảnh bằng uuid
    const newFileName = `${uuidv4()}${file.name.substring(file.name.lastIndexOf('.'))}`;

    // Tạo FormData để upload ảnh
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', newFileName);

  // Gọi hàm uploadImage để upload ảnh
    const uploadResponse = await uploadImage(formData);


    if (uploadResponse.status !== 200) {
      message.error('Upload image failed!');
      return;
    }

    // Đường dẫn ảnh sau khi upload
    const imagePath = `/imagefield/${newFileName}`;

    const provinceObj = provinces.find(p => p.code == values.province);
    const districtObj = districts.find(d => d.code == values.district);
    const wardObj = wards.find(w => w.code == values.ward);
    let statusValue = 1;
    if (values.status == 'Ngừng hoạt động') statusValue = 0;
    else if (values.status == 'Bảo trì') statusValue = 2;
    else statusValue = 1;
    // Gộp các trường thành 1 object JSON
    const fieldData = {
        name: values.name,
        type: values.type,
        size: values.size,
        price: values.price,
        province: provinceObj ? provinceObj.name : values.province,
        district: districtObj ? districtObj.name : values.district,
        ward: wardObj ? wardObj.name : values.ward,
        specificAddress: values.specificaddress,
        status: statusValue,
        description: values.description,
        userId: userId,
        image: imagePath,
    };
    // Gọi hàm thêm field
    const result = await addField(fieldData);
    // Xử lý tiếp (ví dụ: gọi API addField(fieldData))
    if (result.code == 200) {
      message.success('Successfully created!');
      setIsModalOpen(false);
      form.resetFields();
      fetchFields();
    } else {
      message.error('Create failed!');
      await deleteImage(newFileName);
      console.error(result);
    }
    setIsModalOpen(false);
    form.resetFields();
    fetchFields();
  } catch (err) {
      console.error(err);
      message.error('Failed to add field. Please try again.');
  }
};

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, letterSpacing: 1, marginBottom: 8 }}>FIELD</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Input.Search
            placeholder="Search Field"
            value={search}
            onChange={handleSearch}
            allowClear
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddField}>
            Add Field
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" />

      <Modal
        title="Add Field"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Add"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter field name' }]}>
            <Input />
          </Form.Item>


          <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select field type' }]}
                style={{ flex: 1 }}
              >
                <Select>
                  <Select.Option value="Cỏ tự nhiên">Cỏ tự nhiên</Select.Option>
                  <Select.Option value="Cỏ nhân tạo">Cỏ nhân tạo</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select field status' }]}
                style={{ flex: 1 }}
              >
                <Select>
                  <Select.Option value="Đang sử dụng">Đang sử dụng</Select.Option>
                  <Select.Option value="Bảo trì">Bảo trì</Select.Option>
                  <Select.Option value="Ngừng hoạt động">Ngừng hoạt động</Select.Option>
                </Select>
              </Form.Item>
            </div>
          
         <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="size"
              label="Size"
              rules={[
                { required: true, message: 'Nhập số người' },
                { type: 'integer', min: 1, message: 'Số người phải lớn hơn 0, là số nguyên' },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} step={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: 'Nhập giá' },
                { type: 'number', min: 1, message: 'Giá phải lớn hơn 0' },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} step={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          
          <Form.Item label="Address" required>
  <Input.Group compact>
    <Form.Item
      name="province"
      noStyle
      rules={[{ required: true, message: 'Chọn tỉnh/thành phố' }]}
    >
      <Select
        showSearch
        placeholder="Tỉnh/Thành phố"
        onChange={handleProvinceChange}
        style={{ width: 154 }}
        optionFilterProp="children"
      >
        {provinces.map(p => (
          <Select.Option key={p.code} value={p.code}>{p.name}</Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      name="district"
      noStyle
      rules={[{ required: true, message: 'Chọn quận/huyện' }]}
    >
      <Select
        showSearch
        placeholder="Quận/Huyện"
        onChange={handleDistrictChange}
        value={selectedDistrict}
        disabled={!selectedProvince}
        style={{ width: 154, marginLeft: 5 }}
        optionFilterProp="children"
      >
        {districts.map(d => (
          <Select.Option key={d.code} value={d.code}>{d.name}</Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      name="ward"
      noStyle
      rules={[{ required: true, message: 'Chọn xã/phường' }]}
    >
      <Select
        showSearch
        placeholder="Xã/Phường"
        disabled={!selectedDistrict}
        style={{ width: 154, marginLeft: 5 }}
        optionFilterProp="children"
      >
        {wards.map(w => (
          <Select.Option key={w.code} value={w.code}>{w.name}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  </Input.Group>
</Form.Item>
        <Form.Item name="specificaddress" label="Specific address" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
         
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Form.Item
              name="image"
              label="Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: 'Please upload an image' }]}
              style={{ flex: 1 }}
            >
              <Upload
                name="image"
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // Ngăn upload tự động
              >
                <Button>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Nên chọn ảnh 1280x960</p>
          </div>

        </Form>
      </Modal>
    </div>
  );
}