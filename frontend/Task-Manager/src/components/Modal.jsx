import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return;

  const handleBackdropClick = (e) => {
    // Fermer uniquement si on clique sur le backdrop (pas sur le contenu du modal)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return <div 
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-[#dfe8e1]">
          {/* Modal header */}

          <div className="flex items-center justify-between px-6 py-4 border-b border-[#dfe8e1]">
            <h3 className="text-lg font-semibold text-[#1e4029]">
              {title}
            </h3>

            <button
              type="button"
              className="text-[#7a8b7f] bg-[#f4f7f4] hover:bg-[#e6f0ea] hover:text-[#2d5f3f] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer transition-colors"
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
          <div className="px-6 py-4">
           {children}
          </div>
        </div>
      </div>
    </div>
};

export default Modal;
