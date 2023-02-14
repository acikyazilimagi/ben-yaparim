export default function ColorTag({ text, color }) {
    return (
      <div className="py-1 px-5 max-w-xs w-fit h-7" style={{backgroundColor: color}}>
        {text}
      </div>
    );
  }
  