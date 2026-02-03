[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ViewabilityConfig

# Interface: ViewabilityConfig

Defined in: src/components/data/FlatList.tsx:24

Viewability config for determining which items are visible

## Properties

### viewAreaCoveragePercentThreshold?

> `optional` **viewAreaCoveragePercentThreshold**: `number`

Defined in: src/components/data/FlatList.tsx:26

Minimum percentage of item that must be visible (0-100)

---

### itemVisiblePercentThreshold?

> `optional` **itemVisiblePercentThreshold**: `number`

Defined in: src/components/data/FlatList.tsx:28

Minimum percentage of item viewport that must be covered (0-100)

---

### waitForInteraction?

> `optional` **waitForInteraction**: `boolean`

Defined in: src/components/data/FlatList.tsx:30

Time to wait before firing viewability callbacks

---

### minimumViewTime?

> `optional` **minimumViewTime**: `number`

Defined in: src/components/data/FlatList.tsx:32

Minimum time item must be visible (ms)
