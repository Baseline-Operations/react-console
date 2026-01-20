[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / Theme

# Interface: Theme

Defined in: src/theme/types.ts:86

Complete theme definition

Contains all theme values including colors, component styles, and text styles.

## Properties

### name

> **name**: `string`

Defined in: src/theme/types.ts:88

Theme name

***

### colors

> **colors**: [`ThemeColors`](ThemeColors.md)

Defined in: src/theme/types.ts:90

Color palette

***

### components

> **components**: [`ComponentTheme`](ComponentTheme.md)

Defined in: src/theme/types.ts:92

Component-specific styles

***

### textStyles?

> `optional` **textStyles**: `object`

Defined in: src/theme/types.ts:94

Global text styles

#### heading?

> `optional` **heading**: `Partial`\<`TextStyle`\>

Heading text style

#### body?

> `optional` **body**: `Partial`\<`TextStyle`\>

Body text style

#### caption?

> `optional` **caption**: `Partial`\<`TextStyle`\>

Caption text style

#### code?

> `optional` **code**: `Partial`\<`TextStyle`\>

Code text style
