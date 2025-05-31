import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Link,
} from "@mui/material";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import ContestApi from "../../getApi/ContestApi";
import { calculateDuration } from "../../utils/dateUtils";

const PastContests = ({ contestType }) => {
  const { t } = useTranslation();
  const [contests, setContests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(-1);

  useEffect(() => {
    const fetchPastContests = async () => {
      try {
        const response = await ContestApi.getPastContests({
          type: contestType?.toUpperCase(),
          page,
          size: rowsPerPage,
        });
        console.log(response.data);
        setContests(response.data?.data?.content);
        setTotalItems(response.data?.data?.totalElements);
      } catch (error) {
        console.error("Failed to fetch past contests:", error);
      }
    };

    fetchPastContests();
  }, [contestType, page, rowsPerPage]);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("contest.name")}</TableCell>
              <TableCell>{t("contest.type")}</TableCell>
              <TableCell>{t("contest.startTime")}</TableCell>
              <TableCell>{t("contest.duration")}</TableCell>
              <TableCell>{t("contest.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contests.map((contest) => (
              <TableRow key={contest.id}>
                <TableCell>
                  <Link href={`/contest/${contest.id}`}>{contest.name}</Link>
                </TableCell>
                <TableCell>{contest.type}</TableCell>
                <TableCell>
                  {format(new Date(contest.startTime), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {calculateDuration(contest.startTime, contest.endTime)}
                </TableCell>
                <TableCell>
                  <Link href={`/contest/${contest.id}?tab=standing`}>
                    {t("contest.standings")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />
    </Paper>
  );
};

export default PastContests;
