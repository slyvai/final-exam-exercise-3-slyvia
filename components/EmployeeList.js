import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Table, Input, Select, Button, Space, Switch, List, Card } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppContext } from '../context/AppContext';


export default function EmployeeList({ employees, departement }) {
  const { selectedMajor } = useContext(AppContext);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState('');

  const [data, setData] = useState(employees || []); 
  const [usePagination, setUsePagination] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    if (selectedMajor) setSelected(selectedMajor);
  }, [selectedMajor]);

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

  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

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

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Select
          placeholder="Filter by Department" 
          allowClear
          style={{ width: 220 }}
          value={selected || undefined}
          onChange={(val) => setSelected(val)}
        >
        
          {departement.map((dept) => ( 
            <Select.Option key={dept.slug} value={dept.slug}>
              {dept.name}
            </Select.Option>
          ))}
        </Select>

        <Space>
          <span>Use Infinite Scroll</span>
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
        />
      )}

      {!usePagination && (
        <InfiniteScroll
          dataLength={Math.min(visibleCount, data.length)}
          next={loadMore}
          hasMore={visibleCount < data.length}
          height={600}
          loader={<h4>Loading...</h4>}
        >
          <List
            dataSource={data.slice(0, visibleCount)}
            renderItem={(item) => (
              <Card style={{ marginBottom: 16 }}>
                <List.Item>
                  <List.Item.Meta
                    title={`${item.firstName} ${item.lastName}`}
                    description={`${item.email} • ${item.university}`}
                  />
                 
                  <Link href={`/employees/${item.id}`}>
                    <Button type="primary">View Details</Button>
                  </Link>
                </List.Item>
              </Card>
            )}
          />
        </InfiniteScroll>
      )}
    </div>
  );
}