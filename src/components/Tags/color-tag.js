export default function ColorTag({ text, color }) {
    return (
      <div className="py-2 px-4 max-w-xs w-fit h-fit" style={{backgroundColor: color}}>
        {text}
      </div>
    );
  }
  