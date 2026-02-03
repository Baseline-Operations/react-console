[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ErrorBoundaryProps

# Interface: ErrorBoundaryProps

Defined in: [src/components/ErrorBoundary.tsx:24](https://github.com/Baseline-Operations/react-console/blob/main/src/components/ErrorBoundary.tsx#L24)

Props for ErrorBoundary component

## Properties

### children

> **children**: `ReactNode`

Defined in: [src/components/ErrorBoundary.tsx:28](https://github.com/Baseline-Operations/react-console/blob/main/src/components/ErrorBoundary.tsx#L28)

Child components to render

---

### fallback?

> `optional` **fallback**: `ReactNode` \| (`error`, `errorInfo`) => `ReactNode`

Defined in: [src/components/ErrorBoundary.tsx:33](https://github.com/Baseline-Operations/react-console/blob/main/src/components/ErrorBoundary.tsx#L33)

Fallback UI to display when an error occurs
If not provided, a default error message will be shown

---

### onError()?

> `optional` **onError**: (`error`, `errorInfo`) => `void`

Defined in: [src/components/ErrorBoundary.tsx:37](https://github.com/Baseline-Operations/react-console/blob/main/src/components/ErrorBoundary.tsx#L37)

Callback called when an error is caught

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

#### Returns

`void`

---

### resetOnChange?

> `optional` **resetOnChange**: `boolean`

Defined in: [src/components/ErrorBoundary.tsx:42](https://github.com/Baseline-Operations/react-console/blob/main/src/components/ErrorBoundary.tsx#L42)

Whether to reset error state when children change
Default: true
