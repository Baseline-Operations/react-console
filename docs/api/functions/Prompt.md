[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Prompt

# Function: Prompt()

> **Prompt**(`__namedParameters`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/interactive/Prompt.tsx:58](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Prompt.tsx#L58)

Prompt component - Question/answer prompts with validation

Displays a question and an input field. Validates input and shows errors.
Supports Enter to submit, Escape to cancel.

## Parameters

### \_\_namedParameters

[`PromptProps`](../interfaces/PromptProps.md)

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

## Example

```tsx
<Prompt
  question="Enter your name:"
  validate={(value) => (value.length < 3 ? 'Name must be at least 3 characters' : undefined)}
  onSubmit={(value) => console.log(`Hello, ${value}!`)}
  required
/>
```
