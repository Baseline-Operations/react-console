[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Suspense

# Function: Suspense()

> **Suspense**(`__namedParameters`): `Element`

Defined in: [src/components/Suspense.tsx:35](https://github.com/Baseline-Operations/react-console/blob/main/src/components/Suspense.tsx#L35)

Suspense component - React Suspense boundary for async operations

Wraps components that use async data fetching or lazy loading.
Shows fallback UI while async operations are in progress.

## Parameters

### \_\_namedParameters

[`SuspenseProps`](../interfaces/SuspenseProps.md)

## Returns

`Element`

## Example

```tsx
<Suspense fallback={<ActivityIndicator label="Loading..." />}>
  <AsyncComponent />
</Suspense>

<Suspense loadingText="Loading data...">
  <LazyComponent />
</Suspense>
```
