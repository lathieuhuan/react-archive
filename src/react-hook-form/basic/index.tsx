import NestedValues from "./NestedValues";
import PlainValues from "./PlainValues";

const FORMS = [
  { heading: "Plain Values with Register Options", Component: PlainValues },
  { heading: "Nested Values with Yup Validation", Component: NestedValues },
];

export default function BasicForms() {
  return (
    <div className="px-8 py-4 flex gap-8">
      {FORMS.map(({ heading, Component }, i) => {
        return (
          <div key={i} className="w-96 min-w-[24rem]">
            <h1 className="mb-4 text-xl text-purple-700">{heading}</h1>
            <Component />
          </div>
        );
      })}
    </div>
  );
}
