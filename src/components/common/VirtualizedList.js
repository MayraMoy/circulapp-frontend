// components/common/VirtualizedList.js - Lista virtualizada para mejor rendimiento
import React, { memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Box } from '@mui/material';

const VirtualizedList = memo(({ items, itemHeight = 100, height = 400, renderItem, ...props }) => {
  const Row = ({ index, style }) => <div style={style}>{renderItem(items[index], index)}</div>;

  return (
    <Box {...props}>
      <List height={height} itemCount={items.length} itemSize={itemHeight} width="100%">
        {Row}
      </List>
    </Box>
  );
});

export default VirtualizedList;
