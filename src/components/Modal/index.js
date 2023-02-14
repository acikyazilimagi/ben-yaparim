import React from "react";

export default function Modal({ title, children, show, close }) {
  return (
    show && (
      <div className="flex bottom-0 top-0 left-0 right-0 justify-center items-center fixed z-50 shadow-md hover:shadow-xl p-8 bg-black bg-opacity-80">
        <div
          className="p-5 rounded-md bg-white w-[50%] h-[100%]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between items-center ">
            <p className="text-3xl font-bold my-5">{title}</p>
            <button
              onClick={() => close()}
              className="h-8 w-8 fill-transparent hover:bg-hover focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 stroke-2 stroke-black hover:bg-hover"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    )
  );
}
