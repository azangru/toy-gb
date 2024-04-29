# Tracks as web components on their own?

Could it be something like this?

```
<genome-browser genome-id="human" location="1:12000-15000">
  <gb-track type="focus-gene" gene-stable-id="blah"><gb-track>
  <gb-track type="genes-and-transcripts" id="blah"><gb-track>
<genome-browser>
```




# Todo
- Drag event - DONE
- Zoom event - DONE
- Rerender on resize — DONE
- Switch rendering at a certain zoom level
- Zoom should use cursor position as center
- Pass location from outside
- Fetch data



# Cursor interactions
- isPointInPath – https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath


# Dragging and data fetching
- [Horizontal Scrolling on Canvas](https://stackoverflow.com/questions/14368716/horizontal-scrolling-on-canvas-html5)
- https://www.simile-widgets.org/timeline/
