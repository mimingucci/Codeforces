import { Skeleton, Box } from '@mui/material';

const ComponentSkeleton = ({ 
  height = '100%',
  width = '100%',
  variant = 'rectangular',
  animation = 'wave',
  className = ''
}) => {
  return (
    <Box className={`w-full h-full ${className}`}>
      <Skeleton
        variant={variant}
        animation={animation}
        height={height}
        width={width}
        sx={{
          transform: 'none', // Prevents unwanted scaling
          transformOrigin: 'unset',
        }}
      />
    </Box>
  );
};

export default ComponentSkeleton;