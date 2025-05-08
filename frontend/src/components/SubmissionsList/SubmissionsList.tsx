"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SettingsIcon from "@mui/icons-material/Settings";
import { useQuery } from "@tanstack/react-query";
import { fetchSubmissions } from "../../services/api";
import { Submission, ColumnConfig } from "../../types";

type Order = "asc" | "desc";

const SubmissionsList: React.FC = () => {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<string>("id");
  const [filterText, setFilterText] = useState("");
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [insuranceType, setInsuranceType] = useState<string>("all");

  const {
    data: submissions,
    isLoading,
    error,
    refetch,
  } = useQuery<{ columns: string[]; data: Submission[] }>({
    queryKey: ["submissions", insuranceType],
    queryFn: () =>
      fetchSubmissions(insuranceType === "all" ? undefined : insuranceType),
  });

  useEffect(() => {
    if (submissions?.columns) {
      const baseColumns = submissions.columns.map((col) => ({
        id: col,
        label: col
          .split(/(?=[A-Z])/)
          .join(" ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        visible: true,
        sortable: true,
        filterable: true,
      }));

      // Add insurance type column if it doesn't exist
      if (!baseColumns.find((col) => col.id === "type")) {
        baseColumns.unshift({
          id: "type",
          label: "Insurance Type",
          visible: true,
          sortable: true,
          filterable: true,
        });
      }

      setColumns(baseColumns);
    }
  }, [submissions?.columns]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleToggleColumnVisibility = (columnId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? { ...column, visible: !column.visible }
          : column
      )
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && submissions?.data) {
      setSelectedSubmissions(submissions.data.map((s) => s.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleSelectSubmission = (id: string) => {
    const selectedIndex = selectedSubmissions.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedSubmissions, id];
    } else {
      newSelected = selectedSubmissions.filter((s) => s !== id);
    }

    setSelectedSubmissions(newSelected);
  };

  const filterSubmissions = (data: Submission[]) => {
    if (!filterText) return data;

    return data.filter((submission) => {
      return Object.entries(submission).some(([key, value]) => {
        const column = columns.find((col) => col.id === key);
        if (column?.filterable && value !== null && value !== undefined) {
          return String(value).toLowerCase().includes(filterText.toLowerCase());
        }
        return false;
      });
    });
  };

  const sortSubmissions = (data: Submission[]) => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === undefined || bValue === undefined) return 0;

      // Handle different data types
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }

      const comparison = String(aValue).localeCompare(String(bValue));
      return order === "asc" ? comparison : -comparison;
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading submissions: {(error as Error).message}
      </Alert>
    );
  }

  // if (!submissions || !submissions.data || submissions.data.length === 0) {
  //   return (
  //     <Alert severity="info" sx={{ mt: 2 }}>
  //       No submissions found.
  //     </Alert>
  //   );
  // }

  const filteredSubmissions = filterSubmissions(submissions?.data || []);
  const sortedSubmissions = sortSubmissions(filteredSubmissions);
  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Insurance Applications</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Insurance Type</InputLabel>
            <Select
              value={insuranceType}
              label="Insurance Type"
              onChange={(e) => setInsuranceType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="car">Car</MenuItem>
              <MenuItem value="health">Health</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Search"
            variant="outlined"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <IconButton
            onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
            aria-label="Column Settings"
          >
            <SettingsIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={() => refetch()}
            startIcon={<FilterListIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {selectedSubmissions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`${selectedSubmissions.length} selected`}
            color="primary"
            onDelete={() => setSelectedSubmissions([])}
          />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="submissions table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedSubmissions.length > 0 &&
                    selectedSubmissions.length < submissions?.data.length
                  }
                  checked={
                    submissions?.data.length > 0 &&
                    selectedSubmissions.length === submissions?.data.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {visibleColumns.map((column) => (
                <TableCell key={column.id}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSubmissions.map((submission) => {
              const isSelected = selectedSubmissions.includes(submission.id);
              return (
                <TableRow
                  key={submission.id}
                  selected={isSelected}
                  hover
                  onClick={() => handleSelectSubmission(submission.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={`${submission.id}-${column.id}`}>
                      {column.id === "type" ? (
                        <Chip
                          label={
                            insuranceType === "all"
                              ? submission.type
                              : insuranceType
                          }
                          color={
                            insuranceType === "all"
                              ? submission.type === "home"
                                ? "primary"
                                : submission.type === "car"
                                ? "secondary"
                                : "success"
                              : insuranceType === "home"
                              ? "primary"
                              : insuranceType === "car"
                              ? "secondary"
                              : "success"
                          }
                          size="small"
                        />
                      ) : submission[column.id] !== undefined ? (
                        String(submission[column.id])
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Show/Hide Columns</Typography>
        </MenuItem>
        {columns.map((column) => (
          <MenuItem key={column.id} sx={{ padding: "4px 16px" }}>
            <Checkbox
              checked={column.visible}
              onChange={() => handleToggleColumnVisibility(column.id)}
              size="small"
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {column.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SubmissionsList;
