import { Box, ButtonBase } from "@mui/material";
import AttachFileItem from "./AttachFileItem.component";
import { buildGridForAttachmentsModal } from "../../../utils";
import { useColors, useTransitions } from "../../../theme/hooks";
import { useModals } from "../../../store/modals";

import { Upload as UploadIcon } from '@mui/icons-material';




const AttachFileList = () => {
  const colors = useColors();
  const transitions = useTransitions();

  const { attachments, fileInputRef } = useModals(state => state.attachFileModal);

  return (
    attachments.length ? (
      <Box 
        sx={{
          ...buildGridForAttachmentsModal(attachments.length)
        }}
      >
        {
          attachments.map((attach) => (
            <AttachFileItem key={attach.id} attachment={attach} />
          ))
        }
      </Box>
    ) : (
      <ButtonBase
        onClick={() => {
          fileInputRef?.current?.click();
        }}
        sx={{
          width: '100%',
          height: '150px',
          backgroundColor: colors['ghost-light'],
          color: colors['ghost-dark'],
  
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: 1,
          transition: `background-color ${transitions['standard']}, color ${transitions['standard']}`,
  
  
          '&:hover': {
            backgroundColor: colors['ghost-dark'],
            color: 'white'
          }
        }}
        component="div"
      >
        <UploadIcon 
          sx={{
            color: 'inherit'
          }}
        />
        Загрузить изображения
      </ButtonBase>
    )
  );
};
export default AttachFileList;
