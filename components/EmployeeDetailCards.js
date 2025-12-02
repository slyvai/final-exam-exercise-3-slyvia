import React from "react";
import { Card, Avatar, Descriptions } from "antd";

export default function EmployeeDetailCard({ employee }) {
  if (!employee) return null;

  return (
    <Card>
      <Card.Meta
        avatar={<Avatar size={96} src={employee.image} />}
        title={`${employee.firstName} ${employee.lastName}`}
        description={employee.email}
      />

      <Descriptions column={1} style={{ marginTop: 16 }}>
        <Descriptions.Item label="Phone">{employee.phone}</Descriptions.Item>
        <Descriptions.Item label="Age">{employee.age}</Descriptions.Item>

        <Descriptions.Item label="Address">
          {employee.address?.address}, {employee.address?.city}
        </Descriptions.Item>

        <Descriptions.Item label="Company">{employee.company?.name}</Descriptions.Item>
        <Descriptions.Item label="Department">{employee.company?.department}</Descriptions.Item> 
        <Descriptions.Item label="University">{employee.university}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}