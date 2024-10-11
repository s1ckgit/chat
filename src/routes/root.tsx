import Grid from '@mui/material/Grid2';
import { Chat, Dialog } from "../components/index";

const Root = () => {
  return (
    <Grid sx={{ minHeight:'100vh' }} container>
      <Grid size={2} sx={{ width: 300, borderRight: '1px solid #D3D3D3' }}>
        {[1,1,1,1,1,1,1,1,1,1].map(() => <Dialog />)}
      </Grid>
      <Grid size="grow">
        <Chat id={'1'}/>
      </Grid>
    </Grid>
  );
};

export default Root;
