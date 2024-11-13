import { Box, Container, IconButton, Modal } from "@mui/material";
import { setImageModalSrc, toggleImageModal, useModals } from "../../store/modals";
import CloseIcon from '@mui/icons-material/Close';
import { useColors, useTransitions } from "../../theme/hooks";


const ImageModal = () => {
  const transitions = useTransitions();
  const colors = useColors();

  const { isOpened, imageSrc } = useModals((state) => state.imageModal);

  const onClose = () => {
    toggleImageModal();
    setImageModalSrc('');
  };

  return (
    <Modal
      open={isOpened}
      slotProps={{
        backdrop: {
          onClick: () => {
            toggleImageModal();
            setImageModalSrc('');
          }
        }
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          '&.MuiContainer-root': {
            '&:focus-visible': {
              outline: 'none'
            },
            padding: 0,
          },
          display: 'grid',
          gridTemplate: 'auto 1fr / 1fr ',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          width: 'auto',
          maxWidth: '80vw',
          maxHeight: '80vh',
          minWidth: '30vw',
          backgroundColor: 'white',

        }}
      >
        <Box
          sx={{
            height: 'auto',
            padding: '8px',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: `${colors['ghost-light']}`,
            boxShadow: '0px 1px 5px rgba(0,0,0,0.5)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              width: '12px',
              height: '12px',
              transition: `color ${transitions['standard']}`,

              '&:hover': {
                backgroundColor: 'unset',
                color: 'red'
              }
            }}
          >
            <CloseIcon
              sx={{
                color: "inherit"
              }}
            />
          </IconButton>
        </Box>
        <img 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
          src={imageSrc}
        />
      </Container>
    </Modal>
  );
};
export default ImageModal;
