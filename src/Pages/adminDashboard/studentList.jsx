import React, { useState, useEffect } from 'react';
import { Select, Table, Button } from 'antd';
import { getAllSchool, getAllStudentBySchool } from '../../service/student';
import { getAllTemplate } from '../../service/idcard';
import IDcard from '../../Components/IDCARD/IDcard';
import ReactDOMServer from 'react-dom/server';
const { Option } = Select;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
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

    const fetchTemplates = async () => {
      try {
        const response = await getAllTemplate();
        const data = response;
        setTemplates(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSchools();
    fetchTemplates();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (filters.school) {
        try {
          const response = await getAllStudentBySchool(filters.school);
          const studentsData = response.students;
          setStudents(studentsData);

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

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
  };

  const handlePrintAllIDCards = () => {
    if (!selectedTemplate) {
      alert('Please select a template.');
      return;
    }

    const template = templates.find(tpl => tpl.id === selectedTemplate);
    const printWindow = window.open('', '_blank');

    filteredStudents.forEach(student => {
      const studentHtml = `
        <div style="display: grid; grid-template-rows: repeat(2, 1fr); grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${ReactDOMServer.renderToStaticMarkup(
            <IDcard
              layout={template.layout}
              backgroundImage={template.backgroundImage}
              elements={JSON.parse(template.elements)}
              data={student}
            />
          )}
        </div>
        <div style="page-break-after: always;"></div>
      `;

      printWindow.document.write(studentHtml);
    });

    printWindow.document.close();
    printWindow.print();
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
    {
      title: 'Action',
      key: 'action',
      render: (_, student) => (
        <Button onClick={() => handlePrintIDCard(student)}>Print ID Card</Button>
      )
    }
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
        <Select
          placeholder="Select Template"
          style={{ width: 200 }}
          value={selectedTemplate}
          onChange={handleTemplateChange}
          allowClear
        >
          {templates.map(template => (
            <Option key={template.id} value={template.id}>{template.name}</Option>
          ))}
        </Select>
        <Button type="primary" onClick={handlePrintAllIDCards}>Print All ID Cards</Button>
      </div>
      <Table dataSource={filteredStudents} columns={columns} rowKey="id" />
    </div>
  );
};

export default StudentList;
