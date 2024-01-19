import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import { Candidate } from '@/types';
import { VotedCandidate } from './index';

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export interface CustomDragLayerProps {
  allCandidates: Candidate[];
}

export default function CustomDragLayer({
  allCandidates,
}: CustomDragLayerProps) {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));
  const candidate = allCandidates.find((c) => c.address === item?.address);

  if (!isDragging) {
    return null;
  }
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-10 opacity-50">
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {itemType === 'candidate' && (
          <VotedCandidate candidate={candidate} rank={item.rank} />
        )}
      </div>
    </div>
  );
}
