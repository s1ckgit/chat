import { Box, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from '@mui/icons-material';
import { removeAttachment } from "@/store/modals";

interface IAttachFileItem {
  attachment: {
    id: number;
    previewUrl: string;
    originalUrl: string;
    file: File
  }
}

const AttachFileItem = ({ attachment }: IAttachFileItem) => {
  const { previewUrl, id } = attachment;

  const onRemove = () => {
    removeAttachment(id);
  };
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      <IconButton
        onClick={onRemove}
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '4px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',

          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.8)'
          }
        }}
      >
        <DeleteIcon
          sx={{
            color: 'inherit',
            fontSize: '18px'
          }}
        />
      </IconButton>
      <img 
        src={previewUrl}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          width: '100%',
          height: '100%',
          maxHeight: '100%'
        }} 
      />
    </Box>
  );
};
export default AttachFileItem;
