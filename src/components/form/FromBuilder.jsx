import React from 'react';
import { useForm } from 'react-hook-form';
import FieldRenderer from './FieldRenderer';
import Button from '../ui/button/Button';
import { fields } from '../../util/Form-menu/campaign-fields';

// Helper to handle Tailwind grid classes safely
const getGridClass = (field, row) => {
  if (field.gridSpan === 3 || row.length === 1) return 'col-span-1 md:col-span-3';
  if (field.gridSpan === 2) return 'col-span-1 md:col-span-2';
  return 'col-span-1';
};

const FormBuilder = ({ onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white rounded-xl shadow space-y-6"
    >
      {fields.map((row, rowIdx) => (
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
