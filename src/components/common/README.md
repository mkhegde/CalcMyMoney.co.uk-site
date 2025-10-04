# Common layout primitives

This folder contains composable layout primitives that keep page spacing and widths consistent across the site.

## `Container`

`Container` centralises width and horizontal padding logic. It defaults to the standard `max-w-7xl` wrapper with responsive padding, but exposes props when a section needs something different.

```jsx
import Container from '@/components/common/Container';

<Container paddingY="lg">
  <h2>Consistent content width</h2>
</Container>
```

Key props:

- `width`: preset keys (`"default"`, `"wide"`, `"snug"`, `"narrow"`, `"full"`) or custom Tailwind classes.
- `paddingX`: horizontal padding presets (`"default"`, `"compact"`, `"wide"`, `"none"`) or a custom string.
- `paddingY`: vertical spacing preset (`"xs"` → `py-4`, `"sm"` → `py-6`, `"md"` → `py-8`, `"lg"` → `py-12`, etc.) or custom Tailwind classes. Defaults to no vertical padding so that sections opt-in explicitly.
- `as`: renders a different HTML element if needed (e.g. `as="nav"`).

## `Section`

`Section` wraps content in a `Container` and applies site-wide background variants so that repeated sections remain visually aligned.

```jsx
import Section from '@/components/common/Section';

<Section variant="muted" spacing="xl">
  <h2 className="text-3xl font-semibold">FAQs</h2>
</Section>
```

Key props:

- `variant`: `"plain"` (default), `"muted"` (subtle tinted background), or `"inset"` (card-like container with border and shadow).
- `spacing`: vertical padding preset passed to the inner `Container`. Set to `false` when the section manages its own spacing.
- `width`/`paddingX`: forwarded to the underlying `Container` for layout tweaks.
- `contentClassName`: styles applied to the immediate content wrapper. With `variant="inset"` this targets the inset card, otherwise it wraps your children directly.
- `bleed`: set to `true` when you need to manage the container manually (e.g. full-bleed media sections).

Keep new pages consistent by using these primitives instead of re-declaring `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` blocks.
