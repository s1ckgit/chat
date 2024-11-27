import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { setImageModalSrc, toggleImageModal } from "../../../store/modals";
import type { MessageAttachments } from "../../../types";

interface IMesssageAttachment {
  data: MessageAttachments;
}

const MessageAttachment = ({ data }: IMesssageAttachment) => {
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState(data.originalUrl);

  const onOpenImage = () => {
    if(isLoading) return;
    setImageModalSrc(src);
    toggleImageModal();
  };

  useEffect(() => {
    const img = new Image();
    img.src = data.originalUrl;
    if(img.complete && img.naturalWidth > 0) {
      return;
    } 

    setIsLoading(true);
    img.onload = () => {
      setSrc(img.src);
      setIsLoading(false);
    };

    setSrc(data.previewUrl);
  }, [data.originalUrl, data.previewUrl]);

  if(src == '') return;

  return (
    <>
      <Box
        component='div'
        onClick={onOpenImage}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3,
          '&::after': {
            content: "''",
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'block',
            width: '100%',
            height: '100%',

            background: `url(${data.previewUrl}) center center/cover no-repeat`,
            filter: 'brightness(0.6)',
          }
        }}
      >
        {
          isLoading && (
            <CircularProgress 
              variant='indeterminate'
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                translate: '-50% 0',

                zIndex: 4
              }}
            />
          )
        }
        <img 
          style={{
            objectFit: 'cover',
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 3,

            filter: isLoading ? 'brightness(0.6)' : 'unset'
          }} 
          src={src}
          alt='Вложение' 
        />
      </Box>
    </>
  );
};
export default MessageAttachment;
