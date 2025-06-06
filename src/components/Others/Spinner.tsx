import React from 'react'
import ClipLoader from 'react-spinners/ClipLoader'; 

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-96">
    <ClipLoader color="#0056d2" size={50} />
  </div>
  )
}

export default Spinner
