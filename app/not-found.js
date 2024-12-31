import Link from 'next/link'
import { FiAlertCircle } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center text-4xl font-bold text-red-600 mb-4">
            <FiAlertCircle className="mr-2 h-8 w-8" />
            <span>404</span>
          </div>
          <p className="text-center text-gray-600 mb-4">
            Oops! The page you're looking for doesn't exist or you don't have permission to access it.
          </p>
          <p className="text-center text-gray-500 text-sm mb-6">
            If you believe this is an error, please contact support.
          </p>
          <div className="flex justify-center">
            <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}