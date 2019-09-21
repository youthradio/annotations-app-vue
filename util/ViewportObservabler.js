class ViewportObservabler {
  constructor (callback, { interval = 0 } = {}) {
    this.callback = callback
    this._i = 0
    this._top = -1
    this._bottom = -1
    this._interval = interval
    const style = 'position:absolute;width:1px;height:100%;margin:0;padding:0;top:0;left:0;visibility:hidden;pointer-events:none'
    this._probe = document.createElement('div')
    this._probe.style.cssText = `${style};display:none;`

    this._observer = new IntersectionObserver(this._handle.bind(this))
    this._attach(this._probe)
  }

  // Remove all probes.
  disconnect () {
    this._detach(this._probe)
  }

  // IntersectionObserver callback.
  _handle (entries) {
    const n = ++this._i % 2
    this._toggle(this._probe, n)
    if (!entries[n]) { return }
    const { top, bottom } = entries[n].intersectionRect
    if (top !== this._top || bottom !== this._bottom) {
      this._top = top
      this._bottom = bottom
      this.callback.call(null, [top, bottom])
    }
  }

  // Attach and observe a probe.
  _attach (probe) {
    document.body.appendChild(probe)
    this._observer.observe(probe)
  }

  // Toggle probe properties.
  _toggle (probe, status) {
    if (status) { setTimeout(() => { probe.style.display = 'block' }, this._interval) } else { probe.style.display = 'none' }
  }

  // Unobserve and detach probe.
  _detach (probe) {
    this._observer.unobserve(probe)
    if (probe.parentNode) { probe.parentNode.removeChild(probe) }
  }
}
function clamp (a, b, v) {
  return v < a ? a : v > b ? b : v
}

export { ViewportObservabler, clamp }
