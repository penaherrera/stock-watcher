import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getPercentageChange } from "../../api/requests";

interface TopCardProps {
  stockName: string;
  currentPrice: number;
  alertPrice: number;
}

const TopCard = ({ stockName, currentPrice, alertPrice }: TopCardProps) => {
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    const fetchPercentageChange = async () => {
      const data = await getPercentageChange(stockName);
      const dp = data.dp;
      console.log("Percentage Change", data.dp);
      setPercentage(dp);
    };

    fetchPercentageChange();

    const interval = setInterval(() => {
      fetchPercentageChange();
    }, 5000);

    return () => clearInterval(interval);
  }, [stockName]);

  return (
    <Box
      sx={{
        backgroundColor: "#222222",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "white",
        }}
      >
        {stockName}
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography
          variant="h4"
          gutterBottom
          color={
            alertPrice === 0
              ? "white"
              : currentPrice > alertPrice
              ? "green"
              : "red"
          }
          sx={{ marginRight: 2 }}
        >
          ${currentPrice.toFixed(2)}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color: percentage !== null && percentage >= 0 ? "green" : "red",
          }}
        >
          {percentage !== null ? (
            <>
              {percentage >= 0 ? "+" : ""}
              {percentage.toFixed(2)}%
            </>
          ) : (
            "N/A"
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopCard;
