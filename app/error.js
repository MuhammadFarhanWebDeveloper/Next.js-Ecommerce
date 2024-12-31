'use client'

import { useEffect } from 'react'
import { BiErrorCircle } from 'react-icons/bi'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <BiErrorCircle className="text-red-500 text-5xl" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Oops! Something went wrong
        </h1>
        <p className="text-center text-gray-600 mb-6">
          We apologize for the inconvenience. An error has occurred.
        </p>
        <div className="text-center">
          <button
            onClick={() => reset()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}

