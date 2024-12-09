import { useState } from "react";
import TopCard from "../cards/TopCard";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import webSocket from "../../api/webSocket";
import StockGraph from "../graph/StockGraph";

const LeftForm = () => {
  const [symbol, setSymbol] = useState<string>("");
  const [alertInput, setAlertInput] = useState<number | undefined>(undefined);
  const [alertPrice, setAlertPrice] = useState<number | undefined>(undefined);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [stockData, setStockData] = useState<
    { symbol: string; price: number; timeStamp: number }[]
  >([]);

  const handleWebSocketMessage = (data: any) => {
    if (data.type === "trade" && data.data) {
      const trade = data.data[0];
      const price = trade.p; // Current Price
      const timeStamp = trade.p;
      setCurrentPrice(price);

      setStockData((prevData) => [...prevData, { symbol, price, timeStamp }]);

      if (alertPrice !== undefined) {
        if (price > alertPrice) {
          console.log(`Price is above alert: ${price} > ${alertPrice}`);
        } else {
          console.log(`Price is below alert: ${price} <= ${alertPrice}`);
        }
      }
    }
  };

  webSocket(symbol, handleWebSocketMessage);

  const handleSetAlert = () => {
    if (alertInput !== undefined) {
      setAlertPrice(alertInput);
    }
  };

  const handleClearAlert = () => {
    setAlertPrice(undefined);
  };

  return (
    <Box sx={{ width: "100%", color: "white" }}>
      <Box sx={{ marginBottom: 3, maxWidth: 400 }}>
        {symbol && currentPrice !== null && (
          <TopCard
            stockName={symbol}
            currentPrice={currentPrice}
            alertPrice={alertPrice ?? 0}
          />
        )}
      </Box>

      <Typography variant="h6" gutterBottom color="white">
        Select Symbol and Set Alert
      </Typography>

      <FormControl fullWidth margin="normal" sx={{ maxWidth: 500 }}>
        <InputLabel id="symbol-label" sx={{ color: "white" }}>
          Select Symbol
        </InputLabel>
        <Select
          labelId="symbol-label"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          label="Select Symbol"
          sx={{
            backgroundColor: "#333",
            color: "white",
            "& .MuiSelect-icon": {
              color: "white",
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
              borderColor: "#888",
            },
          }}
        >
          <MenuItem value="BINANCE:BTCUSDT">BTC-USDT</MenuItem>
          <MenuItem value="BINANCE:ETHUSDT">ETH-USDT</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Alert Price"
        variant="outlined"
        fullWidth
        margin="normal"
        value={alertInput || ""}
        onChange={(e) => setAlertInput(Number(e.target.value))}
        type="number"
        slotProps={{
          inputLabel: {
            style: { color: "white" },
          },
        }}
        sx={{
          maxWidth: 500,
          margin: 2,
          color: "white",
          input: {
            color: "white",
          },
          fieldset: {
            borderColor: "white",
          },
        }}
      />

      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSetAlert}
          disabled={alertInput === undefined || alertInput === null}
          sx={{
            backgroundColor: "#007bff",
            color: "white",
            "&:disabled": {
              backgroundColor: "#555",
            },
          }}
        >
          Set Alert
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearAlert}
          disabled={alertPrice === undefined}
          sx={{
            borderColor: "#aaa",
            color: "white",
            "&:disabled": {
              borderColor: "#555",
              color: "#555",
            },
          }}
        >
          Clear Alert
        </Button>
      </Box>

      <Box
        sx={{
          marginTop: 3,
          maxWidth: "75%",
        }}
      >
        <StockGraph stockData={stockData} />
      </Box>
    </Box>
  );
};

export default LeftForm;
