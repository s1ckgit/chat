import Grid from '@mui/material/Grid2';
import { Chat } from "../components/index";
import { useTheme } from '@mui/material/styles';
import Sidebar from '../components/Sidebar/Sidebar.component';
import { useLoaderData } from 'react-router-dom';
import type { IUser } from '../types';

const Root = () => {
  const theme = useTheme();
  const { userData } = useLoaderData() as { userData: IUser;};

  return (
    <Grid sx={{ minHeight:'100vh' }} container>
      <Grid size={2} sx={{ border: '1px solid', width: 450, borderColor: theme.palette.ghost.light }}>
        <Sidebar />
      </Grid>
      <Grid size="grow">
        <Chat id={'1'}/>
      </Grid>
    </Grid>
  );
};

export default Root;
