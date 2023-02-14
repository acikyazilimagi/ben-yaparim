import { useState } from 'react';
import Share from "@/src/components/icons/Share";

export default function ShareOptions({id}) {
  const [showModal, setShowModal] = useState(false);
  const [buttonText, setButtonText] = useState('Copy');

  const changeText = (text) => setButtonText(text);

  return (
    <>
      <button type="button" onClick={() => setShowModal(true)}>
        <Share className="w-6 h-6"/>
      </button>

      {showModal ? (
        <div
          aria-hidden="true"
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full bg-black bg-opacity-80"
        >
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none h-4/5">
            <div className="relative w-auto mx-auto max-w-3xl">
              {/* content */}
              <div className="shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex justify-between min-w-full absolute">
                  <div />
                  <button
                    onClick={() => setShowModal(false)}
                    className="h-10 w-10 m-4 fill-transparent hover:bg-hover focus:outline-none"
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
                <div className="flex items-start justify-between px-5 mt-16">
                  <h4>Bu çağrının bağlantısını paylaşın</h4>
                </div>
                {/* body */}
                <div className="relative p-6 flex-auto ">
                  <ul className="my-4 flex justify-between">
                    <li className="inline-block">
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            `https://twitter.com/intent/tweet?text=${window.location.href}${id}`,
                            '_blank'
                          )
                        }
                        className="p-2 hover:bg-hover"
                      >
                        <span className="justify-center items-center flex mb-2">
                          <svg
                            className="w-6 h-6"
                            fill="#D81860"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </span>
                        Twitter
                      </button>
                    </li>
                    <li className="inline-block">
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                            '_blank'
                          )
                        }
                        className="p-2 hover:bg-hover"
                      >
                        <span className="justify-center items-center flex mb-2">
                          <svg
                            className="w-6 h-6"
                            fill="#D81860"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </span>
                        Facebook
                      </button>
                    </li>
                    <li className="inline-block">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          changeText('Copied!');
                        }}
                        className="p-2 hover:bg-hover"
                      >
                        <span className="justify-center items-center flex mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mx-2"
                            fill="#D81860"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                        </span>
                        {buttonText}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
