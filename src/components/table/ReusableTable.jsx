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
  TablePagination,
} from "@mui/material";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import Input from "../../components/ui/input/Input";
import { SearchIcon } from "../../icon/index";
import Loader from "../../components/loader/Loader";

const ReusableTable = ({
  columns,
  rows,
  sx = {},
  onRowClick,
  loading = false,
  onRefresh,
  filterOptions = ["all"],
  filterKey = "isApproved",
  isFilter = true,
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.id || "");
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredAndSortedRows = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    let filtered = [...rows];

    // 🔍 Search filtering
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = col.render ? col.render(row) : row[col.id];
          return String(value ?? "").toLowerCase().includes(lowerSearch);
        })
      );
    }

    // ✅ Status filtering
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (row) =>
          String(row[filterKey] ?? "").toUpperCase() ===
          filterStatus.toUpperCase()
      );
    }

    // 🔃 Sorting
    const compare = (a, b) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    };

    return filtered.sort(order === "desc" ? compare : (a, b) => -compare(a, b));
  }, [rows, columns, orderBy, order, searchQuery, filterStatus, filterKey]);

  // Slice rows for pagination
  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedRows.slice(start, start + rowsPerPage);
  }, [filteredAndSortedRows, page, rowsPerPage]);

  const handleSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredAndSortedRows.map((row) => row.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleRowClick = (row) => {
    const isSelected = selected.includes(row.id);
    setSelected((prev) =>
      isSelected ? prev.filter((id) => id !== row.id) : [...prev, row.id]
    );
    onRowClick?.(row);
  };

  const formatLabel = (label) =>
    label
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Ex: approved_pending → Approved Pending

  // Pagination handlers
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* 🔍 Search & Filter Header */}
      <div className="flex justify-between bg-white rounded-2xl items-center p-3 mb-4">
        <div className="relative w-1/3">
          <Input
            name="search"
            placeholder="Search..."
            icon={<SearchIcon />}
            iconPosition="left"
            className="mt-2"
            inputProps={{
              type: "search",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
            }}
          />
        </div>

        <div className="flex items-center gap-4 text-gray-500 text-xl">
          {/* 🧩 Filter */}
          {isFilter && (
            <div className="relative">
              <FiFilter
                className="cursor-pointer hover:text-black"
                onClick={() => setShowFilterDropdown((prev) => !prev)}
              />
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow z-10 text-sm">
                  {filterOptions.map((status) => (
                    <div
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowFilterDropdown(false);
                      }}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        filterStatus === status ? "bg-gray-200 font-semibold" : ""
                      }`}
                    >
                      {formatLabel(status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 🔄 Refresh */}
          <FiRefreshCw
            className="cursor-pointer hover:text-black"
            onClick={() => onRefresh()}
          />
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
                      checked={
                        selected.length > 0 &&
                        selected.length === filteredAndSortedRows.length
                      }
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < filteredAndSortedRows.length
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
                ) : paginatedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRows.map((row, index) => {
                    const isSelected = selected.includes(row.id);
                    return (
                      <TableRow
                        key={row.id}
                        hover
                        selected={isSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleRowClick(row)}
                          />
                        </TableCell>
                        {columns.map((col) => (
                          <TableCell
                            key={col.id}
                            align={col.numeric ? "center" : "left"}
                          >
                            {col.render
                              ? col.needsIndex
                                ? col.render(row, index)
                                : col.render(row)
                              : row[col.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls centered */}
          <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAndSortedRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
export default ReusableTable;