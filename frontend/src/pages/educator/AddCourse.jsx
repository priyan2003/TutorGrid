import React, { useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function AddCourse() {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const {backendUrl, getToken} = useContext(AppContext);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // 📌 Handle adding/removing/toggling chapters
  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0
              ? chapters.slice(-1)[0].chapterOrder + 1
              : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };
  

  //Handle lectures
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      console.log("Opening popup for chapter:", chapterId);
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if(chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex,1)
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
  if (!lectureDetails.lectureTitle || !lectureDetails.lectureUrl) {
    alert("Please fill in lecture title and URL");
    return;
  }

  setChapters((prevChapters) =>
    prevChapters.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        const lastLecture = chapter.chapterContent.slice(-1)[0];
        const nextOrder = lastLecture ? lastLecture.lectureOrder + 1 : 1;

        const newLecture = {
          ...lectureDetails,
          lectureId: uniqid(),
          lectureOrder: nextOrder,
        };

        return {
          ...chapter,
          chapterContent: [...chapter.chapterContent, newLecture],
        };
      }
      return chapter;
    })
  );

  // ✅ Reset form & close popup
  setLectureDetails({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "", // ✅ fixed here
    isPreviewFree: false,
  });
  setShowPopup(false);
};



  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if(!image){
        toast.error('Thumbnail is required')
      }
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      formData.append('image', image);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + '/api/educator/add-course',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(data);
      
      if(data.success){
        toast.success(data.message);
        setCourseTitle('');
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML = ""
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  //  Initialize Quill editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      {/* ✅ Added styling to form */}
      <form
        onSubmit={handleSubmit}
        action=""
        className="bg-white shadow-lg rounded-lg p-6 w-fit max-w-4xl space-y-6"
      >
        {/* Course Title */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Course Description */}
        <div>
          <p className="font-semibold">Course Description</p>
          <div
            ref={editorRef}
            className="border border-gray-300 rounded p-2 min-h-[100px]"
          ></div>
        </div>

        {/* Course Price & Thumbnail */}
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Course Price</p>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex md:flex-row flex-col items-center gap-3">
            <p className="font-semibold">Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
              <img
                src={assets.file_upload_icon}
                alt=""
                className="p-3 bg-blue-500 rounded"
              />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              <img
                className="max-h-10 rounded border"
                src={image ? URL.createObjectURL(image) : ""}
                alt=""
              />
            </label>
          </div>
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Discount %</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Chapters & Lectures */}
        <div className="space-y-4">
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="bg-gray-50 border rounded-lg">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`mr-2 cursor-pointer transition-all ${
                      chapter.collapsed && "-rotate-90"
                    }`}
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1} {chapter.chapterTitle}
                  </span>
                </div>
                <span className="text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>
                <img
                  src={assets.cross_icon}
                  alt=""
                  className="cursor-pointer"
                  onClick={() => handleChapter("remove", chapter.chapterId)}
                />
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lectureIndex}
                      className="flex items-center justify-between mb-2"
                    >
                      <span>
                        {lectureIndex + 1}. {lecture.lectureTitle} - 
                        {lecture.lectureDuration} mins 
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500"
                        >
                          Link
                        </a>
                        - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                      </span>
                      <img
                        onClick={() =>
                          handleLecture(
                            "remove",
                            chapter.chapterId,
                            lectureIndex
                          )
                        }
                        src={assets.cross_icon}
                        alt=""
                        className="cursor-pointer"
                      />
                    </div>
                  ))}
                  <div
                    onClick={() => handleLecture("add", chapter.chapterId)}
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2 hover:bg-gray-200"
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Chapter */}
          <div
            onClick={() => handleChapter("add")}
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer hover:bg-blue-200"
          >
            + Add Chapter
          </div>

          {/* Popup for adding lecture */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80 shadow-lg">
                <h2 className="text-lg font-semibold">Add Lecture</h2>

                {/* Lecture Title */}
                <div className="mb-2">
                  <p>Lecture Title</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureTitle: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Duration */}
                <div className="mb-2">
                  <p>Duration (minutes)</p>
                  <input
                    type="number"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                  />
                </div>

                {/* URL */}
                <div className="mb-2">
                  <p>Lecture URL</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureUrl: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Free Preview Checkbox */}
                <div className="flex gap-2 my-4">
                  <p>Is Preview free?</p>
                  <input
                    type="checkbox"
                    className="mt-1 scale-125"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                </div>

                {/* Add Lecture Button */}
                <button
                  type="button"
                  className="w-full bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
                  onClick={addLecture}
                >
                  Add
                </button>

                {/* Close Icon */}
                <img
                  onClick={() => setShowPopup(false)}
                  src={assets.cross_icon}
                  className="absolute top-4 right-4 w-4 cursor-pointer"
                  alt="close"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-black text-white w-max py-2.5 px-8 rounded my-4 hover:bg-gray-900"
        >
          ADD
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
