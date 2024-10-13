import Grid from '@mui/material/Grid2';
import { Chat, Conversation } from "../components/index";
import { useTheme } from '@mui/material/styles';

const Root = () => {
  const theme = useTheme();

  return (
    <Grid sx={{ minHeight:'100vh' }} container>
      <Grid size={2} sx={{ border: '1px solid', width: 300, borderColor: theme.palette.ghost.light }}>
        {[1,1,1,1,1,1,1,1,1,1].map(() => <Conversation />)}
      </Grid>
      <Grid size="grow">
        <Chat id={'1'}/>
      </Grid>
    </Grid>
  );
};

export default Root;
