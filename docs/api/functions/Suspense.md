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

### props

[`SuspenseProps`](../interfaces/SuspenseProps.md)

Key props:

- `fallback?: ReactNode` - Custom fallback UI to show while loading
- `loadingText?: string` - Simple text to display during loading (uses ActivityIndicator)
- `children: ReactNode` - The async content to render

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
