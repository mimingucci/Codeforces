import { Skeleton, TableRow, TableCell } from '@mui/material';

const TableSkeleton = ({ rowsNum = 5, columnsNum = 4 }) => {
  return [...Array(rowsNum)].map((_, index) => (
    <TableRow key={index}>
      {[...Array(columnsNum)].map((_, colIndex) => (
        <TableCell key={colIndex}>
          <Skeleton animation="wave" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableSkeleton;