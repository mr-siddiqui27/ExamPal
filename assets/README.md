# Assets Directory

This directory is intended for storing static assets such as:

- Icons and images
- Logo files
- Background images
- UI graphics
- Any other media files

## Current Status

Currently, the project uses Font Awesome icons loaded from CDN. In the future, you may want to:

1. Download and host icons locally for better performance
2. Add custom graphics and logos
3. Include background images for enhanced UI
4. Add placeholder images for various sections

## File Types Supported

- Images: PNG, JPG, SVG, WebP
- Icons: SVG, PNG
- Other: PDF, DOC (for sample papers)

## Usage

Assets can be referenced in the HTML, CSS, or JavaScript files using relative paths:

```html
<img src="assets/logo.png" alt="ExamPal Logo">
```

```css
.hero-section {
    background-image: url('../assets/hero-bg.jpg');
}
```
