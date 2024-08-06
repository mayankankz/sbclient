import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Modal,
  Spin,
  Tabs,
  Radio,
  Checkbox,
  Space,
} from "antd";
import { getAllSchool, getAllStudentBySchool } from "../../service/student";
import { getAllTemplate } from "../../service/idcard";
import IDcard from "../../Components/IDCARD/IDcard";
import ReactDOMServer from "react-dom/server";
import ModalPopup from "../../Components/Modal/Modal";
import { Col, Container } from "reactstrap";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import TabPane from "antd/es/tabs/TabPane";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const { Option } = Select;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [columns, setColums] = useState([]);
  const [classes, setClasses] = useState([
    { label: "Teachers", value: "Teachers" },
    ...JSON.parse(localStorage.getItem("classes")),
  ]);
  const [selectedStudent, setSelectedStudent] = useState([]);

  const [sections, setSections] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [open, setOpen] = useState(false);
  const [openTemplates, setopenTemplates] = useState(false);
  const [isBackSide, setIsBackSide] = useState(false);
  const [setting, setSettings] = useState({
    pageType: "A4",
    Layout: "Portrait",
    marginTop: 3,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 3,
    rowSpacing: 2.6,
    columnSpacing: 2.6,
    rows: 0,
    columns: 0,
    columnLayout: "row",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [ShowPrinted,setShowPrinted] = useState(true);

  const [filters, setFilters] = useState({
    school: "",
    class: "",
    session: new Date().getFullYear().toString(),
  });

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const resetSettings = () => {
    setSettings({
      pageType: "A4",
      Layout: "Portrait",
      marginTop: 3,
      marginLeft: 3,
      marginRight: 3,
      marginBottom: 3,
      rowSpacing: 2.6,
      columnSpacing: 2.6,
      rows: 0,
      columns: 0,
      columnLayout: "row",
    });
  };

  const updateRowsAndColumns = (newRows, newColumns) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      rows: newRows,
      columns: newColumns,
    }));
  };

  function handleSettingsChange(name, value) {
    debugger;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  }

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await getAllSchool();
        const data = response.schools;
        setSchools(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await getAllTemplate();
        const data = response;

        setTemplates(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSchools();
    fetchTemplates();
  }, []);

  const fetchStudents = async () => {
    if (!filters.school || !filters.class) {
      toast.error("Please select a school and class.");
      return;
    }

    try {
      setLoadingStudents(true);
      const response = await getAllStudentBySchool(
        filters.school,
        filters.class,
        filters.session,
        ShowPrinted,
      );
      const studentsData = response.students;
      setStudents(studentsData);
      debugger;
      setColums(
        JSON.parse(response.colums[0].validationoptions).map((option) => {
          return {
            title: option,
            dataIndex: option,
            key: option,
            ...getColumnSearchProps(option)
          };
        })
      );
      setLoadingStudents(false);
    } catch (error) {
      console.error("Error:", error);
      setLoadingStudents(false);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue || "",
    }));
  };

  const handleTemplateChange = (value) => {
    debugger;
    setSelectedTemplates([value]);
    const isVertical =
      templates.filter((tpl) => tpl.id === value)[0].layout === "Vertical";
    const columns =
      setting.pageType === "A3" ? (isVertical ? 3 : 3) : isVertical ? 5 : 2;
    const rows =
      setting.pageType === "A3" ? (isVertical ? 6 : 6) : isVertical ? 2 : 5;
    handleSettingsChange("Layout", isVertical ? "Landscape" : "Portrait");
    updateRowsAndColumns(rows, columns);
    setopenTemplates(false);
  };

  function reverseRows(students, studentsPerRow) {
    let result = [];
    let numRows = Math.ceil(students.length / studentsPerRow);

    for (let i = 0; i < numRows; i++) {
      let start = i * studentsPerRow;
      let end = start + studentsPerRow;

      if (end > students.length) {
        end = students.length;
      }

      let row = students.slice(start, end).reverse();
      result = result.concat(row);
    }

    return result;
  }

  const handleExportCheckList = () => {
    setIsLoading(true);

    let studentsArr = students;

    // Dynamically identify columns from the first student object that have data
    const tableColumns = Object.keys(studentsArr[0]).filter(
      (key) =>
        studentsArr[0][key] &&
        studentsArr[0][key] !== "null" &&
        key !== "imgUrl" &&
        key !== "updatedAt" &&
        key !== "createdAt" &&
        key !== "schoolname" &&
        key !== "schoolcode" &&
        key !== "id"
    );

    // Include "Image" as the first column
    const allColumns = ["img", ...tableColumns.filter((col) => col !== "img")];

    // Creating table headers
    const tableHeaders = allColumns
      .map((col) => `<th>${col.charAt(0).toUpperCase() + col.slice(1)}</th>`)
      .join("");

    // Creating table rows with student data
    const tableRows = studentsArr
      .map((student) => {
        return `
          <tr>
            ${allColumns
              .map((col) =>
                col === "img"
                  ? `<td><img src="${
                      student[col] || ""
                    }" alt="student image" class="student-img" /></td>`
                  : `<td>${student[col] || ""}</td>`
              )
              .join("")}
          </tr>
        `;
      })
      .join("");

    // Creating the table HTML
    const tableHtml = `
      <table class="styled-table">
        <thead>
          <tr>
            ${tableHeaders}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    const printHtml = `
      <html>
        <head>
          <title>CheckList</title>
          <style>
            @page {
              size: landscape;
              margin: 3mm;
              box-shadow: none;
            }
            body {
              height: 100%;
              box-sizing: border-box;
              border: none;
              margin: 0;
              padding: 0;
              font-family: 'Roboto', sans-serif;
              background-color: #f0f0f0;
              color: #333;
            }
            h1, h2 {
              text-align: center;
              margin: 0;
            }
            h1 {
              margin-top: 20px;
              font-size: 24px;
              color: #333;
            }
            h2 {
              margin-top: 10px;
              font-size: 18px;
              color: #666;
            }
            .styled-table {
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
              font-size: 0.9em;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            }
            .styled-table thead tr {
              background-color: #EB3E35;
              color: #ffffff;
              text-align: left;
            }
            .styled-table th, .styled-table td {
              padding: 12px 15px;
              border: 1px solid black;
            }
            .styled-table tbody tr {
              border: 1px solid #dddddd;
            }
            .styled-table tbody tr:nth-of-type(even) {
              background-color: #f3f3f3;
            }
            .styled-table tbody tr:last-of-type {
              border-bottom: 2px solid #009879;
            }
            .styled-table tbody tr.active-row {
              font-weight: bold;
              color: #009879;
            }
            .student-img {
              width: 50px;
              height: 50px;
             
              object-fit: cover;
            }
          </style>
        </head>
        <body>
          <h1>${studentsArr[0]["schoolname"]}</h1>
          ${tableHtml}
          <h2>Total Students: ${studentsArr.length}</h2>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printHtml);
    printWindow.document.close();

    printWindow.onload = () => {
      setIsLoading(false);
      printWindow.print();
    };
  };

  useEffect(() => {
    if (selectedStudent.length === students.length && students.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedStudent, students.length]);

  const handleSelectStudent = (id) => {
    if (selectedStudent.includes(id)) {
      const students = selectedStudent.filter((stu) => stu !== id);
      setSelectedStudent(students);
    } else {
      setSelectedStudent((prev) => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const allStudentIds = students.map((student) => student.id);
      setSelectedStudent(allStudentIds);
    } else {
      setSelectedStudent([]);
    }
    setSelectAll(!selectAll);
  };

  const selectColumns = [
    {
      title: (
          <Checkbox onClick={handleSelectAll} checked={selectAll}>
              <span style={{fontSize: '10px'}}>{selectAll ? "Unselect All" : "Select All"}</span>
          </Checkbox>
        ),
      key: "Select",
      width: 25,
      render: (_, student) => (
        <div className="d-flex gap-1 justify-align-content-center w-50 h-50">
          <Checkbox
            checked={selectedStudent.includes(student.id)}
            onChange={() => handleSelectStudent(student.id)}
          ></Checkbox>
        </div>
      ),
    },
  ];

  const handlePrintAllIDCards = () => {
    if (!selectedTemplates.length) {
      toast.error("Please select a template.");
      return;
    }
    setIsLoading(true);
    debugger;
    const isVertical =
      templates.filter((tpl) => tpl.id === selectedTemplates[0])[0].layout ===
      "Vertical";
    const columns =
      setting.pageType === "A3" ? (isVertical ? 3 : 3) : isVertical ? 5 : 2;
    const rows =
      setting.pageType === "A3" ? (isVertical ? 6 : 6) : isVertical ? 2 : 5;
    if (!setting.rows && !setting.columns) {
      updateRowsAndColumns(rows, columns);
    }
    let studentsArr = selectedStudent.length > 0 ? selectedStudent : students;
    if (isBackSide) {
      studentsArr = reverseRows(students, columns);
    }

    const idCardsHtml = studentsArr
      .map((student) => {
        return selectedTemplates
          .map((templateId) => {
            const template = templates.find((tpl) => tpl.id === templateId);

            return `
              ${ReactDOMServer.renderToStaticMarkup(
                <div className="id-card">
                  {" "}
                  <IDcard
                    size={
                      template.layout === "Vertical"
                        ? { width: 55, height: 87 }
                        : { width: 87, height: 55 }
                    }
                    backgroundImage={template.backgroundImage}
                    elements={template.elements}
                    data={student}
                  />
                </div>
              )}
            `;
          })
          .join("");
      })
      .join("");

    const printHtml = `
  <html>
    <head>
    <title>${isBackSide ? "BACK SIDE" : "FRONT SIDE"}</title>
      <style>
        @page {
          size: ${setting.pageType.toLocaleLowerCase()} ${setting.Layout.toLocaleLowerCase()};
          margin: ${setting.marginTop}mm ${setting.marginRight}mm ${
      setting.marginBottom
    }mm ${setting.marginLeft}mm;
          box-shadow: none;
        }
        body {
         
          display: grid;
          grid-template-columns: repeat(${setting.columns}, 1fr);
          grid-template-rows: repeat(${setting.rows}, 1fr);
          grid-row-gap: ${isVertical ? 15 : setting.rowSpacing}mm;
          grid-column-gap: ${setting.columnSpacing}mm;
          height: 100%;
          box-sizing: border-box;
          grid-auto-flow: ${setting.columnLayout};
          border: none; /* Ensure no border on the body */
          align-items: center;
        }
        .id-card {
          --card-width: 100%;
          --card-height: 100%;
          --row-gap: ${isVertical ? 15 : setting.rowSpacing}mm;
          --column-gap: ${setting.columnSpacing}mm;
          
          width: var(--card-width);
          height: var(--card-height);
          box-sizing: border-box;
          page-break-inside: avoid;
          display: flex;
          align-items: center;
          position: relative; /* Ensure the pseudo-element positions are relative to the card */
      }
         
        
        .id-card::before {
          content: "";
          position: absolute;
          ${
            isVertical
              ? `
            left: -10px;
            right: 0;
            top: 0;
            border-bottom: 1px dotted black;
            transform: translateY(calc(-50% - var(--row-gap) / 2));
          `
              : `
            top: -30px;
            bottom: 0;
            left: 1px;
            border-left: 1px dotted black;
            transform: translateX(calc(-50% - var(--column-gap) / 2));
          `
          }
      
        }
      </style>
    </head>
    <body>
      ${idCardsHtml}
    </body>
  </html>
