interface ConnectToStateTemplateProps {
  desc: string;
  label: string;
  input: JSX.Element;
  value: number;
}
export const ConnectToStateTemplate = ({ desc, label, input, value }: ConnectToStateTemplateProps) => {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-slate-600 text-sm">{desc}</p>
      <div className="flex items-center space-x-3">
        <label className="font-medium">{label}</label>
        {input}
      </div>
      <p className="font-medium text-right">{value} :Value</p>
    </div>
  );
};
