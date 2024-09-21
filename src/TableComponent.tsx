import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  TableSortLabel,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface Data {
  name: string;
  age: number;
  gender: string;
  role: string;
}

interface TableComponentProps {
  data: Data[];
  onUpdate: (index: number, updatedData: Data) => void;
  onDelete: (index: number) => void;
  onCopy: (index: number) => void;
}

// Helper function to highlight the search term in the name
const highlightText = (text: string, highlight: string) => {
  if (!highlight) return text;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span
            key={index}
            style={{ backgroundColor: "yellow", fontWeight: "bold" }}
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  onUpdate,
  onDelete,
  onCopy,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [updatedData, setUpdatedData] = useState<Data | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Data;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const handleSort = (key: keyof Data) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortedData = [...filteredData];
    if (sortConfig) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedData;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenUpdateModal = (index: number) => {
    setSelectedIndex(index);
    setUpdatedData(data[index]);
    setOpenUpdateModal(true);
  };

  const handleOpenDeleteModal = (index: number) => {
    setSelectedIndex(index);
    setOpenDeleteModal(true);
  };

  const handleUpdateRow = () => {
    if (selectedIndex !== null && updatedData) {
      onUpdate(selectedIndex, updatedData);
    }
    setOpenUpdateModal(false);
  };

  const handleDeleteRow = () => {
    if (selectedIndex !== null) {
      onDelete(selectedIndex);
    }
    setOpenDeleteModal(false);
  };

  const totalAge = useMemo(() => {
    return data.reduce((acc, row) => acc + row.age, 0);
  }, [data]);

  return (
    <Grid container spacing={2}>
      {/* Form and Search Section */}
      <Grid item xs={12}>
        <TextField
          label="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          style={{ marginBottom: "1rem" }}
        />
      </Grid>

      {/* Table Section */}
      <Grid item xs={12}>
        <div style={{ overflowX: "auto" }}>
          {" "}
          {/* For mobile horizontal scroll */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig?.key === "name"}
                    direction={sortConfig?.direction}
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig?.key === "age"}
                    direction={sortConfig?.direction}
                    onClick={() => handleSort("age")}
                  >
                    Age
                  </TableSortLabel>
                </TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{highlightText(row.name, searchTerm)}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? "8px" : "4px",
                      }}
                    >
                      {/* Update Button */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenUpdateModal(index)}
                        size={isMobile ? "small" : "medium"}
                      >
                        Update
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenDeleteModal(index)}
                        size={isMobile ? "small" : "medium"}
                      >
                        Delete
                      </Button>

                      {/* Copy Button with Tooltip */}
                      <Tooltip title="Copy row" arrow>
                        <Button
                          variant="contained"
                          onClick={() => onCopy(index)}
                          size={isMobile ? "small" : "medium"}
                        >
                          Copy
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{totalAge}</TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Grid>

      {/* Pagination */}
      <Grid item xs={12}>
        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Grid>

      {/* Update Modal */}
      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <DialogTitle>Update Row</DialogTitle>
        <DialogContent style={{ paddingTop: "8px", paddingBottom: "8px" }}>
          <TextField
            label="Name"
            value={updatedData?.name}
            onChange={(e) =>
              setUpdatedData({ ...updatedData!, name: e.target.value })
            }
            fullWidth
            style={{ marginBottom: "16px" }}
          />
          <TextField
            label="Age"
            type="number"
            value={updatedData?.age}
            onChange={(e) =>
              setUpdatedData({ ...updatedData!, age: Number(e.target.value) })
            }
            fullWidth
            style={{ marginBottom: "16px" }}
          />
          <TextField
            label="Gender"
            value={updatedData?.gender}
            onChange={(e) =>
              setUpdatedData({ ...updatedData!, gender: e.target.value })
            }
            fullWidth
            style={{ marginBottom: "16px" }}
          />
          <TextField
            label="Role"
            value={updatedData?.role}
            onChange={(e) =>
              setUpdatedData({ ...updatedData!, role: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateRow} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Are you sure you want to delete this row?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRow} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TableComponent;
