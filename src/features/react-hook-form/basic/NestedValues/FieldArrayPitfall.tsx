import Pitfall from "../../../../components/Pitfall";

export default function FieldArrayPitfall() {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xl text-purple-700">
        Pitfall: display errors on socials
      </h4>

      <Pitfall
        context={[
          "Require atleast N fields.",
          "Required type & url on each field.",
          "Number of default fields is less than N.",
        ]}
        reproduceSteps={[
          "Submit and get error about number of fields.",
          "Add more field to reach N but error does not change/disappear.",
        ]}
        failedSolutions={[
          [
            <>
              Manually re-validate socials (with trigger) when adding new field,
              but doing so will validate the newly added field which has not
              been touched.
            </>,
            <>
              Check socialsTouched before render error will not show error in
              case user has not touched the field but submit with less than N
              fields.
            </>,
          ],
        ]}
        finalSolution={
          <>
            Check socials.length {"<"} N && formState.isSubmitted to render
            error.
          </>
        }
      />

      <Pitfall
        context="Like above"
        reproduceSteps={[
          <>
            Change type/url of a field, these values will not be validated when
            number of fields is less than N.
          </>,
          <>
            (?) Resolver validates that criteria first and stop there on error,
            although criteriaMode is "all".
          </>,
        ]}
      />

      <Pitfall
        context="Like above but N = 2 and 1 default field, disable add field when there's a field invalid."
        reproduceSteps={[
          <>B1: Fill the default field to make it valid</>,
          <>B2: Submit to get number of fields error, add 1 more field.</>,
          <>
            B3a: If reValidateMode is "onBlur", focus an input then blur, show
            error that will not disappear when input turns valid.
          </>,
          <>
            B3b: Opposite of B3a. If reValidateMode is "onChange", focus an
            input then blur, error will not be shown.
          </>,
        ]}
      />
    </div>
  );
}
