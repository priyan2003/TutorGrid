import React from "react";
import { assets } from "../../assets/assets";

function Companies() {
  return (
    <div className="pt-15 ">
      <h1 className="text-base text-gray-500">Trusted by learners from</h1>
      <div className="flex flex-wrap items-center justify-center gap-5 md:gap-16 md:mt-10 mt-5">
        <img src={assets.adobe_logo} alt="" className="w-20 md:w-28" />
        <img src={assets.accenture_logo} alt="" className="w-20 md:w-28" />
        <img src={assets.microsoft_logo} alt="" className="w-20 md:w-28" />
        <img src={assets.walmart_logo} alt="" className="w-20 md:w-28" />
        <img src={assets.paypal_logo} alt="" className="w-20 md:w-28" />
      </div>
    </div>
  );
}

export default Companies;
