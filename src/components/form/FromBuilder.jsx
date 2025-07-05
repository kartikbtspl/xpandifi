import React from 'react';
import { useForm } from 'react-hook-form';
import FieldRenderer from './FieldRenderer';
import Button from '../ui/button/Button';
import { fields } from '../../util/Form-menu/campaign-fields';

const getGridClass = (field, row) => {
  if (field.gridSpan === 3 || row.length === 1) return 'col-span-1 md:col-span-3';
  if (field.gridSpan === 2) return 'col-span-1 md:col-span-2';
  return 'col-span-1';
};

const FormBuilder = ({ onSubmit, dropdowns = {} }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // Inject dropdown options into the correct fields by name
  const injectedFields = fields.map(row =>
    row.map(field => {
      if (dropdowns[field.name]) {
        return { ...field, options: dropdowns[field.name] };
      }
      return field;
    })
  );

  const handleFormSubmit = (data) => {
    console.log("Form Data:", data);
    if (onSubmit) onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="p-6 bg-white rounded-xl shadow space-y-6"
    >
      {injectedFields.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {row.map((field) => (
            <div key={field.name} className={getGridClass(field, row)}>
              <FieldRenderer field={field} control={control} errors={errors} />
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-end">
        <Button type="submit" label="Create" />
      </div>
    </form>
  );
};

export default FormBuilder;