import React from 'react';
import { User, Mail } from 'lucide-react';

const EditProfileFormFields = ({ formData, errors, onChange }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg bg-[#0d1325] border ${
            errors.name ? "border-red-500" : "border-gray-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-sky-500`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg bg-[#0d1325] border ${
            errors.email ? "border-red-500" : "border-gray-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-sky-500`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email}</p>
        )}
      </div>
    </>
  );
};

export default EditProfileFormFields;

