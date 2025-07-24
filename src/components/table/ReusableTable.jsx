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
import Loader from "../loader/Loader";

const ReusableTable = ({
  columns,
  rows,
  sx = {},
  onRowClick,
  loading = false,
  onRefresh
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.id || "");
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredAndSortedRows = useMemo(() => {
    const filterValue = searchQuery.toLowerCase();

    let filtered = rows;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const rawValue = col.render
            ? row[col.id] // if rendered JSX, fallback to raw
            : row[col.id];
          return String(rawValue).toLowerCase().includes(filterValue);
        })
      );
    }

    // Filter by status (assuming status string exists in `row.raw?.isApproved`)
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (row) => row.raw?.isApproved?.toUpperCase() === filterStatus
      );
    }

    const compare = (a, b) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    };

    return filtered.sort(order === "desc" ? compare : (a, b) => -compare(a, b));
  }, [rows, columns, orderBy, order, searchQuery, filterStatus]);

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
    onRowClick?.(row); // optional
  };

 


  // const filteredAndSortedRows = useMemo(() => {
  //   const filterValue = searchQuery.toLowerCase();

  //   const filtered = rows.filter((row) =>
  //     columns.some((col) => {
  //       const rawValue = col.render
  //         ? row[col.id] // fallback to raw value for search if JSX
  //         : row[col.id];

  //       return String(rawValue).toLowerCase().includes(filterValue);
  //     })
  //   );

  //   const compare = (a, b) => {
  //     if (b[orderBy] < a[orderBy]) return -1;
  //     if (b[orderBy] > a[orderBy]) return 1;
  //     return 0;
  //   };

  //   return filtered.sort(order === "desc" ? compare : (a, b) => -compare(a, b));
  // }, [rows, columns, orderBy, order, searchQuery]);

  return (
    <Box>
      {/* Search & Filter Header */}
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
          {/* <FiFilter className="cursor-pointer hover:text-black" /> */}
          <div className="relative">
            <FiFilter
              className="cursor-pointer hover:text-black"
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            />

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow z-10 text-sm">
                {["all", "APPROVED", "PENDING"].map((status) => (
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
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).toLowerCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <FiArrowDown className="cursor-pointer hover:text-black" /> */}
          <FiRefreshCw
            className="cursor-pointer hover:text-black"
            onClick={() => alert('Uder Progress...')}
          />
        </div>
      </div>

      {/* Table */}
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
                      <Loader size="small" />{" "}
                      {/* Replace with your actual loader component */}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedRows.map((row) => {
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
                            {col.render ? col.render(row) : row[col.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
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
