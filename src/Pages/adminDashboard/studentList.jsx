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
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    const template = templates.find(tpl => tpl.id === selectedTemplate);

    const idCardsHtml = filteredStudents.map(student => `
      <div class="id-card">
        ${ReactDOMServer.renderToStaticMarkup(
          <IDcard
            layout={template.layout}
            backgroundImage={template.backgroundImage}
            elements={template.elements}
            data={student}
          />
        )}
      </div>
    `).join('');

    const printHtml = `
      <html>
        <head>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              margin: 0;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-template-rows: repeat(5, 1fr);
              gap: 10px;
              height: 100%;
              box-sizing: border-box;
            }
            .id-card {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          ${idCardsHtml}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printHtml);
    printWindow.document.close();

    // Wait until the content is fully loaded before printing
    printWindow.onload = () => {
      setIsLoading(false);
      printWindow.print();
    };
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
        <Button type="primary" onClick={handlePrintAllIDCards} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Print All ID Cards'}
        </Button>
      </div>
      <Table dataSource={filteredStudents} columns={columns} rowKey="id" />
    </div>
  );
};

export default StudentList;
