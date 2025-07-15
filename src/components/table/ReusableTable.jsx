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
} from "@mui/material";
import { FiSearch, FiFilter, FiArrowDown, FiRefreshCw } from "react-icons/fi";
import Input from "../../components/ui/input/Input";
import { SearchIcon } from "../../icon";

// ✅ Loader component
const sizeClasses = {
  small: "w-6 h-6 border-4",
  medium: "w-16 h-16 border-6",
  large: "w-24 h-24 border-8",
};

const Loader = ({ className = "", size = "medium" }) => {
  const sizeClass = sizeClasses[size] || sizeClasses["medium"];

  return (
    <div className={`flex inset-0 w-full items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClass} border-gray-200 rounded-full`}></div>
        <div
          className={`absolute top-0 left-0 ${sizeClass} border-t-[#526E95] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
        ></div>
      </div>
    </div>
  );
};

// ✅ Reusable Table component
const ReusableTable = ({ columns, rows, sx = {}, onRowClick, loading = false }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.id || "");
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  const handleRowClick = (row) => {
    const isSelected = selected.includes(row.id);
    setSelected((prev) =>
      isSelected ? prev.filter((i) => i !== row.id) : [...prev, row.id]
    );
    onRowClick?.(row);
  };

  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    return rows.filter((row) =>
      columns.some((col) => {
        const value = row[col.id];
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(searchText.toLowerCase())
        );
      })
    );
  }, [rows, searchText, columns]);

  const sortedRows = useMemo(() => {
    const compare = (a, b) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    };
    return [...filteredRows].sort(
      order === "desc" ? compare : (a, b) => -compare(a, b)
    );
  }, [filteredRows, order, orderBy]);

  return (
    <Box>
      {/* 🔍 Search & Controls */}
      <div className="flex justify-between bg-white rounded-2xl items-center p-3 mb-4">
        <div className="relative w-1/3">
          <Input
            name="search"
            placeholder="Search..."
            inputProps={{ type: "search" }}
            icon={<SearchIcon />}
            iconPosition="left"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mt-2"
          />
        </div>
        <div className="flex items-center gap-4 text-gray-500 text-xl">
          <FiFilter className="cursor-pointer hover:text-black" />
          <FiArrowDown className="cursor-pointer hover:text-black" />
          <FiRefreshCw className="cursor-pointer hover:text-black" />
        </div>
      </div>

      {/* 📋 Table */}
      <Box sx={{ width: "100%", borderRadius: 2, ...sx.container }}>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead sx={{ backgroundColor: "#E3E8F3" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.length === rows.length && rows.length > 0}
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
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={(e) => handleSort(e, col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      <Loader size="small" />
                    </TableCell>
                  </TableRow>
                ) : sortedRows.length > 0 ? (
                  sortedRows.map((row) => {
                    const isSelected = selected.includes(row.id);
                    return (
                      <TableRow
                        key={row.id}
                        hover
                        selected={isSelected}
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(row)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        {columns.map((col) => (
                          <TableCell
                            key={col.id}
                            align={col.numeric ? "center" : "left"}
                          >
                            {col.renderCell ? col.renderCell(row) : row[col.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReusableTable;

