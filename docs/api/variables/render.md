[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / render

# Variable: render()

> `const` **render**: (`element`, `options?`) => `string` \| `void`

Defined in: [src/index.ts:8](https://github.com/Baseline-Operations/react-console/blob/main/src/index.ts#L8)

Main render entry point - renders React elements to console
This is the primary API for users

## Parameters

### element

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

The React element to render

### options?

Render options (mode, fullscreen, navigation, etc.)

#### mode?

`"static"` \| `"interactive"` \| `"fullscreen"`

#### fullscreen?

`boolean`

#### onUpdate?

() => `void`

#### appId?

`string`

#### navigation?

\{ `arrowKeyNavigation?`: `boolean`; `verticalArrowNavigation?`: `boolean`; `horizontalArrowNavigation?`: `boolean`; \}

#### navigation.arrowKeyNavigation?

`boolean`

#### navigation.verticalArrowNavigation?

`boolean`

#### navigation.horizontalArrowNavigation?

`boolean`

## Returns

`string` \| `void`

In static mode, returns the rendered output string; otherwise void
