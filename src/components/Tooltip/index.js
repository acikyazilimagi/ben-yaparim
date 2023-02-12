export default function Tooltip({ text }) {
  return (
    <div className="relative flex flex-col items-end group z-30 px-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24px"
        height="24px"
      >
        <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z" />
      </svg>

      <div className="absolute w-60 top-0 flex-col items-end hidden mt-5 group-hover:flex -mr-1.5">
        <div className="ml-2 -mb-[1px] inline-block overflow-hidden z-20">
          <div className="h-3 w-3 origin-bottom-left mr-3.5 rotate-45 transform border border-light-grey bg-white" />
        </div>
        <p className="relative text-xs z-10 p-2 bg-white text-black border border-light-grey leading-none whitespace-no-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}
