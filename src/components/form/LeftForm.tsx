import { useState } from "react";
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

const LeftForm = () => {
  const [symbol, setSymbol] = useState<string>("");
  const [alertInput, setAlertInput] = useState<number | undefined>(undefined);
  const [alertPrice, setAlertPrice] = useState<number | undefined>(undefined);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handleWebSocketMessage = (data: any) => {
    if (data.type === "trade" && data.data) {
      const trade = data.data[0];
      const price = trade.p; // Current Price
      setCurrentPrice(price);

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
    <Box sx={{ width: "100%", maxWidth: 400, margin: "auto", padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select Symbol and Set Alert
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="symbol-label">Select Symbol</InputLabel>
        <Select
          labelId="symbol-label"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          label="Select Symbol"
        >
          <MenuItem value="BINANCE:BTCUSDT">BTC USDT</MenuItem>
          <MenuItem value="BINANCE:ETHUSDT">ETH USDT</MenuItem>
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
      />

      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSetAlert}
          disabled={alertInput === undefined || alertInput === null}
        >
          Set Alert
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearAlert}
          disabled={alertPrice === undefined}
        >
          Clear Alert
        </Button>
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6">
          Current Price: {currentPrice ? `$${currentPrice}` : "N/A"}
        </Typography>
        {alertPrice !== undefined && currentPrice !== null && (
          <Typography color={currentPrice > alertPrice ? "green" : "red"}>
            The price is {currentPrice > alertPrice ? "above" : "below"} the
            alert value of ${alertPrice}.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LeftForm;
