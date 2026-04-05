import '@testing-library/jest-dom'

// Recharts uses ResizeObserver internally via ResponsiveContainer
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// SVG text measurement not available in jsdom
if (typeof window !== 'undefined' && window.SVGElement) {
  window.SVGElement.prototype.getComputedTextLength = () => 0
  window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 })
}
