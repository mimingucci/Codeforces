// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   ReferenceLine
// } from 'recharts';
// import { Paper, Typography, Box } from '@mui/material';
// import { format } from 'date-fns';
// import { useEffect, useState } from 'react';
// import LeaderboardApi from '../../getApi/LeaderboardApi';

// // Helper function to get color based on rating
// const getRatingColor = (rating) => {
//   if (rating >= 2400) return '#FF0000';
//   if (rating >= 2100) return '#FF8C00';
//   if (rating >= 1900) return '#AA00AA';
//   if (rating >= 1600) return '#0000FF';
//   if (rating >= 1400) return '#03A89E';
//   if (rating >= 1200) return '#008000';
//   return '#808080';
// };

// // Custom tooltip component
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <Paper sx={{ p: 1.5 }}>
//         <Typography variant="subtitle2">
//           Contest: {data.contest}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {format(new Date(data.date), 'MMM dd, yyyy')}
//         </Typography>
//         <Typography 
//           variant="body2" 
//           sx={{ 
//             color: getRatingColor(data.rating),
//             fontWeight: 'bold'
//           }}
//         >
//           Rating: {data.rating}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Rank: #{data.rank}
//         </Typography>
//       </Paper>
//     );
//   }
//   return null;
// };

// const RatingChart = ({ id }) => {
//   // const [ratingHistory, setRatingHistory] = useState([]);
//   // useEffect(() => {
//   //   LeaderboardApi.getHistoryCompetition(id).then((res) => {
//   //     setRatingHistory(res?.data?.data || []);
//   //   })
//   //   .catch((err) => {
//   //     console.log(err);
//   //   });
//   // }, [id]);
  
//   // Find min and max ratings for chart bounds
//   const minRating = Math.min(...data.map(d => d.rating)) - 100;
//   const maxRating = Math.max(...data.map(d => d.rating)) + 100;

//   return (
//     <Paper sx={{ p: 3, mb: 3 }}>
//       <Typography variant="h6" gutterBottom>Rating History</Typography>
//       <Box sx={{ width: '100%', height: 400 }}>
//         <ResponsiveContainer>
//           <LineChart
//             data={ratingHistory}
//             margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis 
//               dataKey="date" 
//               tickFormatter={(date) => format(new Date(date), 'MMM yyyy')}
//             />
//             <YAxis 
//               domain={[minRating, maxRating]}
//               tickFormatter={(rating) => Math.round(rating)}
//             />
//             <Tooltip content={<CustomTooltip />} />
            
//             {/* Reference lines for different ratings */}
//             <ReferenceLine y={2400} stroke="#FF0000" strokeDasharray="3 3" />
//             <ReferenceLine y={2100} stroke="#FF8C00" strokeDasharray="3 3" />
//             <ReferenceLine y={1900} stroke="#AA00AA" strokeDasharray="3 3" />
//             <ReferenceLine y={1600} stroke="#0000FF" strokeDasharray="3 3" />
//             <ReferenceLine y={1400} stroke="#03A89E" strokeDasharray="3 3" />
            
//             <Line
//               type="monotone"
//               dataKey="rating"
//               stroke="#1976d2"
//               strokeWidth={2}
//               dot={{ 
//                 stroke: '#1976d2',
//                 strokeWidth: 2,
//                 r: 4,
//                 fill: '#fff'
//               }}
//               activeDot={{ 
//                 stroke: '#1976d2',
//                 strokeWidth: 2,
//                 r: 6,
//                 fill: '#fff'
//               }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </Box>
//     </Paper>
//   );
// };

// export default RatingChart;