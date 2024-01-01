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
- Pass location from outside
- Fetch data




# Dragging and data fetching
- [Horizontal Scrolling on Canvas](https://stackoverflow.com/questions/14368716/horizontal-scrolling-on-canvas-html5)
- https://www.simile-widgets.org/timeline/
