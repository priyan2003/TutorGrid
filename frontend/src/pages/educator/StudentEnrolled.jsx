import React, { useContext, useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function StudentEnrolled() {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const {getToken, backendUrl, isEducator} = useContext(AppContext)
  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      console.log(token);
      
      const {data} = await axios.get(backendUrl+'/api/educator/enrolled-students',{
      headers:{
        Authorization: `Bearer ${token}`
      }
      })
      
      if(data.success){
        setEnrolledStudents(data.enrolledStudents.reverse())
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  };
  useEffect(() => {
    if(isEducator){
      fetchEnrolledStudents();
    }
  }, [isEducator]);
  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md be-white border border-gray-500/20">
        <table className="md:table-auto table-fixed w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-bold truncate">#</th>
              <th className="px-4 py-3 font-bold truncate">Student Name</th>
              <th className="px-4 py-3 font-bold truncate">Course Title</th>
              <th className="px-4 py-3 font-bold truncate">Date</th>
            </tr>
          </thead>

          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {index + 1}
                </td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={item.student.imageUrl}
                    alt="student"
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="truncate">{item.student.name}</span>
                </td>
                <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading/>
  );
}

export default StudentEnrolled;
