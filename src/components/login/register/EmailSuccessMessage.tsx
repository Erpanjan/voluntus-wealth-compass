
import React from 'react';

const EmailSuccessMessage: React.FC = () => {
  return (
    <div className="text-center space-y-4 py-4">
      <p className="text-green-600">Registration email sent!</p>
      <p>Please check your email to verify your account.</p>
    </div>
  );
};

export default EmailSuccessMessage;
