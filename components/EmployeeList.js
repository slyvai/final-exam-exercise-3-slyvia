import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Switch,
  List,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppContext } from "../context/AppContext";

export default function EmployeeList({ employees, departement }) {

  const { selectedDepartement, theme } = useContext(AppContext);

  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState('');
  const [data, setData] = useState(employees || []);
  const [usePagination, setUsePagination] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  const isDark = theme === "dark";

  useEffect(() => {
    if (selectedDepartement) setSelected(selectedDepartement);
  }, [selectedDepartement]);

  // Filtering
  useEffect(() => {
    let filtered = employees || [];

    if (searchText) {
      filtered = filtered.filter((s) => {
        const full = `${s.firstName} ${s.lastName}`.toLowerCase();
        return full.includes(searchText.toLowerCase());
      });
    }

    if (selected) {
      filtered = filtered.filter((s) => s.departement === selected);
    }

    setData(filtered);
  }, [searchText, selected, employees]);

  const loadMore = () => setVisibleCount((prev) => prev + 20);

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'University', dataIndex: 'university', key: 'university' },
    {
      title: 'Department',
      key: 'departement',
      render: (_, record) => record.departement || '-',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Link href={`/employees/${record.id}`}>
          <Button type="primary">View Details</Button>
        </Link>
      ),
    },
  ];

 
  const pageStyle = {
    padding: 24,
    backgroundColor: isDark ? "#141414" : "#f5f5f5",
    minHeight: "100vh",
    color: isDark ? "#fff" : "#000",
  };

  const darkCard = {
    backgroundColor: isDark ? "#1f1f1f" : "#fff",
    color: isDark ? "#fff" : "#000",
    border: isDark ? "1px solid #333" : "1px solid #f0f0f0",
  };


  return (
    <div style={pageStyle}>
      <Space style={{ marginBottom: 16 }}>

        <Input
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            background: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#000",
            borderColor: isDark ? "#555" : "#d9d9d9",
          }}
        />

        <Select
          placeholder="Filter by Department"
          allowClear
          style={{
            width: 220,
            background: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#000",
          }}
          dropdownStyle={{
            background: isDark ? "#1f1f1f" : "#fff",
            color: isDark ? "#fff" : "#000",
          }}
          value={selected || undefined}
          onChange={(val) => setSelected(val)}
        >
          {departement.map((dept) => (
            <Select.Option
              key={dept.slug}
              value={dept.slug}
            >
              {dept.name}
            </Select.Option>
          ))}
        </Select>


        <Space>
          <span >Use Infinite Scroll</span>
          <Switch
            checked={!usePagination}
            onChange={(val) => setUsePagination(!val)}
          />
        </Space>

      </Space>
      {usePagination && (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          style={darkCard}
          className={isDark ? "ant-table-dark" : ""}
        />
      )}


      {!usePagination && (
        <InfiniteScroll
          dataLength={Math.min(visibleCount, data.length)}
          next={loadMore}
          hasMore={visibleCount < data.length}
          height={600}
          loader={<h4 style={{ color: isDark ? "#fff" : "#000" }}>Loading...</h4>}
        >
          <List
            dataSource={data.slice(0, visibleCount)}
            renderItem={(item) => (
              <List.Item style={{ marginBottom: 16, ...darkCard }}>
                <List.Item.Meta
                  title={
                    <span style={{ color: isDark ? "#fff" : "#000" }}>
                      {item.firstName} {item.lastName}
                    </span>
                  }
                  description={
                    <span style={{ color: isDark ? "#ccc" : "#555" }}>
                      {item.email} • {item.university}
                    </span>
                  }
                />
                <Link href={`/employees/${item.id}`}>
                  <Button type="primary">View Details</Button>
                </Link>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      )}
    </div>
  );
}
