import Input from "../ui/input/Input";
import Select from "../ui/select-dropdown/Select";
import Checkbox from "../ui/checkbox/Checkbox";
import FileUpload from "../ui/fileupload/FileUpload";
import RangeDatePicker from "../ui/datePicker/RangeDatePicker";
import TextArea from "../ui/text-area/TextArea";
import Label from "../ui/label/Label"

import { Controller } from "react-hook-form";

const FieldRenderer = ({ field, control, errors, isEdit = false }) => {
  const errorMsg = errors?.[field.name]?.message;

  switch (field.type) {
    case "label":
      return (
        <Controller
          name={field.name}
          control={control}
          defaultValue={field.defaultValue || ""}
          render={({ field: controllerField }) => (
            <Label text={controllerField.value} />
          )}
        />
      );

    case "input":
      return (
        <Controller
          name={field.name}
          control={control}
          defaultValue=""
          render={({ field: controllerField }) => (
            <div>
              <Input
                {...controllerField}
                label={field.label}
                placeholder={field.placeholder}
                inputProps={field.inputProps}
                error={errorMsg}
                disabled={isEdit ? false : field.disabled}
              />
            </div>
          )}
        />
      );
    case "text-area":
      return (
        <Controller
          name={field.name}
          control={control}
          defaultValue=""
          render={({ field: controllerField }) => (
            <div>
              <TextArea
                {...controllerField}
                label={field.label}
                placeholder={field.placeholder}
                inputProps={field.inputProps}
                error={errorMsg}
                disabled={isEdit ? false : field.disabled}
              />
            </div>
          )}
        />
      );

    case "select":
      return (
        <div>
          <Select
            name={field.name}
            label={field.label}
            options={field.options}
            multi={field.multi}
            control={control}
          />
          {errorMsg && <p className="text-sm text-red-500 mt-1">{errorMsg}</p>}
        </div>
      );

    case "checkbox":
      return (
        <div>
          <Checkbox
            name={field.name}
            label={field.label}
            options={field.options}
            control={control}
          />
          {errorMsg && <p className="text-sm text-red-500 mt-1">{errorMsg}</p>}
        </div>
      );

    case "file":
      return (
        <div>
          <FileUpload
            name={field.name}
            label={field.label}
            control={control}
            accept={field.accept}
            maxSizeMB={field.maxSizeMB}
          />
        </div>
      );

    case "date-range":
      return (
        <div>
          <RangeDatePicker
            name={field.name}
            label={field.label}
            control={control}
          />
          {errorMsg && <p className="text-sm text-red-500 mt-1">{errorMsg}</p>}
        </div>
      );

    default:
      return null;
  }
};

export default FieldRenderer;
