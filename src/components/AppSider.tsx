import {headerHeight} from './AppHeader.tsx';
import {Menu} from 'antd';
import {Link, useLocation,useNavigate} from 'react-router-dom';
import {
  AppstoreOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DropboxOutlined,
  HistoryOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import {memo} from 'react';
import {useQuery} from "react-query";
import {ApiClient} from "../api/apiClient.ts";
import { getMe } from '../userUI/apiUser/PublicServices';
import {AppUser} from "../types/AppUser.ts";

export const siderWidth = 256;

export const AppSider = memo(() => {

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace(/\/+$/, '');
  const accessToken = sessionStorage.getItem('accessToken');
  const roleId = sessionStorage.getItem('roleid');
  const tierId = sessionStorage.getItem('tierid');
 
   if (!accessToken || !roleId || !tierId) {
    navigate('/login');
    return null; // Trả về null để không render gì khi điều hướng
  }
  if (roleId !== '2' && roleId !== '1') {
      navigate('/login'); 
      return null; 
    }
  // Giả sử `me` được xây dựng từ các giá trị trong sessionStorage
  const me = {
    roles: roleId === '1' ? ['Admin'] : [], // Ví dụ: roleId = 1 là SuperAdmin
  };

  return (
    <Sider
      width={siderWidth}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        marginTop: headerHeight,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[['', '/'].includes(pathname) ? '/' : pathname]}
        defaultOpenKeys={['/inventory']}
        style={{
          paddingTop: 16,
          borderRight: '1px solid rgba(10, 10, 10, 0.1)',
          height: '100%',
        }}
        items={[
          {
              label: <Link to="/Dashboard">Dashboard</Link>,
              key: '/Dashboard',
              icon: <DashboardOutlined/>,
          },
          {
            label: <Link to="/sales">Sales</Link>, key: '/sales', icon: <ShoppingCartOutlined/>,
          },
          {
            label: <Link to="/sales-history">Sales History</Link>, key: '/sales-history', icon: <HistoryOutlined/>,
          },
          {
            type: 'divider',
          },
          {
            label: 'Inventory',
            key: '/inventory',
            icon: <DatabaseOutlined/>,
            children: [

              {
                label: <Link to="/field">Fields</Link>,
                key: '/field',
                icon: <AppstoreOutlined />,
              },
                {
                label: <Link to="/voucher">Vouchers</Link>,
                key: '/voucher',
                icon: <AppstoreOutlined />,
              },
              {
                label: <Link to="/products">Products</Link>,
                key: '/products',
                icon: <DropboxOutlined/>,
              },
              {
                label: <Link to="/categories">Categories</Link>,
                key: '/categories',
                icon: <AppstoreOutlined/>,
              },
              {
                label: <Link to="/vendors">Vendors</Link>,
                key: '/vendors',
                icon: <ShopOutlined/>,
              }],
          },
          {
            type: 'divider',
          },
          {
            label: <Link to="/admins">Admins</Link>,
            key: '/admins',
            icon: <SolutionOutlined/>,
            style: {display: me ? (me.roles.includes('SuperAdmin') ? '' : 'none') : 'none'}
          },
          {label: <Link to="/customers">Customers</Link>, key: '/customers', icon: <UserOutlined/>},
          {
            label: <Link to="/manage-account">Manage Account</Link>,
            key: '/manage-account',
            icon: <SolutionOutlined />,
            style: { display: roleId == '1' ? '' : 'none' }, // Chỉ hiển thị nếu roleId = 1
          },
        ]}
      />
    </Sider>
  );
});