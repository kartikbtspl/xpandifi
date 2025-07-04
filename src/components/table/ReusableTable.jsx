import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { TiArrowUnsorted } from "react-icons/ti";
import { FiSearch, FiFilter, FiArrowDown, FiRefreshCw } from "react-icons/fi";
import Input from "../../components/ui/input/Input";
import { SearchIcon } from "../../icon";

// Props:
// - columns: [{ id, label, numeric }]
// - rows: array of data
// - getStatusColor: function to return status text color
// - getImage: function to return campaign image if needed
// - sx: MUI custom styles

const ReusableTable = ({ columns, rows, sx = {} }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.id || "");
  const [selected, setSelected] = useState([]);

  const handleSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newSelected = rows.map((row) => row.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleRowClick = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const sortedRows = useMemo(() => {
    const compare = (a, b) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    };
    return [...rows].sort(
      order === "desc" ? compare : (a, b) => -compare(a, b)
    );
  }, [rows, order, orderBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#4CAF50";
      case "Canceled":
        return "#90A4AE";
      case "Rejected":
        return "#EF5350";
      default:
        return "#000";
    }
  };

  return (
    <Box>
      <div>
        {/* Header Controls */}
        <div className="flex justify-between bg-white rounded-2xl items-center p-3 mb-4">
          <div className="relative w-1/3">
            <Input
              name="search"
              placeholder="Search..."
              inputProps={{ type: "search" }}
              icon={<SearchIcon />}
              iconPosition="left"
              className="mt-2"
            />
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-xl">
            <FiFilter className="cursor-pointer hover:text-black" />
            <FiArrowDown className="cursor-pointer hover:text-black" />
            <FiRefreshCw className="cursor-pointer hover:text-black" />
          </div>
        </div>
      </div>

      <Box sx={{ width: "100%", borderRadius: 2, ...sx.container }}>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead sx={{ backgroundColor: "#E3E8F3" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.length === rows.length}
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.numeric ? "center" : "left"}
                      sx={{ fontWeight: 600, color: "#263238" }}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <TiArrowUnsorted
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={(e) => handleSort(e, col.id)}
                        >
                          {orderBy === col.id && (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          )}
                        </TiArrowUnsorted>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRows.map((row, idx) => {
                  const isSelected = selected.includes(row.id);
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      selected={isSelected}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(row.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <img
                            src={row.image}
                            alt="campaign"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              objectFit: "cover",
                            }}
                          />
                          <Typography>{row.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{row.slot}</TableCell>
                      <TableCell>₹ {row.bidAmount.toFixed(2)}</TableCell>
                      <TableCell>{row.bids}</TableCell>
                      <TableCell
                        sx={{
                          color: getStatusColor(row.status),
                          fontWeight: 500,
                        }}
                      >
                        {row.status}
                      </TableCell>
                      <TableCell>
                        <Typography>{row.date}</Typography>
                        <Typography variant="caption" sx={{ color: "#777" }}>
                          {row.daysLeft}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReusableTable;
