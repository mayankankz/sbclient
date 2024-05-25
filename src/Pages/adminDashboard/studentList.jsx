import React, { useState, useEffect } from 'react';
import { Select, Table } from 'antd';
import { getAllSchool, getAllStudentBySchool } from '../../service/student';

const { Option } = Select;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [filters, setFilters] = useState({
    school: '',
    class: '',
    section: ''
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await getAllSchool();
        const data = response.schools;
        setSchools(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (filters.school) {
        try {
          const response = await getAllStudentBySchool(filters.school);
          const studentsData = response.students;
          setStudents(studentsData);

          // Extract distinct classes and sections from student data
          const distinctClasses = [...new Set(studentsData.map(student => student.class))];
          const distinctSections = [...new Set(studentsData.map(student => student.section))];
          setClasses(distinctClasses);
          setSections(distinctSections);
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        setStudents([]);
        setClasses([]);
        setSections([]);
      }
    };

    fetchStudents();
  }, [filters.school]);

  const handleFilterChange = (filterName, filterValue) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: filterValue || ''
    }));
  };

  const filteredStudents = students.filter(student => {
    return (
      (!filters.class || student.class === filters.class) &&
      (!filters.section || student.section === filters.section)
    );
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'studentname',
      key: 'studentname',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobilenumber',
      key: 'mobilenumber',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3>Student List</h3>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Select
          placeholder="Select School"
          style={{ width: 200 }}
          value={filters.school}
          onChange={(value) => handleFilterChange('school', value)}
          allowClear
        >
          <Option value="">All</Option>
          {schools.map(school => (
            <Option key={school.schoolcode} value={school.schoolcode}>{school.schoolname}</Option>
          ))}
        </Select>
        <Select
          placeholder="Select Class"
          style={{ width: 200 }}
          value={filters.class}
          onChange={(value) => handleFilterChange('class', value)}
          allowClear
        >
          <Option value="">All</Option>
          {classes.map(cls => (
            <Option key={cls} value={cls}>{cls}</Option>
          ))}
        </Select>
        <Select
          placeholder="Select Section"
          style={{ width: 200 }}
          value={filters.section}
          onChange={(value) => handleFilterChange('section', value)}
          allowClear
        >
          <Option value="">All</Option>
          {sections.map(section => (
            <Option key={section} value={section}>{section}</Option>
          ))}
        </Select>
      </div>
      <Table dataSource={filteredStudents} columns={columns} rowKey="id" />
    </div>
  );
};

export default StudentList;
