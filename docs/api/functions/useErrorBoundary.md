[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / useErrorBoundary

# Function: useErrorBoundary()

> **useErrorBoundary**(): `object`

Defined in: [src/components/ErrorBoundary.tsx:204](https://github.com/Baseline-Operations/react-console/blob/main/src/components/ErrorBoundary.tsx#L204)

Hook to reset error boundary (useful for programmatic error recovery)

Note: This is a workaround since we can't directly access ErrorBoundary state.
Consider using a key prop on ErrorBoundary to force remount instead.

## Returns

`object`

### resetErrorBoundary()

> **resetErrorBoundary**: () => `void`

#### Returns

`void`

## Example

```tsx
const [errorKey, setErrorKey] = useState(0);

<ErrorBoundary key={errorKey}>
  <App />
</ErrorBoundary>;

// Reset by changing key
setErrorKey((prev) => prev + 1);
```
