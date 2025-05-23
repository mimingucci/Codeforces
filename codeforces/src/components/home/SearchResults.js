import { useEffect, useState } from "react";
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import UserApi from "../../getApi/UserApi";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const SearchResults = ({ query }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery] = useDebouncedValue(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await UserApi.search({ query: debouncedQuery, limit: 10 });
        if (response.data.code === "200") {
          setResults(response.data.data.content);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  if (!debouncedQuery) return null;
  if (loading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;
  if (results.length === 0) return <Typography sx={{ p: 2 }}>No results found</Typography>;

  return (
    <List sx={{ width: "100%", maxHeight: 400, overflow: "auto" }}>
      {results.map((user) => (
        <ListItem key={user.id} button component="a" href={`/profile/${user.id}`}>
          <ListItemAvatar>
            <Avatar src={user.avatar} alt={user.username} />
          </ListItemAvatar>
          <ListItemText
            primary={user.username}
            secondary={`${user.email || ""}`}
          />
        </ListItem>
      ))}
    </List>
  );
};
export default SearchResults;
