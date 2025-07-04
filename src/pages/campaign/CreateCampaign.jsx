import React from 'react';
import FormBuilder from '../../components/form/FromBuilder';

const CreateCampaign = () => {
  const handleSubmit = (data) => {
    console.log('Form Data:', data);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <FormBuilder onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateCampaign;