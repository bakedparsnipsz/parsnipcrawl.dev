import '@testing-library/jest-dom';

// Radix UI uses pointer/scroll APIs that jsdom doesn't implement
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};
Element.prototype.scrollIntoView = () => {};
