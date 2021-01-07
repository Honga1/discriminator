import { RangeInput, FormField } from "grommet";

export const ProgressIndicator = () => {
  return (
    <FormField label="progress">
      <RangeInput min={0} max={1} />
    </FormField>
  );
};
