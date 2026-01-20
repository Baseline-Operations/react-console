[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / getStorage

# Function: getStorage()

> **getStorage**(): `ApplicationStorage`

Defined in: src/utils/storage.ts:802

Get current application storage instance

Automatically initializes storage if not already initialized.
Uses app ID derived from process.cwd().

## Returns

`ApplicationStorage`

ApplicationStorage instance for current application

## Example

```ts
import { storage } from 'react-console';

// Use storage (automatically initialized)
storage.setItem('username', 'john');
const username = storage.getItem('username');
```
