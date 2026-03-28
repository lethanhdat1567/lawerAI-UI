/**
 * tiptap-extension-resize-image serializes alignment/width as non-standard
 * `containerstyle` / `wrapperstyle` attributes on `<img>`. Browsers ignore those
 * for layout; the editor uses them on wrapper divs in the NodeView. Rebuild
 * that structure so read-only preview matches the canvas.
 */
export function normalizeImageResizeHtmlForPreview(html: string): string {
  if (typeof document === "undefined") return html;

  const trimmed = html.trim();
  if (!trimmed || !/<img\b/i.test(trimmed)) return html;

  try {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = trimmed;

    const imgs = wrapper.querySelectorAll("img");
    imgs.forEach((img) => {
      const cRaw =
        img.getAttribute("containerstyle") ??
        img.getAttribute("containerStyle");
      const wRaw =
        img.getAttribute("wrapperstyle") ??
        img.getAttribute("wrapperStyle");
      if (!cRaw?.trim() && !wRaw?.trim()) return;

      const outer = document.createElement("div");
      const inner = document.createElement("div");
      if (wRaw?.trim()) outer.setAttribute("style", wRaw);
      if (cRaw?.trim()) inner.setAttribute("style", cRaw);

      img.removeAttribute("containerstyle");
      img.removeAttribute("containerStyle");
      img.removeAttribute("wrapperstyle");
      img.removeAttribute("wrapperStyle");

      const parent = img.parentNode;
      if (!parent) return;
      parent.insertBefore(outer, img);
      outer.appendChild(inner);
      inner.appendChild(img);
    });

    return wrapper.innerHTML;
  } catch {
    return html;
  }
}
