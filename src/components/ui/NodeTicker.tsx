import { useEffect, useRef, useState } from 'react';

/**
 * Renders a node ID. If the text overflows its container it auto-scrolls
 * back and forth so the full name is always readable — no truncation.
 */
export function NodeTicker({ id }: { id: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const check = () => {
      if (containerRef.current && textRef.current) {
        setOverflows(textRef.current.scrollWidth > containerRef.current.clientWidth + 2);
      }
    };
    check();
    const ro = new ResizeObserver(check);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [id]);

  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 flex-1">
      <span
        ref={textRef}
        className={overflows ? 'node-ticker-scroll' : 'block truncate'}
        style={overflows ? ({ '--text-width': `${textRef.current?.scrollWidth ?? 0}px` } as React.CSSProperties) : {}}
      >
        {id}
      </span>
    </div>
  );
}
