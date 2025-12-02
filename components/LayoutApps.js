import React, { useContext, useState, useEffect } from 'react';
import { Layout, Menu, Switch, Typography, Skeleton, Button, Modal, Input } from 'antd';
import Link from 'next/link';
import { AppContext } from '../context/AppContext';
import { useRouter } from "next/router";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AppLayout({ children }) {
  const { theme, userName, setTheme, isLoggedIn, setIsLoggedIn, setUserName } = useContext(AppContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const isDark = theme === "dark";

  const toggleTheme = (checked) => setTheme(checked ? 'dark' : 'light');

  const handleLogout = () => {
    setUserName("");
    setIsLoggedIn(false);
  };

  const openLoginModal = () => {
    setLoginModalVisible(true);
  };

  const closeLoginModal = () => {
    setLoginModalVisible(false);
  };

  const handleLoginSubmit = () => {
    if (!userName.trim()) return;
    setIsLoggedIn(true);
    setLoginModalVisible(false);
  };

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  const layoutStyle = {
    minHeight: "100vh",
    background: isDark ? "#0d0d0d" : "#f0f2f5",
    color: isDark ? "#fff" : "#000",
  };

  const headerStyle = {
    background: isDark ? "#141414" : "#fff",
    paddingLeft: 24,
    borderBottom: isDark ? "1px solid #333" : "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const contentStyle = {
    margin: 24,
    padding: 24,
    background: isDark ? "#1f1f1f" : "#fff",
    color: isDark ? "#fff" : "#000",
    borderRadius: 8,
    minHeight: "80vh",
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Layout style={layoutStyle}>
        <Sider theme={theme} width={220}>
          <div
            style={{
              padding: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Title level={4} style={{ color: isDark ? "#fff" : "#000", margin: 0 }}>
              Employees List
            </Title>
          </div>

          <Menu theme={theme} mode="inline" defaultSelectedKeys={["dashboard"]}>
            <Menu.Item key="dashboard">
              <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="employees">
              <Link href="/employees">Employees</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Header style={headerStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingRight: 20,
              }}
            >
              <Title level={4} style={{ margin: 15, color: isDark ? "#fff" : "#000" }}>
                {isLoggedIn ? `Welcome, ${userName}` : "You are not logged in"}
              </Title>

              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ color: isDark ? "#fff" : "#000", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>Theme</span>
                  <Switch checked={isDark} onChange={toggleTheme} />
                </div>

                {/* LOGIN / LOGOUT BUTTON */}
                {!isLoggedIn ? (
                  <Button type="primary" onClick={openLoginModal}>
                    Login
                  </Button>
                ) : (
                  <Button danger onClick={handleLogout}>Logout</Button>
                )}
              </div>
            </div>
          </Header>

          <Content style={contentStyle}>
            {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : children}
          </Content>
        </Layout>
      </Layout>


      <Modal
        title="Login"
        open={loginModalVisible}
        onCancel={closeLoginModal}
        onOk={handleLoginSubmit}
        okButtonProps={{
          disabled: !userName || userName.trim() === "",
        }}
      >
        <p>Enter your name to continue:</p>
        <Input
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </Modal>
    </div>
  );
}
