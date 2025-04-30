/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Grid, MenuItem, TextField, CardActions, CardContent, FormControl } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { DashboardContent } from "src/layouts/dashboard";
import { TableEmptyRows } from "src/utils/table-empty-rows";
import { TableNoData } from "src/utils/table-no-data";
import { TaskTableHead } from "../task-table-head";
import { TaskTableRow } from "../task-table-row";
import { emptyRows, applyFilter, getComparator } from "../utils";

import type { TaskProps } from "../task-table-row";
import { useRouter } from "../../../routes/hooks/use-router";
import { useAlert } from "../../../components/alert/AlertContext";

// ----------------------------------------------------------------------

export function TaskView() {
  const router = useRouter();
  const { setAlert } = useAlert();
  const table = useTable();

  const [filterName, setFilterName] = useState("");
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  const dataFiltered: TaskProps[] = applyFilter({
    inputData: tasks,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  useEffect(() => {
    loadAllDatas();
  }, []);

  const loadAllDatas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/task");
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
      if (err.response.status === 401) {
        router.push("/admin/signin");
        setAlert({ title: "Opps", type: "error", context: "Unauthorized, please sign in to access." });
      }
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Tasks
        </Typography>
        <Link to="/tasks/create">
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
            New task
          </Button>
        </Link>
      </Box>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <TaskTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={tasks.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tasks.map((data) => data.id)
                  )
                }
                headLabel={[
                  { id: "title", label: "Title" },
                  { id: "description", label: "Description" },
                  { id: "status", label: "Status" },
                  { id: "due_date", label: "Due Date" },
                  { id: "actions", label: "" },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <TaskTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      reloadDatas={loadAllDatas}
                    />
                  ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, tasks.length)} />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          component="div"
          page={table.page}
          count={tasks.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

export function TaskCreate() {
  const { setAlert } = useAlert();
  const router = useRouter();
  const [dDate, setDDate] = useState<Dayjs | null>(dayjs(""));
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    dDate: "",
  });

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const formattedDate = newValue.format("YYYY-MM-DD");
      console.log("Formatted Date for Backend:", formattedDate);
      setTask({ ...task, dDate: formattedDate });
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.post(`http://localhost:3001/task/store`, task);
      if (result.data.success) {
        router.back();
        setAlert({ title: "Success", type: "success", context: "Task created successfully!" });
      } else {
        setAlert({ title: "Opps", type: "error", context: "Something went wrong, please try again." });
      }
    } catch (err) {
      setAlert({ title: "Opps", type: "error", context: "Something went wrong, please try again." });
      console.error(err);
    }
  };

  const handleCancel = () => router.back();

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Task - Create
        </Typography>
      </Box>
      <Card>
        <form onSubmit={(e) => handleSubmit(e)}>
          <CardContent>
            <Grid container spacing={2} padding={3}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Title"
                    required
                    onChange={(e) => onInputChange(e)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    onChange={(e) => onInputChange(e)}
                    helperText="This field is optional."
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    fullWidth
                    id="status"
                    name="status"
                    label="Status"
                    required
                    onChange={(e) => onInputChange(e)}
                    select
                  >
                    <MenuItem value={-1} disabled>
                      --- Select Status ---
                    </MenuItem>
                    <MenuItem value="Completed" key="Completed">
                      Completed
                    </MenuItem>
                    <MenuItem value="Uncompleted" key="Uncompleted">
                      Uncompleted
                    </MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker name="due_date" label="Due Date" onChange={handleDateChange} />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={2} padding={3} direction="row" justifyContent="flex-end" alignItems="center">
              <Grid item>
                <Button type="button" variant="contained" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </form>
      </Card>
    </DashboardContent>
  );
}

export function TaskEdit() {
  const { id } = useParams();
  const router = useRouter();
  const { setAlert } = useAlert();
  const [dDate, setDDate] = useState<Dayjs | null>(dayjs(""));
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    dDate: "",
  });

  const { title, description, status } = task;

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const formattedDate = newValue.format("YYYY-MM-DD");
      console.log("Formatted Date for Backend:", formattedDate);
      setTask({ ...task, dDate: formattedDate });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/task/${id}/edit`);
      setTask(res.data.data);
      setDDate(dayjs(res.data.data.due_date));
    } catch (err) {
      console.error(err);
      if (err.response.status === 401) {
        router.push("/admin/signin");
        setAlert({ title: "Opps", type: "error", context: "Unauthorized, please sign in to access." });
      }
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.put(`http://localhost:3001/task/${id}/update`, task);
      if (result.data.success) {
        router.back();
        setAlert({ title: "Success", type: "success", context: "Task updated successfully!" });
      } else {
        setAlert({ title: "Opps", type: "error", context: "Something went wrong, please try again." });
      }
    } catch (err) {
      setAlert({ title: "Opps", type: "error", context: "Something went wrong, please try again." });
      console.error(err);
    }
  };

  const handleCancel = () => router.back();

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Task - Edit
        </Typography>
      </Box>
      <Card>
        <form onSubmit={(e) => handleSubmit(e)}>
          <CardContent>
            <Grid container spacing={2} padding={3}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Title"
                    required
                    onChange={(e) => onInputChange(e)}
                    value={title}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    onChange={(e) => onInputChange(e)}
                    value={description}
                    helperText="This field is optional."
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    fullWidth
                    id="status"
                    name="status"
                    label="Status"
                    required
                    onChange={(e) => onInputChange(e)}
                    select
                    value={status}
                  >
                    <MenuItem value={-1} disabled>
                      --- Select Status ---
                    </MenuItem>
                    <MenuItem value="Completed" key="Completed">
                      Completed
                    </MenuItem>
                    <MenuItem value="Uncompleted" key="Uncompleted">
                      Uncompleted
                    </MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker name="due_date" label="Due Date" onChange={handleDateChange} value={dDate} />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={2} padding={3} direction="row" justifyContent="flex-end" alignItems="center">
              <Grid item>
                <Button type="button" variant="contained" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </form>
      </Card>
    </DashboardContent>
  );
}
