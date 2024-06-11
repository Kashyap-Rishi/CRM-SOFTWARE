import React, { useState, useContext } from 'react';
import { Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TablePagination, Box, Tooltip, useMediaQuery, Theme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CampaignCreation from '../CampaignCreation/SelectCustomer';
import { AllLogDataContext } from '../../hooks/AllLogContext';

type SuccessRate = {
  rate: string;
  successCount: number;
  failureCount: number;
} | '0%';

const Campaigns: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const contextValue = useContext(AllLogDataContext);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  if (!contextValue || !contextValue.data) {
    return <div>Loading...</div>; 
  }

  const { data: campaigns } = contextValue;

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculateSuccessRate = (campaign: any): SuccessRate => {
    const totalCustomers = campaign.customers.length;
    const successCount = campaign.customers.filter((customer: any) => customer.status === 'SUCCESS').length;
    const failureCount = campaign.customers.filter((customer: any) => customer.status === 'FAILED').length;

    if (totalCustomers === 0) {
      return '0%';
    }

    const successRate = (successCount / totalCustomers) * 100;
    return {
      rate: `${successRate.toFixed(2)}%`,
      successCount,
      failureCount,
    };
  };

  const sentCampaigns = campaigns.filter(campaign => campaign.campaignStatus === 'SENT');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} fontSize={20}>
        <h2 style={{ 
          lineHeight: isMobile ? '1.2' : '1.5', 
          fontSize: isMobile ? '1.5rem' : '2rem' 
        }}>
          Previous Campaigns
        </h2>
        <Button 
          variant="contained" 
          
          onClick={handleOpen}
          sx={{
            padding: isMobile ? '4px 12px' : '8px 16px',
            fontSize: isMobile ? '0.75rem' : '1rem',
            backgroundColor:'#7AB2B2',
            '&:hover': {
              backgroundColor: '#4D869C', 
            }
          }}
        >
          Create Campaign
        </Button>
      </Box>
      <CampaignCreation open={open} handleClose={handleClose} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{backgroundColor:'#4D869C'}}>
              {['Name', 'Description', 'Size', 'Status', 'Created', 'Delivered'].map(header => (
                <TableCell 
                  key={header} 
                  sx={{ 
                    fontSize: '17px', 
                    textTransform: 'uppercase', 
                    color:'white' ,
                    fontWeight: '600',
                    padding: '10px 16px'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sentCampaigns
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((campaign, index) => {
                const successRate = calculateSuccessRate(campaign);
                return (
                  <TableRow 
                    key={page * rowsPerPage + index + 1} 
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#e3e7e6' },
                      '&:hover': { backgroundColor: '#e0f7fa' }
                    }}
                  >
                    <TableCell sx={{ fontSize: '16px', fontWeight:'600', padding: '10px 16px' }}>{campaign.campaignName}</TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight:'600' }}>{campaign.campaignDescription}</TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight:'600' }}>{campaign.campaignSize}</TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight:'600' }}>{campaign.campaignStatus}</TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight:'600' }}>{new Date(campaign.createdAt).toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight:'600' }}>
                      <Box display="flex" alignItems="center">
                        <span>{typeof successRate === 'string' ? successRate : successRate.rate}</span>
                        {typeof successRate !== 'string' && (
                          <Tooltip title={`Success: ${successRate.successCount}, Failure: ${successRate.failureCount}`}>
                            <VisibilityIcon sx={{ color: 'grey', fontSize: '18px', marginLeft: '8px', cursor: 'pointer' }} />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sentCampaigns.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableContainer>
    </Box>
  );
}

export default Campaigns;
