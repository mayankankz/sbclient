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
function EditUser({ studentsData, validationOptions, toggle, isOpen }) {
  const [student, setStudent] = useState({ ...studentsData });
  const [validationError, setValidationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options,setOptions] = useState([]);
  debugger;
  useEffect(() => {
    setStudent({ ...studentsData });
    setOptions(JSON.parse(JSON.parse(student['validationoptions'])))
    return () => {
      setValidationError(false);
    };
  }, [studentsData]);

  function handleOnChange(e) {
    debugger;
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

  let validation = validationOptions.map((v) => v.key);

  const handleFormSubmit = async () => {
    debugger
    try {
      setIsLoading(true);

      let url = `${apiUrl}/user/updateuser/${student.userid}`;

      const response = await axios.patch(url, {...student, validationoptions: JSON.stringify(options)});

      if (response.data.status === "success") {
        setIsLoading(false);

        toast.success(
          `User Data Updated Successfully.`
        );
        toggle();
      }
    } catch (error) {
      toast.error("Unable  to update user data.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value) => {
   setOptions(value);
  };

  return (
    <div>
      <Modal isOpen={isOpen} size="xl" centered toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Student</ModalHeader>
        <ModalBody style={{ minHeight: "300px" }}>
          <Container>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <Row className="d-flex flex-wrap">
                  {Object.keys(student).map(
                    (key) =>
                      key !== "img" &&
                      validation.includes(key) && (
                        <Col lg={4} md={6} sm={12} key={key} className="mb-2">
                          <Typography.Title level={5}>{key}</Typography.Title>
                          {key === "dob" ? (
                            <Input
                              type="date"
                              onChange={onDateChange}
                              name={key}
                            />
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
                  <Select
                  mode="multiple"
                  allowClear
                  
                  placeholder="Please select"
                  defaultValue={JSON.parse(JSON.parse(student['validationoptions']))}
                  onChange={handleChange}
                  options={[
                    { label: 'Student Name', value: 'studentname' },
                    { label: "Father's Name", value: 'fathersname' },
                    { label: "Mother's Name", value: 'mothersname' },
                    { label: 'Class', value: 'class' },
                    { label: 'Address', value: 'address' },
                    { label: 'Mobile Number', value: 'mobilenumber' },
                    { label: 'School Name', value: 'schoolname' },
                    { label: 'Samagra ID', value: 'samagraid' },
                    { label: 'DOB', value: 'dob' },
                    { label: 'Aadhar Number', value: 'aadhar' },
                    { label: 'Student ID NO.', value: 'studentidno' },
                    { label: 'Section', value: 'section' },
                    { label: 'Teacher Name', value: 'name' },
                    { label: 'Husband Name', value: 'husbandname' },
                    { label: 'Email Address', value: 'email' },
                    { label: 'Employee Id', value: 'empid' },
                    { label: 'Blood Group', value: 'Bloodgroup' },
                    { label: 'Valid From', value: 'validfrom' },
                    { label: 'Valid Till', value: 'validTill' },
                    { label: 'Other 1', value: 'other1' },
                    { label: 'Other 2', value: 'other2' },
                    { label: 'Other 3', value: 'other3' },
                    
                ]}
                />
                </Row>
              </>
            )}
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

export default EditUser;
