/**
 * Forms Example - Complete form with validation and submission
 * Demonstrates form handling, validation feedback, and error messages
 */

import React, { useState } from 'react';
import { render, Text, View, Input, Button, Radio, LineBreak, Box } from '../src/index';

interface FormData {
  name: string;
  email: string;
  age: number | string;
  role: string | number;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  role?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: '',
    role: 'user',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate age
    if (formData.age === '' || formData.age === null) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = typeof formData.age === 'number' ? formData.age : parseInt(String(formData.age), 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        newErrors.age = 'Age must be between 18 and 120';
      }
    }

    // Validate role
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitted(true);
    }
  };

  const roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
    { label: 'Moderator', value: 'moderator' },
    { label: 'Guest', value: 'guest' },
  ];

  if (submitted) {
    return (
      <View padding={2}>
        <Text color="green" bold>Form Submitted Successfully!</Text>
        <LineBreak />
        <Box
          style={{
            border: 'single',
            borderColor: 'green',
            padding: { top: 1, bottom: 1, left: 2, right: 2 },
            marginTop: 1,
          }}
        >
          <Text color="cyan" bold>Submitted Data:</Text>
          <Text>Name: {formData.name}</Text>
          <Text>Email: {formData.email}</Text>
          <Text>Age: {String(formData.age)}</Text>
          <Text>Role: {String(formData.role)}</Text>
        </Box>
        <LineBreak />
        <Button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', age: '', role: 'user' });
            setErrors({});
          }}
          label="Reset Form"
        />
      </View>
    );
  }

  return (
    <View padding={2}>
      <Text color="cyan" bold>Complete Form Example</Text>
      <LineBreak />
      
      <Text color="yellow" bold>Personal Information</Text>
      <LineBreak />

      <Text>Name *</Text>
      <Input
        type="text"
        value={formData.name}
        onChange={(event) => {
          setFormData({ ...formData, name: event.value as string });
          // Clear error when user starts typing
          if (errors.name) {
            setErrors({ ...errors, name: undefined });
          }
        }}
        placeholder="Enter your name"
        maxLength={50}
        pattern={/^[a-zA-Z\s]+$/}
        style={{ width: 40 }}
        autoFocus
      />
      {errors.name && <Text color="red">✗ {errors.name}</Text>}
      <LineBreak />

      <Text>Email *</Text>
      <Input
        type="text"
        value={formData.email}
        onChange={(event) => {
          setFormData({ ...formData, email: event.value as string });
          if (errors.email) {
            setErrors({ ...errors, email: undefined });
          }
        }}
        placeholder="your.email@example.com"
        pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
        style={{ width: 40 }}
      />
      {errors.email && <Text color="red">✗ {errors.email}</Text>}
      <LineBreak />

      <Text>Age * (18-120)</Text>
      <Input
        type="number"
        value={formData.age}
        onChange={(event) => {
          setFormData({ ...formData, age: event.value });
          if (errors.age) {
            setErrors({ ...errors, age: undefined });
          }
        }}
        placeholder="25"
        min={18}
        max={120}
        step={1}
        style={{ width: 30 }}
      />
      {errors.age && <Text color="red">✗ {errors.age}</Text>}
      <LineBreak />

      <Text>Role *</Text>
      <Radio
        options={roleOptions}
        value={formData.role}
        onChange={(event) => {
          setFormData({ ...formData, role: event.value as string | number });
          if (errors.role) {
            setErrors({ ...errors, role: undefined });
          }
        }}
        name="role-group"
      />
      {errors.role && <Text color="red">✗ {errors.role}</Text>}
      <LineBreak />

      <Box
        style={{
          border: 'single',
          borderColor: 'yellow',
          padding: { top: 1, bottom: 1, left: 2, right: 2 },
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        <Text color="yellow" bold>Validation Summary:</Text>
        {Object.keys(errors).length === 0 ? (
          <Text color="green">✓ All fields valid</Text>
        ) : (
          <Text color="red">
            ✗ {Object.keys(errors).length} error(s) found
          </Text>
        )}
      </Box>

      <Button
        onClick={handleSubmit}
        label="Submit Form"
        style={{ marginTop: 1 }}
      />

      <LineBreak />
      <Text color="gray" dim>* Required fields. Use Tab to navigate. Press Enter on Submit to submit.</Text>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
