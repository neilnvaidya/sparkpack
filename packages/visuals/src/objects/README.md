# Objects library

Physical items (objects) used in visuals (e.g. shape classify, count objects). Each object has a **simple SVG drawing**—inline, no external assets—using regular shapes so they stay recognizable.

## Premade icon sets (optional alternatives)

If you prefer to swap in external artwork later:

- **Tabler Icons** (MIT) – [tabler-icons.io](https://tabler-icons.io) – 5800+ icons. Search for "package", "can", "cone", "box".
- **Phosphor Icons** (MIT) – [phosphoricons.com](https://phosphoricons.com)
- **Lucide** (ISC) – [lucide.dev](https://lucide.dev)

We use custom SVG drawings here so the set stays small, consistent, and dependency-free, and so we can match exact items (cereal box, bag, party hat, tin can) used in questions.

## Supported object IDs

- `bag` – bag (visual object only; not used in shape_classify)
- `box` – box/cuboid (used in shape_classify)
- `tin_can` – cylinder with rims
- `cereal_box` – tall box (cuboid) with packaging hint
- `party_hat` – cone with party-hat look
- `apple` – simple apple (for count_objects)
- `orange` – orange (for count_objects)
- `marble` – marble (for object_array)

Renderers that accept an `object` string use the library when the id is in this set; otherwise they fall back to a generic shape (e.g. by category or a default circle).
