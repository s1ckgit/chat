import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

interface IMesssageAttachment {
  data: any;
}

const MessageAttachment = ({ data }: IMesssageAttachment) => {
  const [isLoading, setIsLoading] = useState(true);
  const [src, setSrc] = useState(data.previewUrl);

  useEffect(() => {
    const img = new Image();
    img.src = data.previewUrl;
    setIsLoading(true);
    img.onload = () => {
      setSrc(img.src);
      img.src = data.originalUrl;
      img.onload = () => {
        setIsLoading(false);
        setSrc(img.src);
      };
    };
  }, [data.originalUrl, data.previewUrl]);

  if(src == '') return;

  return (
    <>
      <Box
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
