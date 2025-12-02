import { useRouter } from "next/router";
import { useState } from "react";
import { Skeleton, Card, Button, Modal, Form, Input, message } from "antd";

import EmployeeDetailCard from "../../components/EmployeeDetailCards";

export default function EmployeeDetailPage({ employee }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (router.isFallback) return <Skeleton active />;

  if (!employee) return <p>Employee not found</p>;

  const openEdit = () => setIsModalOpen(true);
  const closeEdit = () => setIsModalOpen(false);

  const onFinish = (values) => {
    message.success("Employee updated ");
    console.log("Updated values:", values);
    closeEdit();
  };

  const onDelete = () => {
    message.success("Employee deleted");
    router.push("/employees"); 
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      
      <EmployeeDetailCard employee={employee} /> 
      
      <Modal title="Edit Employee" open={isModalOpen} onCancel={closeEdit} footer={null}>
        <Form
          layout="vertical"
          initialValues={{
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            address: employee.address?.address,
            phone: employee.phone,
            company: employee.company?.name,
            age: employee.age,
            department: employee.company?.department,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="firstName" label="First Name"><Input /></Form.Item>
          <Form.Item name="lastName" label="Last Name"><Input /></Form.Item>
          <Form.Item name="email" label="Email"><Input /></Form.Item>
          <Form.Item name="age" label="Age"><Input /></Form.Item>
          <Form.Item name="address" label="Address"><Input /></Form.Item>
          <Form.Item name="company" label="Company"><Input /></Form.Item>
          <Form.Item name="department" label="Department"><Input /></Form.Item>
          <Form.Item name="phone" label="Phone"><Input /></Form.Item>

          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </Modal>

      <Card style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openEdit} style={{ marginRight: 8 }}>
          Edit Employee 
        </Button>

        <Button danger onClick={onDelete}>
          Delete Employee
        </Button>

        <Button onClick={() => router.back()} style={{ marginRight: 8 }}>
          Back
        </Button>
      </Card>
    </div>
  );
}


export async function getStaticPaths() {
  const res = await fetch("https://dummyjson.com/users");
  const json = await res.json();

  const paths = json.users.map((u) => ({
    params: { id: u.id.toString() },
  }));

  return {
    paths,
    fallback: true, 
  };
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`https://dummyjson.com/users/${params.id}`);
    const employee = await res.json(); 
    if (!employee || employee.message === "User not found") {
      return { notFound: true };
    }

    return {
      props: { employee }, 
      revalidate: 60,
    };
  } catch (err) {
    return { notFound: true };
  }
}