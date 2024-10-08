import { ChangeCircleOutlined, FindReplace } from "@mui/icons-material";
import { Select, Typography, message } from "antd";
import Input from "antd/es/input/Input";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
} from "reactstrap";
import customFileInput from "../../../Components/customFileInput";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "../../../utils/constant";
import Loader from "../../../Components/Loader/Loader";
function AddStudent({ selectedSchool,selectedClass,validationOptions, toggle, isOpen,schools }) {
  const [student, setStudent] = useState({});
  const [validationError, setValidationError] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([{label:'Teachers',value:"Teachers" },...JSON.parse(localStorage.getItem('classes'))]);

  if(!selectedClass || !selectedSchool){
    toast.error("Please select a class and a school");
    return;
  }
  useEffect(() => {
    const objectWithEmptyValues = validationOptions.reduce((acc, column) => {
        acc[column.title] = "";
        return acc;
    }, {});
    
    const schoolName = schools.filter(sc=> sc.schoolcode === selectedSchool)[0].schoolname
    setStudent({ ...objectWithEmptyValues,className: selectedClass,schoolname:schoolName,schoolcode: selectedSchool });

    return () => {
      setFile(null);
      setPreview(null);
      setValidationError(false);
    };
  }, []);

  function handleOnChange(e) {
    debugger
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    debugger;
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }

  let validation = validationOptions.map((v) => v.title);
  const onDateChange = (selectedDate) => {
    debugger;
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    setStudent({ ...student, dob: currentDate });
  };

  const handleFormSubmit = async () => {
    let isValid = true;

    validationOptions.forEach((option) => {
      const { title } = option;
      if (!student[title]) {
        isValid = false;
        message.error(`${title} is required.`);
      }
    });

    if (!isValid) {
      setValidationError(true);
      return;
    }

    const formData = new FormData();

    for (const key in student) {
      console.log(key, student[key]);
      if (student.hasOwnProperty(key)) {
        formData.append(key, student[key]);
      }
    }
    debugger;
    if (preview) {
      formData.append("image", file);
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${apiUrl}/app/addnewstudent`,
        formData
      );

      if (response.data.statud === "success") {
        setIsLoading(false);

        toast.success("Student Created Successfully.");
      }
    } catch (error) {
      toast.error("Unable  to update student data.");
      setIsLoading(false);
    } finally { 
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} size="xl" centered toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Student</ModalHeader>
        <ModalBody style={{minHeight: '500px'}}>
          <Container>
           {isLoading ? <Loader /> :<> <Row>
              <Col md={6}>

                <Row>
                  <Col md={6}>
                <Typography.Title level={5}>ID</Typography.Title>

                    <Input
                      name="id"
                      disabled
                      value={student["id"]}
                      onChange={handleOnChange}
                      placeholder="Enter ID"
                    />
                    {validationError && !student.id && (
                      <Typography.Text type="danger">
                        ID is required.
                      </Typography.Text>
                    )}
                  </Col>

                  <Col md={6}>
                    <Typography.Title level={5}>Session</Typography.Title>
                    <Input
                      name="session"
                      value={student["session"]}
                      onChange={handleOnChange}
                      placeholder="Enter ID"
                    />
                    {validationError && !student.id && (
                      <Typography.Text type="danger">
                        ID is required.
                      </Typography.Text>
                    )}
                  </Col>
                  <Col md={6}>
                    <Typography.Title level={5}>Class</Typography.Title>
                    <Select
                      placeholder="Select Class"
                      style={{ width: '100%' }}
                      value={student["class"]}
                      name="class"
                      allowClear
                      required
                      onChange={(e)=> handleOnChange({target :{name:'class',value:e}})}
                    >
                      <Option value="">Select Class</Option>
                      {classes.map((cls) => (
                        <Option key={cls.value} value={cls.value}>
                          {cls.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={12} style={{ textAlign: "end" }}>
                    <img
                      src={preview ? preview : student["img"]}
                      height={120}
                    />
                  </Col>
                  <Col
                    md={12}
                    style={{ textAlign: "end", justifyContent: "center" }}
                  >
                    <div class="image-upload">
                      <label for="file-input">
                        <ChangeCircleOutlined />
                      </label>

                      <input
                        onChange={handleImageChange}
                        hidden
                        id="file-input"
                        type="file"
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="d-flex flex-wrap">
              {Object.keys(student).map(
                (key) =>
                  key !== "img" &&
                  validation.includes(key) && (
                    <Col lg={4} md={6} sm={12} key={key} className="mb-2">
                      <Typography.Title level={5}>{key}</Typography.Title>
                      {key === "dob" ? (
                        <Input type="date" onChange={onDateChange} name={key} />
                      ) : (
                        <Input
                          onChange={handleOnChange}
                          name={key}
                          value={student[key]}
                          disabled={key === "id"}
                        />
                      )}
                      {validationError && !student[key] && (
                        <Typography.Text type="danger">{`${key} is required.`}</Typography.Text>
                      )}
                    </Col>
                  )
              )}
            </Row></>}
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleFormSubmit}>
            Save Changes
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AddStudent;
