import React, { useState } from 'react';
import logo from '../../assets/img/1.png';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  EditOutlined, HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, ConfigProvider, Button, Tooltip } from 'antd';
import { LogoutOutlined } from '@mui/icons-material';
import { logout } from '../../store/reducer/portFolioReducer';
import { useDispatch } from 'react-redux';
import { persistor } from '../../main';


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
  getItem('Editor', '2', <EditOutlined />, null, '/admin/editor'),
  getItem('Student', 'sub1', <UserOutlined />, [
    getItem('Add Student', '3', null, null, '/admin/addstudent'),
    getItem('Generate ID Cards', '4', null, null, '/admin/studentlist'),
    getItem('Check List', '5', null, null, '/admin/checklist'),
  ], '/admin/user'),
  getItem('Create School', '9', <HomeOutlined />, null, '/admin/create-school'),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Custom theme configuration
  const customTheme = {
    token: {
      colorPrimary: '#e33931',
      colorBgContainer: '#e33931',
    },
    components: {
      Menu: {
        colorItemBg: '#e33931;', // Background color for the menu items
        colorItemText: '#ffffff', // Text color for the menu items
        colorItemTextHover: '#ffffff', // Text color for the hovered menu item
        colorItemBgHover: '#D83632', // Background color for the hovered menu item
        colorItemBgSelected: '#D83632', // Background color for the selected menu item
        colorItemTextSelected: '#ffffff', // Text color for the selected menu item
      },
    },
  };
  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");
  const dispatch = useDispatch();
  function handleLogout() {
    localStorage.removeItem('auth');
    dispatch(logout())
    persistor.purge()

  }
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#EB3E35' } }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical d-flex justify-content-center">
            <img height={100} width={100} src={logo} alt="Logo" />
          </div>
          <div className='d-flex justify-content-center mt-2'>
            <p className="text-light fs-8">SB ONLINE SERVICES</p>
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer,textAlign: 'end' }}>
            
            <Tooltip title="Logout">
              <Button style={{
                fontSize: '16px',
                width: 40,
                height: 40,
                marginRight: 30
              }} 
              shape="circle"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              />
            </Tooltip>

          </Header>
          <Content style={{ padding: '20px' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;
