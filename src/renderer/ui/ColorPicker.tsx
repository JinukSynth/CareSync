import React from 'react';
import { Box, Button, Popover } from '@mui/material';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const defaultColors = [
    '#FF6B6B', // 빨간색
    '#4ECDC4', // 청록색
    '#45B7D1', // 하늘색
    '#96CEB4', // 민트
    '#FFEEAD', // 노란색
    '#FFD93D', // 주황색
    '#6C5CE7', // 보라색
    '#A8E6CF', // 연두색
    '#FF8B94', // 분홍색
    '#A8D8EA', // 파스텔 블루
    '#FFB6C1', // 연한 분홍색
    '#FFA07A', // 연어색
    '#20B2AA', // 연한 청록색
    '#87CEFA', // 연한 하늘색
    '#778899', // 슬레이트 그레이
    '#B0E0E6', // 파우더 블루
    '#E6E6FA', // 라벤더
    '#F0E68C', // 카키
    '#ADFF2F', // 그린 옐로우
    '#8A2BE2', // 블루 바이올렛
    '#DDA0DD', // 플럼
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorSelect = (color: string) => {
    onChange(color);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button
        onClick={handleClick}
        sx={{
          minWidth: 'unset',
          width: 45,
          height: 45,
          p: 0,
          backgroundColor: value,
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: value,
            opacity: 0.8,
          },
        }}
      />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ display: 'none' }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1,
          }}
        >
          {defaultColors.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorSelect(color)}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: color,
                borderRadius: '50%',
                cursor: 'pointer',
                border: value === color ? '2px solid #333' : '2px solid transparent',
                '&:hover': {
                  opacity: 0.8,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            />
          ))}
          <Box
            onClick={() => (document.querySelector('input[type="color"]') as HTMLInputElement)?.click()}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              cursor: 'pointer',
              background: 'linear-gradient(45deg, #f00 0%, #ff0 20%, #0f0 40%, #0ff 60%, #00f 80%, #f0f 100%)',
              '&:hover': {
                opacity: 0.8,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          />
        </Box>
      </Popover>
    </Box>
  );
};
export default ColorPicker;