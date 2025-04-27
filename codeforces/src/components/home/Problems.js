import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import ProblemApi from "../../getApi/ProblemApi";
import UserApi from "../../getApi/UserApi";
import { useSearchParams, useNavigate } from "react-router-dom";
import Ranking from "./Ranking";
import DataTable from '../shared/DataTable';

const Problems = ({ userPage = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = +searchParams.get("page") || 0;
  const [problems, setProblems] = useState([]);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const columns = userPage ? [
    { field: 'index', label: '#', sortable: false },
    { 
      field: 'username', 
      label: 'User',
      render: (row) => (
        <a href={`/profile/${row.author}`}>
          <Ranking
            username={row?.username}
            rating={row?.rating}
            title={false}
          />
        </a>
      )
    },
    { field: 'rating', label: 'Rating' }
  ] : [
    { field: 'index', label: '#', sortable: false },
    { 
      field: 'title', 
      label: 'Problem',
      render: (row) => (
        <a href={`/problem/${row.id}`}>{row.title}</a>
      )
    },
    { field: 'rating', label: 'Rating' },
    { 
      field: 'submissions', 
      label: 'Tries',
      render: (row) => row.submissions?.length
    }
  ];

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!userPage) {
        const response = await ProblemApi.getProblems({ page });
        setProblems(response?.data?.data?.content);
        setTotalPages(response?.data?.totalPages);
      } else {
        const response = await UserApi.getTopRatings({ limit: 100 });
        setProblems(response?.data?.data?.content);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (e, p) => {
    let nxtPage = Math.max(0, p);
    nxtPage = Math.min(pages, nxtPage);
    navigate("/problems?page=" + nxtPage, { replace: true });
    page = nxtPage;
  };

  const handlePageChange = (newPage) => {
    navigate(`/problems?page=${newPage}`, { replace: true });
  };
  
  return (
    <DataTable
      columns={columns}
      data={problems.map((item, index) => ({
        ...item,
        index: index + 1
      }))}
      page={page}
      totalRows={totalPages * 10}
      loading={loading}
      onPageChange={handlePageChange}
      sortable={!userPage}
    />
  );
};

export default Problems;
