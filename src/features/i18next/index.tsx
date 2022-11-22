import type { ChangeEventHandler, ReactNode } from "react";
import { Suspense, useState } from "react";
import i18n from "i18next";
import { Trans, useTranslation } from "react-i18next";
import Button from "@Src/components/Button";
import InputBox from "@Src/components/InputBox";

// i18n is init in ./i18n

export default function I18next() {
  const { t } = useTranslation();
  const [egg, setEgg] = useState(0);

  const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Suspense fallback="Loading...">
      <div className="flex flex-wrap gap-16">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-2xl">{t("title")}</h3>
            <p className="text-sm italic">{t("title", { ns: "ns2" })}</p>
          </div>

          <div>
            <p className="mb-2">{t("choose your language")}:</p>
            <select className="px-2 py-1" name="language" onChange={onChange}>
              <option value="en">English</option>
              <option value="vi">Vietnamese</option>
            </select>
          </div>

          <p>
            <Trans components={{ b: <b />, i: <i /> }}>
              translate and add markups
            </Trans>
          </p>

          <p>
            <T>{"<Trans />"} with reusable components property</T>
          </p>

          <div>
            <Trans components={{ p: <p />, RC: <Example /> }}>
              it can replace markups in translation with react component
            </Trans>
          </div>

          <div>
            {/* key must be 'count' to trigger _one, _other... */}
            {/* see more: https://www.i18next.com/translation-function/plurals */}
            <p>
              {t("pass values to translation", {
                count: egg,
                string: "string",
              })}
            </p>
            <div className="mt-2 flex gap-2">
              <Button onClick={() => setEgg(egg + 1)}>Give 1 more egg</Button>
              <Button
                className="bg-red-700 hover:bg-red-600"
                onClick={() => setEgg(0)}
              >
                Take all back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

interface TProps {
  components?: Record<string, JSX.Element>;
  children: ReactNode;
}
function T(props: TProps) {
  return (
    <Trans
      components={{
        custom: <span className="text-red-600" />,
        ...props.components,
      }}
    >
      {props.children}
    </Trans>
  );
}

function Example() {
  const [value, setValue] = useState("");
  return (
    <div className="mt-2 p-4 rounded border border-slate-300">
      <p>This is a React Component</p>
      <InputBox
        className="mt-2"
        placeholder="..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button className="ml-2" onClick={() => console.log(value)}>
        Log
      </Button>
    </div>
  );
}
