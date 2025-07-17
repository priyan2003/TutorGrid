import React from "react";
import Searchbar from "./Searchbar";

function Hero() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full md:pt-36 pt-20
      px-7 md:px-0 text-center bg-gradient-to-b from-gray-100/95 gap-3"
    >
      <h4 className="text-2xl md:text-6xl font-bold text-[#1E1E1E] max-w-3xl mx-auto">
        Welcome to TutorGrid.
      </h4>

      <h1 className="text-xl md:text-4xl font-bold text-[#FF6B6B] max-w-3xl mx-auto">
        Empowering students and tutors through a
        <span className="text-[#2979FF]"> unified, intelligent platform</span>
      </h1>

      <p className="hidden md:block text-gray-500 max-w-2xl mx-auto mt-2">
        TutorGrid is designed to streamline the learning experience, making it
        easier for students to connect with tutors and access resources.
      </p>

      <p className="md:hidden text-gray-500 max-w-sm mx-auto mt-2">
        We bring together world-class instructors to help you achieve your
        professional goals.
      </p>
      <Searchbar/>
    </div>
  );
}

export default Hero;
