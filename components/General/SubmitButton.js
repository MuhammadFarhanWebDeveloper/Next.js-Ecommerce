import React from "react";

function SubmitButton({ isLoading, text = "Submit" }) {
  return (
    <button
      type="submit"
      className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition duration-300"
      disabled={isLoading}
    >
      {!isLoading ? (
        text
      ) : (
        <img
          src="/loading.gif"
          alt="Loading..."
          width={20}
          height={20}
          className="mx-auto"
        />
      )}
    </button>
  );
}

export default SubmitButton;
