import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Pagination,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UserApi from "../../getApi/UserApi";
import Ranking from "./Ranking";

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const SearchList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await UserApi.search({
        page,
        query: searchParams.get("query"),
        pageSize: 50,
      });

      if (response.data.code === "200") {
        setUsers(response.data.data.content);
        setPagination({
          page: response.data.data.pageNumber,
          totalPages: response.data.data.totalPages,
          totalElements: response.data.data.totalElements,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, [searchParams.get("query")]);

  const handlePageChange = (event, newPage) => {
    fetchUsers(newPage - 1); // Convert to 0-based index
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Search Results
        {pagination.totalElements > 0 && (
          <Typography component="span" color="text.secondary">
            {" "}
            ({pagination.totalElements} users found)
          </Typography>
        )}
      </Typography>

      {users.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          No users found
        </Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <StyledCard onClick={() => navigate(`/profile/${user.id}`)}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={user.avatar}
                        alt={user.username}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box flex={1}>
                        <Typography variant="h6" component="div">
                          {user.username}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          <Ranking
                            username={user.username}
                            rating={user.rating}
                            title={false}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Rating: {user.rating}
                          </Typography>
                        </Box>
                        {user.country && (
                          <Chip
                            label={user.country}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                    {user.description && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {user.description}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchList;