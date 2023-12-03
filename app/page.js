"use client";
import stylesist from "./page.module.css";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import datajson from "../public/data.json";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";

const columns = [
  { id: "lev", label: "Leverage", align: "center", minWidth: 170 },
  {
    id: "m_1",
    label: "Liquidation Wave (Maintain 2%)",
    align: "center",
    minWidth: 100,
  },
  {
    id: "m_2",
    label: "Minimal Invest (0.4 / Hedge 0.8)",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Home() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [valueCal, setValCal] = useState(0);
  const [perCal, setPerCal] = useState(0);
  const [closeShort, setCloseShort] = useState(0.0);
  const [closeLong, setCloseLong] = useState(0.0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangeVal = (event) => {
    setValCal(event.target.value);
  };
  const handleChangePer = (event) => {
    setPerCal(event.target.value);
  };
  const CalculationLeverage = () => {
    if (valueCal != 0) {
      let interestMax = calInterestMax(valueCal, perCal);
      let interestMin = calInterestMin(valueCal, perCal);
      let stopMarket = findStopOnMarket(valueCal);
      if (stopMarket == 1) {
        interestMax = interestMax.toFixed(0);
        interestMin = interestMin.toFixed(0);
      } else {
        let lengthAfterPoint = `${valueCal.split(".")[1]}`.length;
        interestMax = interestMax.toFixed(lengthAfterPoint);
        interestMin = interestMin.toFixed(lengthAfterPoint);
      }
      setCloseLong(interestMax);
      setCloseShort(interestMin);
    }
  };
  const ClearVal = () => {
    setValCal(0);
    setPerCal(0);
    setCloseLong(0);
    setCloseShort(0);
  };
  const linkWeb = (event) => {
    let obj = {
      "RECHECK (BINANCE)":
        "https://www.binance.com/en/futures/trading-rules/perpetual/leverage-margin",
      "RECHECK (OKX)": "https://www.okx.com/trade-market/position/swap",
      "CALCULATOR HELPER": "https://dappgrid.com/binance-futures-calculator/",
    };
    window.open(obj[`${event.target.innerText}`], "_blank");
  };
  return (
    <>
      <div className={stylesist.layoutDisplay}>
        <h1>Tolly Leverage & Delta Calculator (V6 - Nov 2023)</h1>
        <h2 className={stylesist.my_2}>
          Maintenance Margin Base on 1-2 % (First Tier 5000 usd)
        </h2>
        <div className={stylesist.d_flex}>
          <Button color="primary" variant="contained" onClick={linkWeb}>
            Recheck (Binance)
          </Button>
          <Button color="primary" variant="contained" onClick={linkWeb}>
            Recheck (OKX)
          </Button>
          <Button color="primary" variant="contained" onClick={linkWeb}>
            Calculator Helper
          </Button>
        </div>
        <div className={stylesist.cardCenter}>
          <Card className={stylesist.cardWidh}>
            <Paper sx={{ width: "100%" }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <StyledTableCell
                          key={column.id}
                          align={column.align}
                          style={{ top: 57, minWidth: column.minWidth }}
                        >
                          {column.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {datajson
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <StyledTableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            {columns.map((column, index) => {
                              const value = row[column.id];
                              const lev = row.lev;
                              return (
                                <StyledTableCell
                                  key={index}
                                  align={column.align}
                                >
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : column.id == "m_2" //แก้สูตรตรงนี้นะ
                                    ? (parseFloat(lev.replace("x", "")) * 0.36) //แก้สูตรตรงนี้นะ
                                        .toFixed(2) //แก้สูตรตรงนี้นะ
                                    : value}
                                </StyledTableCell>
                              );
                            })}
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={datajson.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Card>
        </div>
      </div>
      <div className={stylesist.layoutDisplay}>
        <h2 className={stylesist.my_2}>Two-Side Calculation</h2>
        <div className={stylesist.d_flex}>
          <div>
            <div>
              <TextField
                label="Entry Price"
                value={valueCal}
                onChange={handleChangeVal}
                variant="outlined"
              />
            </div>
            <div className={stylesist.my_2}>
              <TextField
                label="Percent"
                value={perCal}
                onChange={handleChangePer}
                variant="outlined"
              />
            </div>
          </div>
          <div>
            <h3>Stop Market & Trailing Stop</h3>
            <div className={stylesist.my_2}>TS 4.8% - 0.1 (25%)</div>
            <div className={stylesist.my_2}>TS 3% - 0.1 (25%)</div>
            <div className={stylesist.my_2}>TS 0.2% - 0.1 (50%)</div>
            {/* <div className={stylesist.my_2}>TS 1.5% - 0.1 (25%)</div> */}
          </div>
        </div>
        <div className={stylesist.d_flex}>
          <Button
            onClick={CalculationLeverage}
            color="primary"
            variant="contained"
          >
            Calculation
          </Button>
          <Button onClick={ClearVal} color="secondary" variant="contained">
            Clear
          </Button>
        </div>
        <div className={stylesist.d_flex}>
          <div style={{ width: "250px" }}>Take Long Price : {closeShort}</div>
          <div style={{ width: "250px" }}>Take Short Price : {closeLong}</div>
        </div>
      </div>
    </>
  );
}

function calInterestMax(val, percent) {
  const min = parseFloat(val);
  let p = parseFloat(percent);

  if (p == 100) {
    p = 99.9999;
  }

  return parseFloat((100 * min) / (100 - p));
}

function calInterestMin(max_price, percent) {
  const max = parseFloat(max_price);
  const p = parseFloat(percent);

  return parseFloat((max * (100 - p)) / 100);
}

function findStopOnMarket(stop) {
  let one_step = 1;

  if (!stop.includes(".")) {
    return one_step;
  }

  let lengthAfterPoint = `${stop.split(".")[1]}`.length;
  let prefixStep = "0.";

  for (let j = 1; j <= lengthAfterPoint; j++) {
    prefixStep += j === lengthAfterPoint ? "1" : "0";
  }

  one_step = parseFloat(prefixStep).toFixed(lengthAfterPoint);

  return one_step;
}
