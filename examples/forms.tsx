/**
 * Forms Example - Complete form with all field types
 * Demonstrates: Input, Radio, Dropdown, Checkbox, Multiline, validation, submit/reset
 * Uses flexbox for two-column layout
 */

import React, { useState } from 'react';
import {
  render,
  Text,
  View,
  TextInput,
  Button,
  Radio,
  Dropdown,
  Checkbox,
  Box,
  StyleSheet,
} from '../src/index';

const styles = StyleSheet.create({
  container: {
    padding: 1,
  },
  title: {
    color: 'cyan',
    bold: true,
  },
  subtitle: {
    color: 'gray',
    dim: true,
  },
  twoColumns: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    margin: { top: 1 },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  sectionTitle: {
    color: 'yellow',
    bold: true,
  },
  field: {
    margin: { top: 1 },
  },
  error: {
    color: 'red',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    margin: { top: 1 },
  },
  successBox: {
    border: 'single',
    borderColor: 'green',
    padding: 1,
    margin: { top: 1 },
  },
});

interface FormData {
  name: string;
  email: string;
  age: number | string;
  role: string | number;
  country: string | number;
  interests: (string | number)[];
  bio: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  role?: string;
  country?: string;
  interests?: string;
  bio?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: '',
    role: '',
    country: '',
    interests: [],
    bio: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value?.trim()) return 'Required';
        if (value.length < 2) return 'Min 2 chars';
        return undefined;
      case 'email':
        if (!value?.trim()) return 'Required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid';
        return undefined;
      case 'age':
        if (value === '' || value === null) return 'Required';
        const num = typeof value === 'number' ? value : parseInt(String(value), 10);
        if (isNaN(num) || num < 18 || num > 120) return '18-120';
        return undefined;
      case 'role':
        return !value ? 'Required' : undefined;
      case 'country':
        return !value ? 'Required' : undefined;
      case 'interests':
        return !Array.isArray(value) || value.length === 0 ? 'Select 1+' : undefined;
      case 'bio':
        if (!value?.trim()) return 'Required';
        return value.length < 10 ? 'Min 10 chars' : undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    for (const key of Object.keys(formData) as (keyof FormData)[]) {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const allTouched: Record<string, boolean> = {};
    for (const key of Object.keys(formData)) allTouched[key] = true;
    setTouched(allTouched);
    if (validateAll()) setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', age: '', role: '', country: '', interests: [], bio: '' });
    setErrors({});
    setTouched({});
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const roleOptions = [
    { label: 'Developer', value: 'dev' },
    { label: 'Designer', value: 'design' },
    { label: 'Manager', value: 'mgr' },
  ];

  const countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
    { label: 'Germany', value: 'de' },
  ];

  const interestOptions = [
    { label: 'Tech', value: 'tech' },
    { label: 'Design', value: 'design' },
    { label: 'Business', value: 'biz' },
  ];

  const errorCount = Object.values(errors).filter(Boolean).length;

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text color="green" bold>
          ✓ Form Submitted!
        </Text>
        <Box style={styles.successBox}>
          <Text color="cyan" bold>
            Submitted Data:
          </Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text>Name: {formData.name}</Text>
              <Text>Email: {formData.email}</Text>
              <Text>Age: {String(formData.age)}</Text>
            </View>
            <View style={styles.column}>
              <Text>Role: {String(formData.role)}</Text>
              <Text>Country: {String(formData.country)}</Text>
              <Text>Interests: {formData.interests.join(', ')}</Text>
            </View>
          </View>
          <Text>Bio: {formData.bio}</Text>
        </Box>
        <View style={styles.actions}>
          <Button onClick={() => setSubmitted(false)} label="Edit" />
          <Button
            onClick={() => {
              setSubmitted(false);
              handleReset();
            }}
            label="New"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Form</Text>
      <Text style={styles.subtitle}>
        Tab: navigate | Arrows: select | Enter/Space: confirm | Click to focus
      </Text>

      {/* Two-column layout */}
      <View style={styles.twoColumns}>
        {/* Left Column */}
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Personal Info</Text>

          <View style={styles.field}>
            <Text>
              Name {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder="Your name"
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text>
              Email{' '}
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="email@example.com"
            />
          </View>

          <View style={styles.field}>
            <Text>
              Age {touched.age && errors.age && <Text style={styles.error}>{errors.age}</Text>}
            </Text>
            <TextInput
              keyboardType="numeric"
              value={formData.age}
              onChangeText={(text) => updateField('age', text ? parseInt(text, 10) || text : '')}
              placeholder="25"
              min={18}
              max={120}
            />
          </View>

          <View style={styles.field}>
            <Text>
              Role {touched.role && errors.role && <Text style={styles.error}>{errors.role}</Text>}
            </Text>
            <Radio
              options={roleOptions}
              value={formData.role}
              onChange={(e) => updateField('role', e.value as string | number)}
            />
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.field}>
            <Text>
              Country{' '}
              {touched.country && errors.country && (
                <Text style={styles.error}>{errors.country}</Text>
              )}
            </Text>
            <Dropdown
              options={countryOptions}
              value={formData.country}
              onChange={(e) => updateField('country', e.value as string | number)}
              placeholder="Select..."
            />
          </View>

          <View style={styles.field}>
            <Text>
              Interests{' '}
              {touched.interests && errors.interests && (
                <Text style={styles.error}>{errors.interests}</Text>
              )}
            </Text>
            <Checkbox
              options={interestOptions}
              value={formData.interests}
              onChange={(e) => updateField('interests', e.value as (string | number)[])}
            />
          </View>

          <View style={styles.field}>
            <Text>
              Bio {touched.bio && errors.bio && <Text style={styles.error}>{errors.bio}</Text>}
            </Text>
            <TextInput
              value={formData.bio}
              onChangeText={(text) => updateField('bio', text)}
              placeholder="About yourself..."
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button onClick={handleSubmit} label="Submit" />
        <Button onClick={handleReset} label="Reset" />
        <Text color={errorCount === 0 ? 'green' : 'red'}>
          {errorCount === 0 ? '✓ Ready' : `✗ ${errorCount} errors`}
        </Text>
      </View>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
