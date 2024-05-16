
  import React, { useState } from 'react';
  import logo from '../../assets/img/1.png'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom'; 
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children, to) {
  return {
    key,
    icon,
    children,
    label: <Link to={to}>{label}</Link>,
  };
}

const items = [
  getItem('Dashboard', '1', <PieChartOutlined />, null, '/admin/'),
  getItem('Editor', '2', <DesktopOutlined />, null, '/admin/editor'),
  getItem('Student', 'sub1', <UserOutlined />, [
    getItem('Add Student', '3', null, null, '/admin/addstudent'),
    getItem('Student List', '4', null, null, '/admin/studentlist'),
    getItem('Check List', '5', null, null, '/admin/checklist'),
  ], '/admin/user'),
  
  getItem('Create School', '9', <FileOutlined />, null, '/admin/create-school'),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical d-flex justify-content-center">
        <img height={100} width={100} src={logo} alt="" />
        </div>
        <div className='d-flex justify-content-center mt-2'>
        <p className="text-light fs-8">SB ONLINE SERVICES</p>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        
        <Content
          style={{
            padding: '20px',
          }}
        >
          
          <Outlet />
        </Content>
        
       
      </Layout>
    </Layout>
  );
};
export default AdminLayout;