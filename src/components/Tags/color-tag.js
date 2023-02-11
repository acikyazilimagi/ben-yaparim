export default function ColorTag({ text, color }) {
    return (
      <div className="p-3 max-w-xs min-w-fit" style={{backgroundColor: color}}>
        {text}
      </div>
    );
  }
  