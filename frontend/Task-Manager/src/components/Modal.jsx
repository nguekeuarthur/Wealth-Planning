import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return;

  return <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-[#3d4a5c] rounded-lg shadow-xl">
          {/* Modal header */}

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-600">
            <h3 className="text-base font-medium text-white">
              {title}
            </h3>

            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-600 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer transition-colors"
              onClick={onClose}
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="px-5 py-4">
           {children}
          </div>
        </div>
      </div>
    </div>
};

export default Modal;
