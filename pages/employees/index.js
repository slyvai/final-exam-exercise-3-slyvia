import { useContext } from "react";
import { Card } from "antd";
import { AppContext } from "@/context/AppContext";
import EmployeeList from "@/components/EmployeeList";

export async function getServerSideProps() {
  const usersRes = await fetch("https://dummyjson.com/users");
  const usersJson = await usersRes.json();

  const categoriesRes = await fetch("https://dummyjson.com/products/categories");
  const categoriesJson = await categoriesRes.json();

  const employeesWithDepartement = usersJson.users.map((u) => {
    const randomDepartement =
      categoriesJson[Math.floor(Math.random() * categoriesJson.length)];

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
  const { theme } = useContext(AppContext);
  const isDark = theme === "dark";

  return (
    <Card
      title="Employees List"

      headStyle={{
        background: isDark ? "#1f1f1f" : "#ffffff",
        color: isDark ? "#fff" : "#000",   
        borderColor: isDark ? "#333" : "#ddd",
      }}
    >
      <EmployeeList employees={employees} departement={departement} />
    </Card>
  );
}
