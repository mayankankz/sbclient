import React, { useState, useEffect } from "react";
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
const { Option } = Select;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [columns, setColums] = useState([]);
  const [classes, setClasses] = useState([
    "Nursery",
    "KG 1",
    "KG 2",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ]);
  const [sections, setSections] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [open, setOpen] = useState(false);
  const [openTemplates, setopenTemplates] = useState(false);
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

  const [filters, setFilters] = useState({
    school: "",
    class: "",
    section: "",
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
        filters.class
      );
      const studentsData = response.students;
      setStudents(studentsData);
      debugger;
      setColums(
        JSON.parse(response.colums[0].validationoptions).map(
          (option) => {
            return {
              title: option,
              dataIndex: option,
              key: option,
            };
          }
        )
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
    handleSettingsChange("Layout", isVertical ? 'Landscape' : 'Portrait')
    updateRowsAndColumns(rows, columns);
    setopenTemplates(false);
  };

  const handlePrintAllIDCards = () => {
    if (!selectedTemplates.length) {
      toast.error("Please select a template.");
      return;
    }
    setIsLoading(true);

    const idCardsHtml = filteredStudents
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
      templates.some((tpl) => tpl.id === selectedTemplates[0]).layout ===
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
          <style>
          @page {
            size: ${setting.pageType} ${setting.Layout};
            margin: ${setting.marginTop}mm ${setting.marginRight}mm ${setting.marginBottom}mm ${setting.marginLeft}mm;
            box-shadow: none;
          }
          body {
            margin: 0;
            display: grid;
            grid-template-columns: repeat(${setting.columns}, 1fr);
            grid-template-rows: repeat(${setting.rows}, 1fr);
            grid-row-gap: ${setting.rowSpacing}mm;
            grid-column-gap: ${setting.columnSpacing}mm;
            height: 100%;
            box-sizing: border-box;
            grid-auto-flow: ${setting.columnLayout};
            
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

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printHtml);
    printWindow.document.close();

    printWindow.onload = () => {
      setIsLoading(false);
      printWindow.print();
    };
  };

  const handlePrintIDCards = (id) => {
    if (!selectedTemplate.length) {
      toast.error("Please select a template.");
      return;
    }

    setIsLoading(true);
    const template = templates.find((tpl) => tpl.id === selectedTemplate);
    const student_data = students.filter((student) => {
      return student.id === id;
    });
    const idCardsHtml = student_data
      .map(
        (student) => `
      <div class="id-card">
        ${ReactDOMServer.renderToStaticMarkup(
          <IDcard
            size={
              template.layout == "Vertical"
                ? { width: 55, height: 87 }
                : { width: 87, height: 55 }
            }
            backgroundImage={template.backgroundImage}
            elements={template.elements}
            data={student}
          />
        )}
      </div>
    `
      )
      .join("");
    debugger;
    const isVertical = template.layout === "Vertical";
    const columns =
      setting.pageType === "A3" ? (isVertical ? 3 : 3) : isVertical ? 5 : 2;
    const rows =
      setting.pageType === "A3" ? (isVertical ? 6 : 6) : isVertical ? 2 : 5;

    const printHtml = `
      <html>
        <head>
          <style>
          @page {
            size: ${setting.pageType} ${setting.Layout};
            margin: ${setting.marginTop}mm ${setting.marginRight}mm ${setting.marginBottom}mm ${setting.marginLeft}mm;
          }
          body {
            margin: 0;
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            grid-template-rows: repeat(${rows}, 1fr);
            grid-row-gap: ${setting.rowSpacing}mm;
            grid-column-gap: ${setting.columnSpacing}mm;
            grid-auto-flow: ${setting.columnLayout};
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

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printHtml);
    printWindow.document.close();

    // Wait until the content is fully loaded before printing
    printWindow.onload = () => {
      setIsLoading(false);
      printWindow.print();
    };
  };

  const filteredStudents = students.filter((student) => {
    return (
      (!filters.class || student.class === filters.class) &&
      (!filters.section || student.section === filters.section)
    );
  });

  const actionColumns = [
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

  const selected_template = templates.find(
    (tpl) => tpl.id === selectedTemplate
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3>Student List</h3>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Select
            placeholder="Select School"
            style={{ width: 200 }}
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
            style={{ width: 200 }}
            value={filters.class}
            onChange={(value) => handleFilterChange("class", value)}
            allowClear
            required
          >
            <Option value="">Select Class</Option>
            {classes.map((cls) => (
              <Option key={cls} value={cls}>
                {cls}
              </Option>
            ))}
          </Select>
          <Button type="primary" onClick={async () => await fetchStudents()}>
            Fetch Students
          </Button>
        </div>

        {students.length > 0 && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button type="primary" onClick={() => setopenTemplates(true)}>
              Select Template
            </Button>

            <Button type="primary" onClick={() => setOpen(true)}>
              Page Settings
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
              <Container>
                <Row>
                  {templates.map((template) => (
                    <Col lg={4} md={4}>
                      <div
                        onClick={() => handleTemplateChange(template.id)}
                        style={{ scale: "0.7" }}
                        className={`${
                          selectedTemplate == template.id ? "selected" : ""
                        }`}
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
                    </Col>
                  ))}
                </Row>
              </Container>
            </Modal>
          </div>
        )}
      </div>
      {loadingStudents ? (
        <Loader />
      ) : (
        <Table
          dataSource={filteredStudents}
          columns={columns.concat(actionColumns)}
          rowKey="id"
          pagination={true}
          size="small"
        />
      )}
    </div>
  );
};

export default StudentList;
