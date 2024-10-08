import React, { useState, useEffect, useRef } from "react";
import { Select, Table, Button, Modal, Popconfirm, Dropdown, Space, Input } from "antd";
import { DeleteRowOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import TabPane from "antd/es/tabs/TabPane";
import {
  DeleteOutline,
  Done,
  DoneAllOutlined,
  EditOutlined,
  ImportExport,
  UpdateOutlined,
} from "@mui/icons-material";
import { getAllSchool, getAllStudentBySchool } from "../../../service/student";
import Loader from "../../../Components/Loader/Loader";
import EditStudent from "./EditStudent";
const { Option } = Select;
import { Checkbox, Divider } from "antd";
import { Container } from "reactstrap";
import axios from "axios";
import { apiUrl } from "../../../utils/constant";
import ImportExcelModal from "../../../Components/FileImport/ImportData";
import AddStudent from "./AddStudent";
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [columns, setColums] = useState([]);
  const [classes, setClasses] = useState([
    { label: "Teachers", value: "Teachers" },
    ...JSON.parse(localStorage.getItem("classes")),
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isPopLoading, setIsPopLoading] = useState(false);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [filters, setFilters] = useState({
    school: "",
    class: "",
    session: new Date().getFullYear().toString(),
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState([]);
  const [openUpdateClass, setOpenUpdateClass] = useState(false);
  const [updatedClass, setUpdatedClass] = useState(null);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [ShowPrinted,setShowPrinted] = useState(true);

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

  const handleOpenModal = () => {
    setOpenImportModal(true);
  };

  const handleCloseModal = () => {
    setOpenImportModal(false);
  };
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

    fetchSchools();
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


  const filteredStudents = students.filter((student) => {
    return (
      (!filters.class || student.class === filters.class) &&
      (!filters.section || student.section === filters.section)
    );
  });

  function handleEdit(stu) {
    setStudentData(stu);
    setOpenEdit(true);
  }

  async function handleBulkEdit() {
    if (!selectedStudent.length) {
      toast.error("Please select at least one student.");
      return;
    }
    try {
      setIsLoading(true);
      for (let id of selectedStudent) {
        const formData = new FormData();
        formData.append("class", updatedClass);

        const response = await axios.patch(
          `${apiUrl}/user/updatestudentdata/${id}`,
          formData
        );
      }
      setSelectedStudent([]);
      setUpdatedClass(null);
      setOpenUpdateClass(false);
      toast.success("Class of selected students Updated Successfully.");
    } catch (error) {
      toast.error("Unable  to update student data.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBulkDelete() {
    if (!selectedStudent.length) {
      toast.error("Please select at least one student.");
      return;
    }
    try {
      setIsLoading(true);
      for (let id of selectedStudent) {
        let url = `${apiUrl}/user/deletestudent/${id}`;
        if (filters.class == "Teachers") {
          url = `${apiUrl}/teacher/deleteteacher/${id}`;
        } else {
          url = `${apiUrl}/user/deletestudent/${id}`;
        }
        await axios.delete(url);
      }
      setSelectedStudent([]);
      setUpdatedClass(null);
      setOpenUpdateClass(false);
      await fetchStudents();

      toast.success("Selected Students Deleted Successfully.");
    } catch (error) {
      toast.error("Unable  to update student data.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBulkSetPrinted(){
    if (!selectedStudent.length) {
      toast.error("Please select at least one student.");
      return;
    }
    try {
      setIsLoading(true);
      for (let id of selectedStudent) {
        

        const response = await axios.patch(
          `${apiUrl}/user/updateStudent/${id}`,{
            isPrinted: true,
          }
        );
      }
      setSelectedStudent([]);
      setUpdatedClass(null);
      setOpenUpdateClass(false);
      setShowPrinted(true);
      await fetchStudents();

      toast.success("Selected Students Deleted Successfully.");
    } catch (error) {
      toast.error("Unable  to update student data.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSetPrinted(id){
  debugger
    try {
      setIsLoading(true);
  
        const response = await axios.patch(
          `${apiUrl}/user/updateStudent/${id}`,{
            isPrinted: true,
          }
        );
      
      setSelectedStudent([]);
      setUpdatedClass(null);
      setOpenUpdateClass(false);
      await fetchStudents();

      toast.success("Selected Students Deleted Successfully.");
    } catch (error) {
      toast.error("Unable  to update student data.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    debugger;
    try {
      setIsPopLoading(true);

      let url = `${apiUrl}/user/deletestudent/${id}`;
      if (filters.class == "Teachers") {
        url = `${apiUrl}/teacher/deleteteacher/${id}`;
      } else {
        url = `${apiUrl}/user/deletestudent/${id}`;
      }
      const deleteStudent = await axios.delete(url);
      await fetchStudents();
      toast.success(
        `${
          filters.class == "Teachers" ? "Teacher" : "Student"
        } deleted successfully.`
      );
    } catch (error) {
      toast.error("Failed to delete student.");
    } finally {
      setIsPopLoading(false);
    }
  }

  const toggle = () => {
    setOpenEdit(!openEdit);
    setStudentData({});
  };

  const toggleAdd = () => {
    setOpenAdd(!openAdd);
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
      width: 20,
      render: (_, student) => (
        <div className="d-flex gap-1">
          <Button onClick={() => handleEdit(student)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete"
            description={`Are you sure to delete this ${
              filters.class == "Teachers" ? "teacher" : "student"
            }?`}
            onConfirm={() => handleDelete(student.id)}
            onCancel={() => console.log("onCancel")}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              loading: isPopLoading,
            }}
          >
            <Button onClick={() => console.log(student)}>
              <DeleteOutline />
            </Button>
          </Popconfirm>

          <Button onClick={() => handleSetPrinted(student.id)}>
            <DoneAllOutlined />
          </Button>
        </div>
      ),
    },
  ];




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
    debugger
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
                    }" alt="student image" style="width: 50px; height: 50px;" /></td>`
                  : `<td>${student[col] || ""}</td>`
              )
              .join("")}
          </tr>
        `;
      })
      .join("");

    // Creating the table HTML
    const tableHtml = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
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
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h1 style="text-align : center;">${studentsArr[0]["schoolname"]}</h1>
          <h4>Total Students: ${studentsArr.length}</h4>

          ${tableHtml}
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

  if (isLoading) {
    return <Loader />;
  }

  const items = [
    {
      label: <div variant="primary" onClick={() => handleOpenModal()}>
      <ImportExport /> Import Data
    </div>,
      key: '0',
    },
    {
      label:  <div type="primary" onClick={() => setOpenUpdateClass(true)}>
      <UpdateOutlined /> Update Class
    </div>,
      key: '1',
    },
    {
      label: <Popconfirm
      title="Delete"
      description={`Are you sure to delete this ${
        filters.class == "Teachers" ? "teacher" : "student"
      }?`}
      onConfirm={() => handleBulkDelete()}
      onCancel={() => console.log("onCancel")}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{
        loading: isPopLoading,
      }}
    ><div ><DeleteOutline /> Delete</div> </Popconfirm>,
      key: '2',
    },
    {
      label:  <div type="primary" onClick={() => handleBulkSetPrinted()}>
      <DoneAllOutlined /> Printed
    </div>,
      key: '1',
    }
  ];

  const getRowClassName = (record) => {
    debugger
    if (record.isPrinted) {
        return 'alreadyPrinted';
    } 
};



  return (
    <div style={{ padding: "20px" }}>
      <h4>Manage Student/Teachers</h4>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <div className="d-flex gap-2">
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
              style={{ width: 120 }}
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
            <Checkbox style={{display: 'flex' ,alignItems: 'center' , height: "30px"}} onClick={()=> setShowPrinted(!ShowPrinted)} checked={!ShowPrinted}>
            <span>{"All"}</span>
        </Checkbox>
            <Button type="primary" onClick={async () => await fetchStudents()}>
              Fetch Data
            </Button>
          </div>

          <div className="d-flex gap-2">
            <Button type="primary" onClick={() => handleExportCheckList()}>
              Export CheckList
            </Button>

            <Button type="primary" onClick={() => setOpenAdd(true)}>
              Add New Student
            </Button>
           
            

            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Button style={{display: 'flex', alignItems: 'center',justifyContent: 'center', width: 150}} >
                 Actions
                  <DownOutlined />
                </Button>
              </a>
            </Dropdown>
          </div>
        </div>
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
          bordered
          style={{ overflowX: "scroll" }}
          pagination={true}
          size="middle"
          rowHoverable={true}
          rowClassName={getRowClassName}
        />
      )}

      <EditStudent
        isOpen={openEdit}
        toggle={toggle}
        studentsData={studentData}
        validationOptions={columns}
        isTeacher={filters.class == "Teachers" ? true : false}
      />

      {openAdd && (
        <AddStudent
          isOpen={openAdd}
          toggle={toggleAdd}
          selectedSchool={filters.school}
          selectedClass={filters.class}
          validationOptions={columns}
          schools={schools}
        />
      )}

      {openUpdateClass && (
        <div>
          <Modal
            open={openUpdateClass}
            onCancel={() => {
              setUpdatedClass(null);
              setOpenUpdateClass(false);
            }}
            title="Bulk Class Mapping"
            onOk={async () => await handleBulkEdit()}
          >
            <Container
              style={{
                minHeight: "200px",
                overflowY: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <Select
                  placeholder="Select Class"
                  style={{ width: 150 }}
                  value={updatedClass}
                  onChange={(value) => setUpdatedClass(value)}
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
              </div>
            </Container>
          </Modal>
        </div>
      )}

      {openImportModal && (
        <ImportExcelModal
          open={true}
          onClose={handleCloseModal}
          schools={schools}
          classes={classes}
        />
      )}
    </div>
  );
};

export default StudentList;
