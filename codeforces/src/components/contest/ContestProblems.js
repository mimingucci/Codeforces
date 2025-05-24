import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Chip,
} from "@mui/material";

const ContestProblems = ({ problems, isContestFinished, virtualContestId = null }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Problem</TableCell>
            {isContestFinished && <TableCell>Tags</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {problems?.map((problem, index) => (
            <TableRow key={problem?.id}>
              <TableCell>{String.fromCharCode(65 + index)}</TableCell>
              <TableCell>
                <Link href={virtualContestId ? `/problem/${problem?.id}?virtual=${virtualContestId}` : `/problem/${problem?.id}`}>{problem.title}</Link>
              </TableCell>
              {isContestFinished && (
                <TableCell>
                  {problem?.tags?.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ mr: 1 }} />
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContestProblems;
