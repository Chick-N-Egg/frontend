import { useLayoutEffect, useRef, useState } from 'react';
import type { Result } from '../../api/types';
import { computeOrbitalLayout } from './orbitalLayout';
import { CenterNode } from './CenterNode';
import { OrbitNode } from './OrbitNode';

interface NetworkMapProps {
  centerLabel: string;
  results: Result[];
  onNodeClick: (result: Result) => void;
  pendingResultId?: string;
}

export function NetworkMap({ centerLabel, results, onNodeClick, pendingResultId }: NetworkMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layouts = computeOrbitalLayout(results, size.width / 2, size.height / 2);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {size.width > 0 && (
        <>
          <CenterNode label={centerLabel} />
          {layouts.map((layout, i) => (
            <OrbitNode
              key={layout.result.id}
              layout={layout}
              index={i}
              onClick={() => onNodeClick(layout.result)}
              isPending={pendingResultId === layout.result.id}
            />
          ))}
        </>
      )}
    </div>
  );
}
