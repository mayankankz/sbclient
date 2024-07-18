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
    let url;
    if(className === "Teachers"){
      url = `${apiUrl}/teacher/getalltechersdatawithimages/${schoolId}`
    }else{
      url = `${apiUrl}/user/getallstudentsdatawithimages/${schoolId}/${className}`
      
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw new Error('Failed to fetch student data');
  }
};



export const getadminData = async () => {
  debugger
  try {
    const response = await api.get(
      `${apiUrl}/app/admindashboard`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw new Error('Failed to fetch admin data');
  }
};
