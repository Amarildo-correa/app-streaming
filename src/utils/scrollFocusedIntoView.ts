export function scrollFocusedIntoView(el: Element | null, block: ScrollLogicalPosition = 'nearest'): void {
  if (!(el instanceof HTMLElement)) return;
  el.scrollIntoView({ behavior: 'smooth', block, inline: 'center' });
}
