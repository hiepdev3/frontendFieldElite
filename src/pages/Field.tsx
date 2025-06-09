import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, Select, InputNumber,Upload } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAllFieldByUserId, deleteField, editField } from '../api/fieldService';
import { message,Checkbox } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { uploadImageToCloudinary, addField } from '../api/fieldService';


// const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
// const userId = currentUser.id;




export default function Field() {
  const userId = sessionStorage.getItem('userid') ; 
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFieldId, setDeleteFieldId] = useState(null);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50, 
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: 'Loại cỏ',
    dataIndex: 'type',
    key: 'type',
    width: 120, 
    // render: (value) => value === 'artificial' ? 'Cỏ nhân tạo' : 'Cỏ tự nhiên',
  },
  {
    title: 'Kích thước',
    dataIndex: 'size',
    key: 'size',
    width: 100,
    // render: (value) => `${value} người`,
  },
  {
    title: 'Giá (theo giờ) VNĐ',
    dataIndex: 'price',
    key: 'price',
    width: 150, 
    // render: (value) => `${value} VNĐ`,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
     width: 300,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: 50, 
    // render: (value) => {
    //   if (value === 'active') return 'Đang sử dụng';
    //   if (value === 'maintenance') return 'Bảo trì';
    //   return 'Ngừng hoạt động';
    // },
  },
  // {
  //   title: 'Description',
  //   dataIndex: 'description',
  //   key: 'description',
  // },
  {
    title: 'Hình ảnh',
    dataIndex: 'image',
    key: 'image',
    width: 150, 
    render: (image) => (
    <img
        src={image}
        alt="Field Image"
        style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
      />
    ),
  },
  {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
];

    const handleEditField = async () => {
      try {
        const values = await form.validateFields();

        let imagePath = form.getFieldValue('image'); // Lấy đường dẫn ảnh hiện tại từ form

        // Kiểm tra nếu người dùng upload ảnh mới
        if (values.image && values.image[0]?.originFileObj) {
          const file = values.image[0].originFileObj; // Lấy file ảnh mới
          imagePath = await uploadImageToCloudinary(file); // Upload ảnh mới lên Cloudinary
          console.log('Image uploaded to:', imagePath);
        }

        const provinceObj = provinces.find(p => p.code == values.province);
        const districtObj = districts.find(d => d.code == values.district);
        const wardObj = wards.find(w => w.code == values.ward);

        let statusValue = 1;
        if (values.status === 'Ngừng hoạt động') statusValue = 0;
        else if (values.status === 'Bảo trì') statusValue = 2;

        const updatedField = {
          name: values.name,
          type: values.type,
          size: values.size,
          price: values.price,
          province: provinceObj ? provinceObj.name : values.province,
          district: districtObj ? districtObj.name : values.district,
          ward: wardObj ? wardObj.name : values.ward,
          specificAddress: values.specificAddress,
          status: statusValue,
          description: values.description,
          image: imagePath, // Sử dụng ảnh mới hoặc giữ nguyên ảnh cũ
          id: form.getFieldValue('id'), // Lấy ID từ form
        };
        console.log(updatedField);
        const response = await editField(updatedField.id, updatedField); // Gọi API chỉnh sửa
        
        if (response.data.code === 200) {
          message.success('Field updated successfully!');
          setIsEditModalOpen(false);
          fetchFields(); // Cập nhật lại danh sách
        } else {
          message.error('Failed to update field. Please try again.');
        }
      } catch (error) {
        console.error('Error updating field:', error);
        message.error('An error occurred while updating the field.');
      }
    };
  
    const handleDelete = (id) => {
      setDeleteFieldId(id); // Lưu ID của sân cần xóa
      form.resetFields(); // Đặt lại trạng thái form để đảm bảo checkbox chưa được tích
      setIsDeleteModalOpen(true); // Hiển thị modal xác nhận xóa
    };
   const confirmDelete = async () => {
      try {
        const values = await form.validateFields(); // Kiểm tra xem checkbox đã được tích chưa
        if (!values.agree) {
          message.error('Bạn phải đồng ý với chính sách để tiếp tục.');
          return; // Ngăn không cho đóng modal
        }

        const response = await deleteField(deleteFieldId); // Sử dụng ID sân đã lưu để xóa
        if (response.data.code === 200) {
          message.success('Field deleted successfully!');
          fetchFields(); // Cập nhật lại danh sách sau khi xóa
          setIsDeleteModalOpen(false); // Đóng modal sau khi xử lý xong
          setDeleteFieldId(null); // Xóa ID sân đã lưu
        } else {
          message.error('Failed to delete field. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting field:', error);
        message.error('An error occurred while deleting the field.');
      }
};

  const handleEdit = (record) => {
    form.setFieldsValue(record); // Điền dữ liệu của record vào form
    setIsEditModalOpen(true); // Hiển thị modal chỉnh sửa
  };
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
      
      const res = await getAllFieldByUserId(userId);
      const initialData = res.data.data.map(item => ({
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
      console.log('Fetched fields:', initialData);
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
    const imagePath = await uploadImageToCloudinary(file);
    console.log('Image uploaded to:', imagePath);

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
    if (result.data.code == 200) {
      message.success('Successfully created!');
      setIsModalOpen(false);
      form.resetFields();
      fetchFields();
    } else {
      message.error('Create failed!');
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
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddField}>
            Thêm sân
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
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Please enter field name' }]}>
            <Input />
          </Form.Item>
          <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="type"
                label="Loại cỏ"
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
                label="Trạng thái"
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
              label="Kích thước"
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
              label="Giá theo giờ"
              rules={[
                { required: true, message: 'Nhập giá' },
                { type: 'number', min: 1, message: 'Giá phải lớn hơn 0' },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} step={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          
          <Form.Item label="Địa chỉ" required>
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
        <Form.Item name="specificaddress" label="Địa chỉ cụ thể" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
         
          <Form.Item name="description" label="Mô tả">
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



      <Modal
  title="Edit Field"
  open={isEditModalOpen}
  onOk={handleEditField} 
  onCancel={() => {
    setIsEditModalOpen(false);
    form.resetFields(); // Xóa dữ liệu trong form khi đóng modal
  }}
  okText="Save"
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
          rules={[{ required: true, message: 'Please enter field size' }]}
          style={{ flex: 1 }}
        >
      <InputNumber min={1} step={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter field price' }]}
          style={{ flex: 1 }}
        >
          <InputNumber min={1} step={1} style={{ width: '100%' }} />
        </Form.Item>
      </div>

     <Form.Item label="Địa chỉ" required>
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

    <Form.Item name="specificAddress" label="Địa chỉ cụ thể" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Form.Item label="Image">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Hiển thị ảnh hiện tại */}
            <img
              src={form.getFieldValue('image')} // Lấy đường dẫn ảnh từ form
              alt="Current Field Image"
              style={{ width: '100px', height: 'auto', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            {/* Nút upload ảnh mới */}
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                form.setFieldsValue({ image: file }); // Lưu file trực tiếp vào form
                return false; // Ngăn upload tự động
              }}
            >
              <Button type="primary">Upload New Image</Button>
            </Upload>
          </div>
        </Form.Item>
      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Nên chọn ảnh 1280x960</p>
    </div>


    </Form>
    </Modal>

    <Modal
      title="Xác nhận xóa sân"
      open={isDeleteModalOpen}
      onOk={confirmDelete} // Gọi hàm xóa khi nhấn "OK"
      onCancel={() => setIsDeleteModalOpen(false)} // Đóng modal khi nhấn "Cancel"
      okText="Xóa"
      cancelText="Hủy"
    >
      <Form form={form}>
        <p>Bạn có chắc chắn muốn xóa sân này không?</p>
        <p>Nếu sân đã được đặt, bạn chấp nhận chính sách hoàn tiền của chúng tôi.</p>
        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[{ required: true, message: 'Bạn phải đồng ý với chính sách để tiếp tục.' }]}
        >
          <Checkbox>Tôi đồng ý với chính sách hoàn tiền</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
    </div>
  );
}