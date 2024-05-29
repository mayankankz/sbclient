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

export const getAllStudentBySchool = async (schoolId, className) => {
  try {
    const response = await api.get(
      `${apiUrl}/user/getallstudentsdatawithimages/${schoolId}/${className}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw new Error('Failed to fetch student data');
  }
};
