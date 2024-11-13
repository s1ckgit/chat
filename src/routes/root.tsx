import Grid from '@mui/material/Grid2';
import { Chat } from "../components/index";
import { useTheme } from '@mui/material/styles';
import Sidebar from '../components/Sidebar/Sidebar.component';
import ImageModal from '../components/ImageModal/ImageModal.component';

const Root = () => {
  const theme = useTheme();

  return (
    <>
      <ImageModal />
      <Grid sx={{ minHeight:'100vh' }} container>
        <Grid size={2} sx={{ border: '1px solid', width: 450, borderColor: theme.palette.ghost.light }}>
          <Sidebar />
        </Grid>
        <Grid size="grow">
          <Chat />
        </Grid>
      </Grid>
    </>
  );
};

export default Root;
