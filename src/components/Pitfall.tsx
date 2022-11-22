import classNames from "classnames";

type Description = string | string[] | JSX.Element | JSX.Element[];

interface PitfallProps {
  context: Description;
  reproduceSteps: Description;
  failedSolutions?: Description | Array<Description>;
  finalSolution?: Description;
}
export default function Pitfall(props: PitfallProps) {
  const { context, reproduceSteps, failedSolutions = [], finalSolution } = props;
  const fails = Array.isArray(failedSolutions)
    ? failedSolutions
    : [failedSolutions];

  return (
    <div className="px-4 py-2 rounded border border-slate-300 flex flex-col gap-2">
      <Block title="Context" body={context} />
      <Block title="Reproduce Steps" body={reproduceSteps} />
      {fails.map((fail, i) => {
        return (
          <Block
            key={i}
            title={`Try ${i + 1}`}
            titleClassName="text-red-600"
            body={fail}
          />
        );
      })}
      {finalSolution && (
        <Block
          title="Final Solution"
          titleClassName="text-green-600"
          body={finalSolution}
        />
      )}
    </div>
  );
}

interface BlockProps {
  title: string;
  titleClassName?: string;
  body: Description;
}
function Block(props: BlockProps) {
  return (
    <div>
      <h4
        className={classNames(
          "font-semibold",
          props.titleClassName || "text-blue-500"
        )}
      >
        {props.title}
      </h4>
      <div>
        {Array.isArray(props.body) ? (
          <ul className="list-disc list-inside">
            {props.body.map((line, i) => {
              return <li key={i}>{line}</li>;
            })}
          </ul>
        ) : (
          <p className="indent-4">{props.body}</p>
        )}
      </div>
    </div>
  );
}
