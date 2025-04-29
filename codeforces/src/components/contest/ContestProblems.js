import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Chip
} from '@mui/material';

const ContestProblems = ({ problems }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Problem</TableCell>
            <TableCell align="center">Solved By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {problems?.map((problem, index) => (
            <TableRow key={problem?.id}>
              <TableCell>{String.fromCharCode(65 + index)}</TableCell>
              <TableCell>
                <Link href={`/problem/${problem?.id}`}>
                  {problem.title}
                </Link>
                {problem?.tags?.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                ))}
              </TableCell>
              <TableCell align="center">{problem?.solvedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContestProblems;