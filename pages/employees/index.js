import React from 'react';
import { Card } from 'antd';
import EmployeeList from '../../components/EmployeeList'; 


export async function getServerSideProps() {
  const usersRes = await fetch('https://dummyjson.com/users');
  const usersJson = await usersRes.json();

  const categoriesRes = await fetch('https://dummyjson.com/products/categories');
  const categoriesJson = await categoriesRes.json();

  const employeesWithDepartement = usersJson.users.map((u) => {

    const randomDepartement = categoriesJson[Math.floor(Math.random() * categoriesJson.length)]; 
    return {
      ...u,

      departement: randomDepartement.slug, 
    };
  });

  return {
    props: {
      employees: employeesWithDepartement,
      
      departement: categoriesJson, 
    },
  };
}


export default function EmployeesPage({ employees, departement }) {
  return (
    <Card title="Employees List"> 
      <EmployeeList employees={employees} departement={departement} />
    </Card>
  );
}