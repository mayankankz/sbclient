import api from "./axios/api";
import { apiUrl } from "../utils/constant";

export const getAllSchool = async (data) => {
  try {
    const response = await api.get(`${apiUrl}/user/getallSchools`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllStudentBySchool = async (schoolId) => {
  try {
    const response = await api.get(
      `${apiUrl}/user/getallstudentsdatabyschoolcode/${schoolId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
