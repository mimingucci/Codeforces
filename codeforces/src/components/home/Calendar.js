import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ContestApi from "../../getApi/ContestApi";
import { Box, Typography, CircularProgress } from "@mui/material";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        // Fetch both upcoming and running contests
        const [upcomingResponse, runningResponse] = await Promise.all([
          ContestApi.getUpcomingContests({ days: 30, type: "SYSTEM" }),
          ContestApi.getRunningContests({ type: "SYSTEM" }),
        ]);

        const upcomingContests = upcomingResponse.data.data || [];
        const runningContests = runningResponse.data.data || [];

        // Combine and format contests for calendar
        const formattedEvents = [...upcomingContests, ...runningContests].map(
          (contest) => ({
            id: contest.id,
            title: contest.name,
            start: new Date(contest.startTime),
            end: new Date(contest.endTime),
            url: `/contest/${contest.id}`,
            backgroundColor: getContestColor(contest),
            borderColor: getContestColor(contest),
            extendedProps: {
              description: contest.description,
              type: contest.type,
              status: isContestRunning(contest) ? "RUNNING" : "UPCOMING",
            },
          })
        );

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching contests:", error);
        setError("Failed to load contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
    // Refresh every 5 minutes
    const interval = setInterval(fetchContests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getContestColor = (contest) => {
    if (isContestRunning(contest)) {
      return "#2196f3"; // Running contests - blue
    }
    return "#4caf50"; // Upcoming contests - green
  };

  const isContestRunning = (contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);
    return now >= startTime && now <= endTime;
  };

  const handleEventClick = (clickInfo) => {
    clickInfo.jsEvent.preventDefault();
    if (clickInfo.event.url) {
      window.location.href = clickInfo.event.url;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="w-full pr-5 pt-[20px]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        events={events}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventDisplay="block"
        displayEventEnd={true}
        eventDidMount={(info) => {
          // Add tooltips
          info.el.title = `${
            info.event.title
          }\nStart: ${info.event.start.toLocaleString()}\nEnd: ${info.event.end.toLocaleString()}`;
        }}
        height="auto"
      />
    </div>
  );
};

export default Calendar;
