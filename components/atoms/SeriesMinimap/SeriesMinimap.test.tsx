import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SeriesMinimap, type MinimapRoom } from './SeriesMinimap';

// jsdom has no real canvas 2D — stub it out
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
  });
  vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(0));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const ROOMS: MinimapRoom[] = [
  { slug: 'intro', title: 'Introduction', state: 'cleared' },
  { slug: 'middle', title: 'Middle Chapter', state: 'current' },
  { slug: 'finale', title: 'The Finale', state: 'unread' },
];

describe('SeriesMinimap', () => {
  it('renders a canvas element', () => {
    render(<SeriesMinimap rooms={ROOMS} />);
    expect(screen.getByRole('img', { name: 'Series minimap' })).toBeInTheDocument();
  });

  it('renders legend items only for states present in rooms', () => {
    render(<SeriesMinimap rooms={ROOMS} />);
    expect(screen.getByText('Cleared')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('Unread')).toBeInTheDocument();
    expect(screen.queryByText('Boss')).not.toBeInTheDocument();
  });

  it('shows boss legend item when a boss room is present', () => {
    const rooms: MinimapRoom[] = [{ slug: 'boss', title: 'Boss Room', state: 'boss' }];
    render(<SeriesMinimap rooms={rooms} />);
    expect(screen.getByText('Boss')).toBeInTheDocument();
  });

  it('shows the current room title in the tooltip by default', () => {
    render(<SeriesMinimap rooms={ROOMS} />);
    expect(screen.getByText('Middle Chapter')).toBeInTheDocument();
  });

  it('renders an empty tooltip when no current room has a title', () => {
    const rooms: MinimapRoom[] = [
      { slug: 'a', state: 'cleared' },
      { slug: 'b', state: 'unread' },
    ];
    render(<SeriesMinimap rooms={rooms} />);
    // No title to display — tooltip paragraph is present but empty
    const tooltip = document.querySelector('[class*="tooltip"]');
    expect(tooltip?.textContent).toBe('');
  });

  it('calls onRoomClick when a room on the canvas is clicked', () => {
    const onRoomClick = vi.fn();
    render(<SeriesMinimap rooms={ROOMS} onRoomClick={onRoomClick} />);
    const canvas = screen.getByRole('img');

    // Mock getBoundingClientRect so the coordinate math hits room 0
    canvas.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    });
    Object.defineProperty(canvas, 'width', { value: 200, configurable: true });
    Object.defineProperty(canvas, 'height', { value: 100, configurable: true });

    // Click at the centre of the first room cell (PAD=6, CELL_W=20, CELL_H=16)
    fireEvent.click(canvas, { clientX: 16, clientY: 14 });
    expect(onRoomClick).toHaveBeenCalledWith(ROOMS[0]);
  });

  it('does not throw when onRoomClick is omitted and canvas is clicked', () => {
    render(<SeriesMinimap rooms={ROOMS} />);
    const canvas = screen.getByRole('img');
    canvas.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    });
    expect(() => fireEvent.click(canvas, { clientX: 16, clientY: 14 })).not.toThrow();
  });

  it('renders with an empty rooms array without throwing', () => {
    expect(() => render(<SeriesMinimap rooms={[]} />)).not.toThrow();
  });
});
