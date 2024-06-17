import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

export default function Statistics() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    async function getStats() {
      try {
        const response = await axios.get("http://localhost:5000/getstats");
        const data = response.data;
        setStats({
          numterms: data.numterms,
          numreviews: data.numreviews,
          numright: data.numright,
          numwrong: data.numwrong,
          levels: [
            data.lvl1,
            data.lvl2,
            data.lvl3,
            data.lvl4,
            data.lvl5,
            data.lvl6,
            data.lvl7,
            data.lvl8,
          ],
        });
      } catch (error) {
        console.error("There was an error checking profiles!", error);
      }
    }

    getStats();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ marginBottom: 3, backgroundColor: "#5C3F76" }}>
        <CardContent
          className="drop-shadow-smallerwhite"
          sx={{ color: "#DDDDDD" }}
        >
          <Typography variant="h5" component="div" gutterBottom>
            <u>General Statistics</u>
          </Typography>
          <Typography variant="body1">
            Total number of terms: {stats.numterms}
          </Typography>
          <Typography variant="body1">
            Total number of reviews: {stats.numreviews}
          </Typography>
          <Typography variant="body2">
            Number of reviews done correctly: {stats.numright}
          </Typography>
          <Typography variant="body2">
            Number of reviews done incorrectly: {stats.numwrong}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ backgroundColor: "#5C3F76" }}>
        <CardContent
          sx={{ color: "#DDDDDD" }}
          className="drop-shadow-smallerwhite"
        >
          <Typography variant="h5" component="div" gutterBottom>
            <u>Terms by Level</u>
          </Typography>
          <Grid container spacing={2}>
            {stats.levels &&
              stats.levels.map((level, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Typography
                    variant="body1"
                    className="drop-shadow-smallerwhite"
                  >
                    Level {index + 1}: {level}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
