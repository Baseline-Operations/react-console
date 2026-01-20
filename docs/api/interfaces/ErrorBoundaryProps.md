[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / ErrorBoundaryProps

# Interface: ErrorBoundaryProps

Defined in: src/components/ErrorBoundary.tsx:23

Props for ErrorBoundary component

## Properties

### children

> **children**: `ReactNode`

Defined in: src/components/ErrorBoundary.tsx:27

Child components to render

***

### fallback?

> `optional` **fallback**: `ReactNode` \| (`error`, `errorInfo`) => `ReactNode`

Defined in: src/components/ErrorBoundary.tsx:32

Fallback UI to display when an error occurs
If not provided, a default error message will be shown

***

### onError()?

> `optional` **onError**: (`error`, `errorInfo`) => `void`

Defined in: src/components/ErrorBoundary.tsx:36

Callback called when an error is caught

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

#### Returns

`void`

***

### resetOnChange?

> `optional` **resetOnChange**: `boolean`

Defined in: src/components/ErrorBoundary.tsx:41

Whether to reset error state when children change
Default: true
