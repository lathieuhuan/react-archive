import PlainValues from "./PlainValues";

const FORMS = [
  { heading: "Plain Values with Register Options", Component: PlainValues }
];

export default function BasicForms() {
  return (
    <div className="px-8 py-4">
      {FORMS.map(({ heading, Component }, i) => (
        <div key={i}>
          <h1 className="mb-4 text-xl text-red-600">{heading}</h1>
          <Component />
        </div>
      ))}
    </div>
  );
}
