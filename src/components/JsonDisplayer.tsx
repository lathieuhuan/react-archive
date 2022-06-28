interface JsonDisplayerProps {
  title: string;
  body: object;
  bodyStyle?: React.CSSProperties;
}
export default function JsonDisplayer(props: JsonDisplayerProps) {
  return (
    <div className="border-1 border-slate-300 rounded">
      <div className="px-4 py-2 bg-slate-200">
        <h3 className="text-2xl font-semibold">{props.title}</h3>
      </div>
      <p
        className="w-full px-4 py-2 overflow-hidden whitespace-pre"
        style={props.bodyStyle}
      >
        {JSON.stringify(props.body, null, 2)}
      </p>
    </div>
  );
}
