import { useEffect, useState, useContext } from "react";
import {
    Card,
    Avatar,
    Row,
    Col,
    Skeleton,
    List,
    Typography,
    Button,
    Pagination
} from "antd";
import { AppContext } from "../context/AppContext";
import { useRouter } from "next/router";

const { Title, Text } = Typography;

export async function getServerSideProps() {
    try {
        const totalUsersRes = await fetch("https://dummyjson.com/users");
        const totalUsersJson = await totalUsersRes.json();
        const totalEmployees = totalUsersJson.total || 0;

        const categoriesRes = await fetch("https://dummyjson.com/products/categories");
        const categoriesJson = await categoriesRes.json();
        const departments = categoriesJson;

        return {
            props: {
                totalEmployees,
                departments,
            },
        };
    } catch (error) {
        console.error("Dashboard SSR Error:", error);
        return { props: { totalEmployees: 0, departments: [] } };
    }
}

export default function Dashboard({ totalEmployees, departments }) {
    const { selectedDepartement, setSelectedDepartement, theme } = useContext(AppContext);

    const [randomEmployee, setRandomEmployee] = useState(null);
    const [loadingRandom, setLoadingRandom] = useState(true);

    const [selectedLocal, setSelectedLocal] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6; 
    const router = useRouter();

    const paginatedDepts = departments.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    useEffect(() => {
        if (selectedDepartement) setSelectedLocal(selectedDepartement);
    }, [selectedDepartement]);

    useEffect(() => {
        async function fetchRandomEmployee() {
            setLoadingRandom(true);
            try {
                const randomId = Math.floor(Math.random() * 100) + 1;
                const res = await fetch(`https://dummyjson.com/users/${randomId}`);
                const json = await res.json();
                setRandomEmployee(json);
            } catch (err) {
                console.error("Random employee fetch error:", err);
            } finally {
                setLoadingRandom(false);
            }
        }
        fetchRandomEmployee();
    }, []);

    const handleDepartmentSelect = (departmentString) => {
        setSelectedDepartement(departmentString);
        setSelectedLocal(departmentString);
        router.push("/employees");
    };

    const isDark = theme === "dark";

    const pageStyle = {
        padding: 24,
        backgroundColor: isDark ? "#1f1f1f" : "#f5f5f5",
        minHeight: "100vh",
    };

    const cardStyle = {
        backgroundColor: isDark ? "#141414" : "#fff",
        color: isDark ? "#fff" : "#000",
        border: isDark ? "1px solid #333" : "1px solid #f0f0f0",
    };

    const listItemStyle = (dept) => ({
        cursor: "pointer",
        backgroundColor:
            selectedLocal === dept.slug
                ? isDark
                    ? "#264d73"
                    : "#e6f7ff"
                : "transparent",
        color: isDark ? "#fff" : "#000",
        padding: "8px 12px",
        borderRadius: 6,
    });

    return (
        <div style={pageStyle}>
            <Title level={1} style={{ color: isDark ? "#fff" : "#000" }}>
                Employee Dashboard Overview
            </Title>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>

                {/* Total Employees */}
                <Col span={24} md={8}>
                    <Card title="Total Employees" style={cardStyle} headStyle={{ color: isDark ? "#fff" : "#000" }}>
                        <Title level={2} style={{ color: "#1890ff" }}>
                            {totalEmployees}
                        </Title>
                        <Text type="secondary" style={{ color: isDark ? "#bbb" : "#666" }}>
                            User count fetched from API.
                        </Text>
                    </Card>
                </Col>

                {/* Departments with Pagination */}
                <Col span={24} md={8}>
                    <Card
                        title="Departments List"
                        style={cardStyle}
                        headStyle={{ color: isDark ? "#fff" : "#000" }}
                        extra={
                            selectedLocal && (
                                <Text strong type="success" style={{ color: "#73d13d" }}>
                                    {selectedLocal} Selected
                                </Text>
                            )
                        }
                    >
                        <List
                            size="small"
                            dataSource={paginatedDepts}
                            renderItem={(dept) => (
                                <List.Item
                                    style={listItemStyle(dept)}
                                    onClick={() => handleDepartmentSelect(dept.slug)}
                                >
                                    {dept.name || dept.slug}
                                </List.Item>
                            )}
                        />

                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={departments.length}
                            onChange={(page) => setCurrentPage(page)}
                            style={{ marginTop: 16, textAlign: "center" }}
                        />
                    </Card>
                </Col>

                {/* Random Employee */}
                <Col span={24} md={8}>
                    <Card title="Random Employee Profile" style={cardStyle} headStyle={{ color: isDark ? "#fff" : "#000" }}>
                        {loadingRandom ? (
                            <Skeleton active avatar paragraph={{ rows: 3 }} />
                        ) : randomEmployee ? (
                            <Card.Meta
                                avatar={<Avatar size={64} src={randomEmployee.image} />}
                                title={
                                    <span style={{ color: isDark ? "#fff" : "#000" }}>
                                        {randomEmployee.firstName} {randomEmployee.lastName}
                                    </span>
                                }
                                description={
                                    <div style={{ color: isDark ? "#bbb" : "#444" }}>
                                        <p>Email: {randomEmployee.email}</p>
                                        <p>Company: {randomEmployee.company?.name || "N/A"}</p>
                                        <p>Department: {randomEmployee.company?.department || "N/A"}</p>
                                        <Button
                                            size="small"
                                            onClick={() => router.push(`/employees/${randomEmployee.id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                }
                            />
                        ) : (
                            <Text type="danger">Failed to load random employee.</Text>
                        )}
                    </Card>
                </Col>

            </Row>
        </div>
    );
}
