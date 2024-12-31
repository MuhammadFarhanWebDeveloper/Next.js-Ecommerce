import React from "react";
import { useFormStatus } from "react-dom";
function ActionButton({ text = "Submit" }) {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition duration-300"
      disabled={status.pending}
    >
      {!status.pending ? (
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

export default ActionButton;