`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printHtml);
    printWindow.document.close();

    printWindow.onload = () => {
      setIsLoading(false);
      printWindow.print();
    };
  };

  function handleFrontChanage(val) {
    setopenTemplates(true);
    setIsBackSide(false);
  }

  function handleBackChanage(val) {
    setopenTemplates(true);
    setIsBackSide(true);
  }

  const handlePrintIDCards = (id) => {
    debugger;
    if (!selectedTemplates.length) {
      toast.error("Please select a template.");
      return;
    }

    setIsLoading(true);
    const template = templates.find((tpl) => tpl.id === selectedTemplate);
    const student_data = students.filter((student) => {
      return student.id === id;
    });
    const idCardsHtml = student_data
      .map((student) => {
        return selectedTemplates
          .map((templateId) => {
            const template = templates.find((tpl) => tpl.id === templateId);

            return `
            ${ReactDOMServer.renderToStaticMarkup(
              <IDcard
                size={
                  template.layout === "Vertical"
                    ? { width: 55, height: 87 }
                    : { width: 87, height: 55 }
                }
                backgroundImage={template.backgroundImage}
                elements={template.elements}
                data={student}
              />
            )}
          `;
          })
          .join("");
      })
      .join("");
    debugger;
    const isVertical =
      templates.filter((tpl) => tpl.id === selectedTemplates[0])[0].layout ===
      "Vertical";
    const columns =
      setting.pageType === "A3" ? (isVertical ? 3 : 3) : isVertical ? 5 : 2;
    const rows =
      setting.pageType === "A3" ? (isVertical ? 6 : 6) : isVertical ? 2 : 5;
    if (!setting.rows && !setting.columns) {
      updateRowsAndColumns(rows, columns);
    }
    const printHtml = `
    <html>
      <head>
         <title>${isBackSide ? "BACK SIDE" : "FRONT SIDE"}</title>
        <style>
          @page {
            size: ${setting.pageType.toLocaleLowerCase()} ${setting.Layout.toLocaleLowerCase()};
            margin: ${setting.marginTop}mm ${setting.marginRight}mm ${
      setting.marginBottom
    }mm ${setting.marginLeft}mm;
            box-shadow: none;
          }
          body {
           
            display: grid;
            grid-template-columns: repeat(${setting.columns}, 1fr);
            grid-template-rows: repeat(${setting.rows}, 1fr);
            grid-row-gap: ${isVertical ? "15" : setting.rowSpacing}mm;
            grid-column-gap: ${setting.columnSpacing}mm;
            height: 100%;
            box-sizing: border-box;
            grid-auto-flow: ${setting.columnLayout};
            align-items: center;
            border: none; /* Ensure no border on the body */
          }
          .id-card {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            page-break-inside: avoid;
            display:flex;
            align-items: center;
          }

         
          
        </style>
      </head>
      <body>
        ${idCardsHtml}
      </body>
    </html>
  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printHtml);
    printWindow.document.close();

    printWindow.onload = () => {
      setIsLoading(false);
      printWindow.print();
    };
  };

  const actionColumns = [
    {
      title: "Session",
      key: "Session",
      render: (_, student) => <span>{student.session}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, student) => (
        <Button onClick={() => handlePrintIDCards(student.id)}>
          Print ID Card
        </Button>
      ),
    },
  ];
  const imageColumns = [
    {
      title: "Student Img",
      key: "img",
      render: (_, student) => (
        <div style={{ width: "100%" }}>
          <img loading="lazy" height={50} src={student.img} alt="studentImg" />
        </div>
      ),
    },
  ];

  const selected_template = templates.find(
    (tpl) => tpl.id === selectedTemplate
  );

  if (isLoading) {
    return <Loader />;
  }

  const getRowClassName = (record) => {
    debugger
    if (record.isPrinted) {
        return 'alreadyPrinted';
    } 
};

  return (
    <div style={{ padding: "20px" }}>
      <h4>Student/Teachers List</h4>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "50%",
            flexWrap: "wrap",
          }}
        >
          <Select
            placeholder="Select School"
            style={{ width: 300 }}
            value={filters.school}
            onChange={(value) => handleFilterChange("school", value)}
            allowClear
          >
            <Option value="">Select School</Option>
            {schools.map((school) => (
              <Option key={school.schoolcode} value={school.schoolcode}>
                {school.schoolname}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Class"
            style={{ width: 150 }}
            value={filters.class}
            onChange={(value) => handleFilterChange("class", value)}
            allowClear
            required
          >
            <Option value="">Select Class</Option>
            {classes.map((cls) => (
              <Option key={cls.value} value={cls.value}>
                {cls.label}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Session"
            style={{ width: 120 }}
            value={filters.session}
            onChange={(value) => handleFilterChange("session", value)}
            allowClear
            required
          >
            <Option value="">Select Session</Option>
            {[
              "2020",
              "2021",
              "2022",
              "2023",
              "2024",
              "2025",
              "2026",
              "2027",
              "2028",
              "2029",
              "2030",
            ].map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>
          <Checkbox style={{display: 'flex' , alignItems: 'center' , height: '30px'}} onClick={()=> setShowPrinted(!ShowPrinted)} checked={!ShowPrinted}>All</Checkbox>
          <Button type="primary" onClick={async () => await fetchStudents()}>
            Fetch Data
          </Button>

          
        </div>

        {students.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "50%",
              flexWrap: "wrap",
            }}
          >
            <Button type="primary" onClick={handleFrontChanage}>
              Select Front Side
            </Button>

            <Button type="primary" onClick={handleBackChanage}>
              Select Back Side
            </Button>
            <Button type="primary" onClick={() => setOpen(true)}>
              Page Settings
            </Button>
            <Button type="primary" onClick={() => handleExportCheckList()}>
              Export Checklist
            </Button>
            <Button
              type="primary"
              onClick={handlePrintAllIDCards}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Print All ID Cards"}
            </Button>
          </div>
        )}

        {open && (
          <div>
            <ModalPopup open={open} setOpen={setOpen} title="Page Settings">
              <Container>
                <Tabs
                  defaultActiveKey="1"
                  onChange={(key) => console.log(key)}
                  tabBarStyle={{ color: "#8D949C" }}
                  style={{ width: "100%" }}
                >
                  <TabPane
                    tab="Page"
                    key="1"
                    // style={{ backgroundColor: "red", color: "#000" }}
                  >
                    <Form
                      layout="vertical"
                      name="pageSettings"
                      initialValues={{
                        pageType: setting.pageType,
                        Layout: setting.Layout,
                        marginTop: setting.marginTop,
                        marginLeft: setting.marginLeft,
                        marginRight: setting.marginRight,
                        marginBottom: setting.marginBottom,
                        rowSpacing: setting.rowSpacing,
                        columnSpacing: setting.columnSpacing,
                        rows: setting.rows,
                        columns: setting.columns,
                      }}
                    >
                      <Form.Item
                        label="Page Type"
                        name="pageType"
                        rules={[
                          {
                            required: false,
                            message: "Please select a page type!",
                          },
                        ]}
                      >
                        <Select
                          value={setting.pageType}
                          name="pageType"
                          onChange={(val) =>
                            handleSettingsChange("pageType", val)
                          }
                        >
                          <Option value="A4">A4</Option>
                          <Option value="A3">A3</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label="Layout"
                        name="Layout"
                        rules={[
                          {
                            required: false,
                            message: "Please select a page type!",
                          },
                        ]}
                      >
                        <Select
                          value={setting.Layout}
                          name="Layout"
                          onChange={(val) =>
                            handleSettingsChange("Layout", val)
                          }
                        >
                          <Option value="Portrait">Portrait</Option>
                          <Option value="Landscape">Landscape</Option>
                        </Select>
                      </Form.Item>
                    </Form>
                  </TabPane>

                  <TabPane tab="Margins" key="2">
                    <Form
                      layout="horizontal"
                      name="pageSettings"
                      initialValues={{
                        pageType: setting.pageType,
                        Layout: setting.Layout,
                        marginTop: setting.marginTop,
                        marginLeft: setting.marginLeft,
                        marginRight: setting.marginRight,
                        marginBottom: setting.marginBottom,
                        rowSpacing: setting.rowSpacing,
                        columnSpacing: setting.columnSpacing,
                        rows: setting.rows,
                        columns: setting.columns,
                      }}
                    >
                      <Form.Item
                        label="Top Margin (In mm)"
                        name="marginTop"
                        rules={[{ required: false, message: "Please input!" }]}
                      >
                        <InputNumber
                          value={setting.marginTop}
                          name="marginTop"
                          onChange={(val) =>
                            handleSettingsChange("marginTop", val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Left Margin (In mm)"
                        name="marginLeft"
                        rules={[{ required: false, message: "Please input!" }]}
                      >
                        <InputNumber
                          value={setting.marginLeft}
                          name="marginLeft"
                          onChange={(val) =>
                            handleSettingsChange("marginLeft", val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Right Margin (In mm)"
                        name="marginRight"
                        rules={[{ required: false, message: "Please input!" }]}
                      >
                        <InputNumber
                          value={setting.marginRight}
                          name="marginRight"
                          onChange={(val) =>
                            handleSettingsChange("marginRight", val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Bottom Margin (In mm)"
                        name="marginBottom"
                        rules={[{ required: false, message: "Please input!" }]}
                      >
                        <InputNumber
                          value={setting.marginBottom}
                          name="marginBottom"
                          onChange={(val) =>
                            handleSettingsChange("marginBottom", val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Form>
                  </TabPane>

                  <TabPane tab="Columns" key="3">
                    <Form
                      layout="vertical"
                      name="pageSettings"
                      initialValues={{
                        pageType: setting.pageType,
                        Layout: setting.Layout,
                        marginTop: setting.marginTop,
                        marginLeft: setting.marginLeft,
                        marginRight: setting.marginRight,
                        marginBottom: setting.marginBottom,
                        rowSpacing: setting.rowSpacing,
                        columnSpacing: setting.columnSpacing,
                        rows: setting.rows,
                        columns: setting.columns,
                        columnLayout: setting.columnLayout,
                      }}
                    >
                      <Form.Item
                        label="Columns"
                        name="columns"
                        rules={[{ required: false, message: "Please input!" }]}
                      >
                        <InputNumber
                          value={setting.columns}
                          name="Columns"
                          onChange={(val) =>
                            handleSettingsChange("columns", val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Column Spacing (In mm)"
                        name="columnSpacing"
                        rules={[{ required: false, message: "Please input!" }]}
                      >
                        <InputNumber
                          value={setting.columnSpacing}
                          name="columnSpacing"
                          onChange={(val) =>
                            handleSettingsChange("columnSpacing", val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Rows"
                        name="rows"
                        rules={[{ required: false, message: "Please input!" }]}
                      >
                        <InputNumber
                          value={setting.rows}
                          name="Rows"
                          onChange={(val) => handleSettingsChange("rows", val)}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Row Spacing (In mm)"
                        name="rowSpacing"
                        rules={[{ required: false, message: "Please input!" }]}
                      >
                        <InputNumber
                          value={setting.rowSpacing}
                          name="rowSpacing"
                          onChange={(val) =>
                            handleSettingsChange("rowSpacing", val)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item label="Column Layout">
                        <Radio.Group
                          layout="vertical"
                          value={setting.columnLayout}
                          onChange={(e) =>
                            handleSettingsChange("columnLayout", e.target.value)
                          }
                        >
                          <Radio value="row"> Across, Then Down </Radio>

                          <Radio value="column"> Down,Then Across </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Form>
                  </TabPane>
                </Tabs>
              </Container>
            </ModalPopup>
          </div>
        )}

        {openTemplates && (
          <div>
            <Modal
              width={1000}
              open={openTemplates}
              onCancel={() => setopenTemplates(false)}
              title="Select Template"
            >
              <Container style={{ maxHeight: "500px", overflowY: "auto" }}>
                <div className="d-flex gap-2 flex-wrap">
                  {templates.map((template) => (
                    <div
                      onClick={() => handleTemplateChange(template.id)}
                      style={{
                        scale: "0.7",
                        border: `${
                          selectedTemplates[0] == template.id
                            ? "2px solid red"
                            : ""
                        }`,
                        height: "100%",
                      }}
                    >
                      <IDcard
                        size={
                          template.layout == "Vertical"
                            ? { width: 55, height: 87 }
                            : { width: 87, height: 55 }
                        }
                        backgroundImage={template.backgroundImage}
                        elements={template.elements}
                        isPreview={true}
                      />
                    </div>
                  ))}
                </div>
              </Container>
            </Modal>
          </div>
        )}
      </div>

      {loadingStudents ? (
        <Loader />
      ) : (
        <Table
          dataSource={students}
          columns={[
            ...selectColumns,
            ...imageColumns,
            ...columns.concat(actionColumns),
          ]}
          rowKey="id"
          pagination={true}
          size="small"
          style={{ overflowX: "scroll" }}
          rowClassName={getRowClassName}
        />
      )}
    </div>
  );
};

export default StudentList;
