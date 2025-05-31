import { useEffect, useState } from "react";
import {
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Stack,
  Container,
} from "@mui/material";
import BlogApi from "../../getApi/BlogApi";
import Blog from "./Blog";
import { useTranslation } from "react-i18next";

const Blogs = ({ author = "" }) => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await (author.length === 0
        ? BlogApi.getAllBlogs(pageNumber - 1)
        : BlogApi.getBlogByAuthor(author, pageNumber - 1));

      if (res?.data?.code === "200") {
        setBlogs(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      setError("An error occurred while fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page, author]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {t("blogs.fetchError")}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <Stack spacing={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {blogs.map((blog) => (
              <Blog blog={blog} key={blog.id} />
            ))}

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" py={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
};

export default Blogs;
