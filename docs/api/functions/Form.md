[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Form

# Function: Form()

> **Form**(`__namedParameters`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/Form.tsx:60](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Form.tsx#L60)

Form component - Form wrapper with validation and state management

Provides form state management, validation, and submission handling.
Collects values from form fields and validates them before submission.

## Parameters

### \_\_namedParameters

[`FormProps`](../interfaces/FormProps.md)

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

## Example

```tsx
<Form
  onSubmit={(values) => console.log('Submitted:', values)}
  onValidate={(values) => {
    const errors = [];
    if (!values.name) errors.push({ field: 'name', message: 'Name is required' });
    return { valid: errors.length === 0, errors };
  }}
>
  <TextInput name="name" placeholder="Name" />
  <TextInput name="email" placeholder="Email" />
  <Button type="submit">Submit</Button>
</Form>
```
