[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / Overlay

# Function: Overlay()

> **Overlay**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/layout/Overlay.tsx:47

Overlay component - Layered rendering for modals and popups

Provides modal/popup functionality with layering support. Overlays render
on top of other content with configurable z-index and optional backdrop.
Supports focus trapping (focus remains within overlay when open).

## Parameters

### props

[`OverlayProps`](../interfaces/OverlayProps.md)

Overlay component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing an overlay container

## Example

```tsx
<Overlay zIndex={2000} backdrop={true}>
  <Text>Modal Content</Text>
  <Button onClick={() => closeModal()}>Close</Button>
</Overlay>
```
