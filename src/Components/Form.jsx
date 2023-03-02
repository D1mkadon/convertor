import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import "./Form.scss";
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const Form = () => {
  const [currency, setCurrency] = useState("");
  const [currency2, setCurrency2] = useState("");
  const [select, setSelect] = useState("none");
  const [value, setValue] = useState("");
  const [inputFirstValue, setInputFirstValue] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const getRates = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const obj = [
          { ccy: "EUR", base_ccy: "UAH", buy: "38.530", sale: "	40.000" },
          { ccy: "USD", base_ccy: "UAH", buy: "36.569	", sale: "37.453" },
          { ccy: "BTC", base_ccy: "USD", buy: "22092.83", sale: "21992.83" },
        ];
        resolve(obj);

        let counter = localStorage.getItem("counter");
        if (counter < 5) {
          counter++;
          localStorage.setItem("counter", counter);
        } else {
          counter = 0;
          localStorage.setItem("counter", counter);
          setErrorMsg("Something went wrong...");
          throw "counter of called API = 5 ===> error";
        }

        console.log("API called --- >", counter);
      });
    });
  };
  useEffect(() => {
    async function fetchData() {
      const data = await getRates();
      setData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      for (let i = 0; i < data.length; i++) {
        if (currency === data[i].ccy) {
          setInputFirstValue(1);
          const defaultValueOnChange = (1 * data[i].buy).toFixed(2);
          setValue(defaultValueOnChange);
        } else if (currency === "none") {
          setValue("");
          setInputFirstValue("");
        }
      }
    } else console.log(data);
  }, [select, data]);

  const handleChangeCurrency = (event) => {
    setSelect(event.target.value);
    const currencyArr = event.target.value.split("/");
    setCurrency(currencyArr[0]);
    setCurrency2(currencyArr[1]);
  };
  const handleValueFirstInput = (e) => {
    if (e.target.value && !isNaN(e.target.value)) {
      setInputFirstValue(e.target.value);
      for (let i = 0; i < data.length; i++) {
        if (currency === data[i].ccy && currency2 === data[i].base_ccy) {
          const newValue = (e.target.value * data[i].buy).toFixed(2);
          setValue(newValue);
        }
        if (currency === data[i].base_ccy && currency2 === data[i].ccy) {
          const swappedValue = (e.target.value / data[i].sale).toFixed(2);
          setValue(swappedValue);
        }
      }
    }
  };
  const handleValueSecondInput = (e) => {
    if (e.target.value && !isNaN(e.target.value)) {
      for (let i = 0; i < data.length; i++) {
        setValue(e.target.value);
        if (currency === data[i].ccy && currency2 === data[i].base_ccy) {
          const newValue = (e.target.value / data[i].buy).toFixed(2);
          setInputFirstValue(newValue);
        }
        if (currency === data[i].base_ccy && currency2 === data[i].ccy) {
          const swappedValue = (e.target.value * data[i].buy).toFixed(2);
          setInputFirstValue(swappedValue);
        }
      }
    }
  };
  const handleIconClick = () => {
    setInputFirstValue(value);
    setValue(inputFirstValue);
    console.log(value);
    console.log(inputFirstValue);
    setCurrency(currency2);
    setCurrency2(currency);
  };

  return (
    <>
      <TableContainer
        className="table"
        component={Paper}
        sx={{ minWidth: 414, maxWidth: 1000, textAlign: "center" }}
      >
        {errorMsg ? <p className="error">{errorMsg}</p> : null}
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                className="cell"
                sx={{ textAlign: "center", width: "33%" }}
              >
                Currency/Current date
              </TableCell>
              <TableCell
                className="cell"
                sx={{ textAlign: "center", minWidth: "33%" }}
                align="right"
              >
                Buy
              </TableCell>
              <TableCell
                className="cell"
                sx={{ textAlign: "center", width: "33%", minWidth: "33%" }}
                align="right"
              >
                Sell
              </TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell
                  className="cell"
                  sx={{ textAlign: "center", width: "33%" }}
                  component="th"
                  scope="row"
                >
                  loading...
                </TableCell>
                <TableCell
                  className="cell"
                  sx={{ textAlign: "center", width: "33%" }}
                  align="right"
                >
                  loading...
                </TableCell>
                <TableCell
                  className="cell"
                  sx={{ textAlign: "center", width: "33%" }}
                  align="right"
                >
                  loading...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            data.map((row) => {
              return (
                <TableBody key={row.ccy}>
                  <TableRow>
                    <TableCell
                      className="cell"
                      sx={{ textAlign: "center", width: "33%" }}
                      component="th"
                      scope="row"
                    >
                      {errorMsg ? "reload page" : row.ccy + "/" + row.base_ccy}
                    </TableCell>
                    <TableCell
                      className="cell"
                      sx={{ textAlign: "center", minWidth: "33%" }}
                      align="right"
                    >
                      {errorMsg ? "reload page" : row.buy}
                    </TableCell>
                    <TableCell
                      className="cell"
                      sx={{ textAlign: "center", minWidth: "33%" }}
                      align="right"
                    >
                      {errorMsg ? "reload page" : row.sale}
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })
          )}
        </Table>
      </TableContainer>
      {errorMsg ? (
        "reload page"
      ) : (
        <div className="divChanger">
          <TextField
            id="outlined-basic"
            label={`Change ${currency}`}
            variant="outlined"
            color="success"
            onChange={handleValueFirstInput}
            value={inputFirstValue}
          />
          <CompareArrowsIcon
            className={"Icon"}
            sx={{ margin: "0 10px" }}
            onClick={handleIconClick}
          />
          <FormControl
            sx={{ m: 1, position: "relative", bottom: "10px", width: "150px" }}
            variant="standard"
          >
            <InputLabel id="demo-customized-select-label">Currency</InputLabel>
            <Select
              className={"Select"}
              defaultValue="none"
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={select}
              onChange={handleChangeCurrency}
              input={<BootstrapInput />}
            >
              <MenuItem value="none">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"USD/UAH"}>USD/UAH</MenuItem>
              <MenuItem value={"EUR/UAH"}>EUR/UAH</MenuItem>
              <MenuItem value={"BTC/USD"}>BTC/USD</MenuItem>
            </Select>
          </FormControl>

          <TextField
            onChange={handleValueSecondInput}
            id="outlined-basic"
            label={`Get ${currency2}`}
            variant="outlined"
            color="success"
            value={value}
          />
        </div>
      )}
      <p></p>
    </>
  );
};

export default Form;
