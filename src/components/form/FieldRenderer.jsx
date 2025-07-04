import Input from '../ui/input/Input'
import Select from '../ui/select-dropdown/Select';
import Checkbox from '../ui/checkbox/Checkbox';
import FileUpload from '../ui/fileupload/FileUpload';
import RangeDatePicker from '../ui/datePicker/RangeDatePicker';

const FieldRenderer = ({ field, control, errors }) => {
  switch (field.type) {
    case 'input':
      return (
        <Input
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          inputProps={field.inputProps}
          error={errors?.[field.name]?.message}
        />
      );
    case 'select':
      return (
        <Select
          name={field.name}
          label={field.label}
          options={field.options}
          control={control}
          inputProps={field.inputProps}
        />
      );
    case 'checkbox':
      return (
        <Checkbox
          name={field.name}
          label={field.label}
          options={field.options}
          control={control}
        />
      );
    case 'file':
      return (
        <FileUpload
          name={field.name}
          label={field.label}
          control={control}
          accept={field.accept}
          maxSizeMB={field.maxSizeMB}
        />
      );
    case 'date-range':
      return (
        <RangeDatePicker
          name={field.name}
          label={field.label}
          control={control}
        />
      );
    default:
      return null;
  }
};

export default FieldRenderer;