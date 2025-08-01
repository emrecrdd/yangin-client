import React from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Chip, Tooltip, useTheme } from '@mui/material';

const statusLabels = {
  active: { label: 'Aktif', color: 'success' },
  warning: { label: 'Uyarı', color: 'warning' },
  pending: { label: 'Beklemede', color: 'info' },
  resolved: { label: 'Çözüldü', color: 'default' },
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport csvOptions={{ fileName: 'sensörler_raporu' }} />
    </GridToolbarContainer>
  );
}

const SensorTable = ({ sensors, loading, onEdit, onDelete, onRowClick }) => {
  const theme = useTheme();

  const columns = [
    { field: 'id', headerName: 'ID', width: 220, sortable: false },
    {
      field: 'latitude',
      headerName: 'Enlem',
      width: 120,
      type: 'number',
      filterable: true,
      sortable: true,
      description: 'Sensörün enlem koordinatı',
    },
    {
      field: 'longitude',
      headerName: 'Boylam',
      width: 120,
      type: 'number',
      filterable: true,
      sortable: true,
      description: 'Sensörün boylam koordinatı',
    },
    {
      field: 'temperature',
      headerName: 'Sıcaklık (°C)',
      width: 140,
      type: 'number',
      filterable: true,
      sortable: true,
    },
    {
      field: 'smoke',
      headerName: 'Duman',
      width: 100,
      type: 'number',
      filterable: true,
      sortable: true,
    },
    {
      field: 'humidity',
      headerName: 'Nem (%)',
      width: 110,
      type: 'number',
      filterable: true,
      sortable: true,
    },
   {
  field: 'lastDataReceivedAt',
  headerName: 'Son Veri Alımı',
  width: 180,
  type: 'dateTime',
  valueGetter: (params) => {
    if (!params || !params.row || !params.row.lastDataReceivedAt) return null;
    return new Date(params.row.lastDataReceivedAt);
  },
  renderCell: (params) =>
    params?.value
      ? new Date(params.value).toLocaleString('tr-TR')
      : '—',
  filterable: true,
  sortable: true,
},

    {
      field: 'status',
      headerName: 'Durum',
      width: 130,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const { value } = params;
        const status = statusLabels[value] || { label: value, color: 'default' };
        return <Chip label={status.label} color={status.color} size="small" />;
      },
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Düzenle">
              <EditIcon color="primary" />
            </Tooltip>
          }
          label="Düzenle"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Sil">
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label="Sil"
          onClick={() => onDelete(params.row)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <div
      style={{
        height: 600,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 8,
        boxShadow: theme.shadows[3],
        padding: theme.spacing(2),
      }}
    >
      <DataGrid
        rows={sensors}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        components={{ Toolbar: CustomToolbar }}
        onRowClick={(params) => {
          if (onRowClick) onRowClick(params.row);
        }}
        localeText={{
          // Genel
          noRowsLabel: 'Gösterilecek sensör yok',
          noResultsOverlayLabel: 'Sonuç bulunamadı',
          errorOverlayDefaultLabel: 'Bir hata oluştu.',
          footerRowSelected: (count) => `${count} satır seçildi`,
          footerTotalRows: 'Toplam Satır:',
          checkboxSelectionHeaderName: 'Seçim',

          // Sayfalama (pagination)
          paginationRowsPerPage: 'Sayfa başına satır:',
          paginationRowRangeDisplayed: ({ from, to, count }) =>
            `${from}–${to} / ${count !== -1 ? count : `> ${to}`}`,
          paginationFirst: 'İlk sayfa',
          paginationPrevious: 'Önceki sayfa',
          paginationNext: 'Sonraki sayfa',
          paginationLast: 'Son sayfa',

          // Araç çubuğu
          toolbarColumns: 'Sütunlar',
          toolbarColumnsLabel: 'Sütunları seç',
          toolbarFilters: 'Filtreler',
          toolbarFiltersLabel: 'Filtreleri göster',
          toolbarExport: 'Dışa Aktar',
          toolbarExportLabel: 'Dışa aktar',
          toolbarExportCSV: 'CSV olarak indir',
          toolbarExportPrint: 'Yazdır',
          toolbarDensity: 'Yoğunluk',
          toolbarDensityLabel: 'Satır yoğunluğu',
          toolbarDensityCompact: 'Sıkıştırılmış',
          toolbarDensityStandard: 'Standart',
          toolbarDensityComfortable: 'Rahat',

          // Sütun menüsü
          columnMenuLabel: 'Menü',
          columnMenuShowColumns: 'Sütunları Göster',
          columnMenuFilter: 'Filtrele',
          columnMenuHideColumn: 'Sütunu Gizle',
          columnMenuUnsort: 'Sıralamayı kaldır',
          columnMenuSortAsc: 'Artan sırala',
          columnMenuSortDesc: 'Azalan sırala',

          // Sütun paneli
          columnsPanelTextFieldLabel: 'Sütun ara',
          columnsPanelTextFieldPlaceholder: 'Sütun başlığı',
          columnsPanelDragIconLabel: 'Sütunları yeniden sırala',
          columnsPanelShowAllButton: 'Tümünü göster',
          columnsPanelHideAllButton: 'Tümünü gizle',

          // Filtre paneli
          filterPanelAddFilter: 'Filtre ekle',
          filterPanelDeleteIconLabel: 'Sil',
          filterPanelOperators: 'Operatörler',
          filterPanelColumns: 'Sütunlar',
          filterPanelInputLabel: 'Değer',
          filterPanelInputPlaceholder: 'Filtre değeri',

          // Sıralama
          sortPanelSortBy: 'Sırala',
          sortPanelSortAsc: 'Artan',
          sortPanelSortDesc: 'Azalan',
        }}
        sx={{
          '.MuiDataGrid-cell': {
            outline: 'none !important',
          },
          '.MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.grey[100],
            fontWeight: '600',
            fontSize: 14,
          },
        }}
      />
    </div>
  );
};

export default SensorTable;
