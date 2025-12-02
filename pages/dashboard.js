// pages/dashboard.js

import { useEffect, useState, useContext } from "react";
import { Card, Avatar, Row, Col, Skeleton, List, Typography, Button } from "antd";
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
    const router = useRouter();

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

    return (
        <div style={{ padding: 24 }}>
            <Title level={1} style={{ color: theme === "dark" ? "#fff" : "#000" }}>
                Employee Dashboard Overview
            </Title>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }} >

               
                <Col span={24} md={8}>
                    <Card title="Total Employees">
                        <Title level={2} style={{ color: "#1890ff" }}>
                            {totalEmployees}
                        </Title>
                        <Text type="secondary">User count fetched from API.</Text>
                    </Card>
                </Col>

                
                <Col span={24} md={8}>
                    <Card
                        title="Departments List"
                        extra={
                            selectedLocal && (
                                <Text strong type="success">
                                    {selectedLocal} Selected
                                </Text>
                            )
                        }
                    >
                        <List
                            size="small"
                            header={<Text strong>Click a department to filter</Text>}
                            dataSource={departments} 
                            renderItem={(dept) => (
                                <List.Item
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedLocal === dept ? "#e6f7ff" : "transparent",
                                    }}
                                    onClick={() => handleDepartmentSelect(dept.name || dept.slug)} 
                                >
                                    {dept.name || dept.slug} 
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

               
                <Col span={24} md={8}>
                    <Card title="Random Employee Profile">
                        {loadingRandom ? (
                            <Skeleton active avatar paragraph={{ rows: 3 }} />
                        ) : randomEmployee ? (
                            <Card.Meta
                                avatar={<Avatar size={64} src={randomEmployee.image} />} 
                                title={`${randomEmployee.firstName} ${randomEmployee.lastName}`}
                                description={
                                    <>
                                        <p>Email: {randomEmployee.email}</p>
                                        <p>Company: {randomEmployee.company?.name || 'N/A'}</p>
                                        <p>Department: {randomEmployee.company?.department || 'N/A'}</p>
                                        <Button
                                            size="small"
                                            onClick={() => router.push(`/employees/${randomEmployee.id}`)} 
                                        >
                                            View Details
                                        </Button>
                                    </>
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