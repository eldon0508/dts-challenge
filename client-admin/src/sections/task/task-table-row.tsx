import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useCallback } from "react";

import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuList from "@mui/material/MenuList";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { Iconify } from "../../components/iconify";
import { useAlert } from "../../components/alert/AlertContext";

// ----------------------------------------------------------------------

export type TaskProps = {
  id: string;
  title: string;
  description: string;
  status: boolean;
  due_date: string;
};

type TaskTableRowProps = {
  row: TaskProps;
  selected: boolean;
  onSelectRow: () => void;
  reloadDatas: () => void;
};

export function TaskTableRow({ row, selected, onSelectRow, reloadDatas }: TaskTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { setAlert } = useAlert();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const result = await axios.delete(`http://localhost:3001/task/${id}/destroy`);
      if (result.data.success) {
        reloadDatas();
        setAlert({ title: "Success", type: "success", context: "Task deleted successfully!" });
      } else {
        setAlert({ title: "Opps", type: "error", context: "Something went wrong, please try again." });
      }
    } catch (err) {
      setAlert({ title: "Opps", type: "error", context: "Something went wrong, please try again." });
      console.error(err);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.due_date}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" },
            },
          }}
        >
          <Link to={`/tasks/${row.id}/edit`}>
            <MenuItem sx={{ textDecoration: "none" }}>
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
          </Link>
          <MenuItem onClick={() => handleDelete(row.id)} sx={{ color: "error.main" }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
