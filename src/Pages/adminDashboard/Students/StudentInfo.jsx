import React, { useState, useEffect } from "react";
import {
  Select,
  Table,
  Button,
  
} from "antd";


import { toast } from "react-toastify";
import TabPane from "antd/es/tabs/TabPane";
import { DeleteOutline, Done, DoneAllOutlined, EditOutlined } from "@mui/icons-material";
import { getAllSchool, getAllStudentBySchool } from "../../../service/student";
import Loader from "../../../Components/Loader/Loader";
import EditStudent from "./EditStudent";
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
 

  
 
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [filters, setFilters] = useState({
    school: "",
    class: "",
    section: "",
  });
  const [openEdit, setOpenEdit] = useState(false)




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
        filters.class
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
    setStudentData(stu)
    setOpenEdit(true)
  }

  const toggle = () => {
    setOpenEdit(!openEdit)
    setStudentData({})
   
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

     <Button onClick={() => console.log(student)}>
     <DeleteOutline  />
   </Button>

   <Button onClick={() => console.log(student)}>
   <DoneAllOutlined />
 </Button>
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


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3>Manage Student</h3>
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
            style={{ width: 120 }}
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

     
      </div>
      {loadingStudents ? (
        <Loader />
      ) : (
        <Table
          dataSource={filteredStudents}
          columns={[...imageColumns, ...columns.concat(actionColumns)]}
          rowKey="id"
          bordered
          style={{overflowX: 'scroll'}}
          pagination={true}
          size="middle"
          rowHoverable={true}
        />
      )}

      <EditStudent isOpen={openEdit} toggle={toggle} studentsData={studentData} validationOptions={columns} />

    </div>
  );
};

export default StudentList;
