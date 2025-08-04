import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ButtonGroup, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useSnackbar } from 'notistack';

export default function ControledDataGrid({ columns, tableData, handleEditClick, handleDeleteClick, action }) {

  const { enqueueSnackbar } = useSnackbar();

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    enqueueSnackbar(`Copied Successfully!`, { variant: 'success' });
  }

  // Define columns with custom render function for action buttons
  const updatedColumns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <ButtonGroup variant="text" color="primary" aria-label="text primary button group" sx={{ mt: 1 }}>
          <Tooltip title="Copy ID">
            <IconButton aria-label="copy" onClick={() => copyToClipboard(params.row.id)}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton aria-label="edit" onClick={() => handleEditClick(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      ),
    },
    ...columns,
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={tableData}
        columns={action ? updatedColumns : columns}
        components={{ Toolbar: GridToolbar }}
      // getRowId={(row) => row.id}
      />
    </div>
  );
}

