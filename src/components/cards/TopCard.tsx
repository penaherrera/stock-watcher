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
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: 2,
        backgroundColor: "#f9f9f9",
        textAlign: "center",
        marginBottom: 2,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {stockName}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography
          variant="h4"
          gutterBottom
          color={
            alertPrice === 0
              ? "black"
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
