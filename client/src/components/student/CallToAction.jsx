import React from 'react'
import {assets} from '../../assets/assets'
function CallToAction() {
  return (
    <div>
      <h1>Knowledge at Your Fingertips.</h1>
      <p>Build knowledge, sharpen skills, and stay ahead — anytime, anywhere, with TutorGrid's dynamic learning tools</p>
      <div>
        <button>Get stated</button>
        <button>Learn More <img src={assets.arrow_icon} alt="" /></button>
      </div>
    </div>
  )
}

export default CallToAction