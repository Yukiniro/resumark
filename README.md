# Resumark

The `resumark` is a resume creator for markdown. It split markdown to blocks. And the user could set the style for everyone block( `h1` and `h2` tag ).
There is a online [demo](https://resumark.vercel.app/).

## Config

The `resumark` could set config in YAML format. For example:

```yaml
---
name: string
summary: string
avatarUrl: string
avatarShape: circle | rect
blockClassName: string
blockStyle: object
---
```

### name

The creator's name of resume.

### summary

The creator's summary of resume.

### avatarUrl

The creator's avatar image.

### avatarShape

The shape of avatar. It support rect and circle.

### blockClassName

The class for block dom.

### blockStyle

The style for block dom.
