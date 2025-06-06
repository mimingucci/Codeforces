import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
  Box,
  Chip,
  Skeleton,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    cursor: "pointer",
  },
}));

const RatingChip = styled(Chip)(({ theme, rating }) => ({
  fontWeight: "bold",
  backgroundColor: getRatingColor(rating),
  color: "#fff",
}));

// Helper function to get color based on rating
const getRatingColor = (rating) => {
  if (rating >= 2400) return "#FF0000";
  if (rating >= 2100) return "#FF8C00";
  if (rating >= 1900) return "#AA00AA";
  if (rating >= 1600) return "#0000FF";
  if (rating >= 1400) return "#03A89E";
  if (rating >= 1200) return "#008000";
  return "#808080";
};

const Rating = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserApi.getTopRatings({ limit: 100 })
      .then((res) => {
        setUsers(res.data.data.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch ratings:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Top Rated Users
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="10%" align="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  Rank
                </Typography>
              </TableCell>
              <TableCell width="60%">
                <Typography variant="subtitle1" fontWeight="bold">
                  User
                </Typography>
              </TableCell>
              <TableCell width="30%" align="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  Rating
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? // Loading skeleton
                [...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))
              : users?.map((user, index) => (
                  <StyledTableRow key={user.username}>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight={index < 3 ? "bold" : "normal"}
                        color={index < 3 ? "primary" : "inherit"}
                      >
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={user.avatar}
                          alt={user.username}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Link
                          href={`/profile/${user.id}`}
                          underline="hover"
                          sx={{
                            color: getRatingColor(user.rating),
                            fontWeight: "bold",
                          }}
                        >
                          {user.username}
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <RatingChip
                        label={user.rating}
                        rating={user.rating}
                        size="small"
                      />
                    </TableCell>
                  </StyledTableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default Rating;
