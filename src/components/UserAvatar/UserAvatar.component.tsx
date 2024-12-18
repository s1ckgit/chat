import { useGetUserPropQuery } from "@/api/hooks/users";
import { setImageModalSrc, toggleImageModal } from "@/store/modals";
import { useSocket } from "@/store/socket";
import { enableSocketEventListeners } from "@/utils";
import { Avatar, type AvatarProps } from "@mui/material";
import { useEffect } from "react";

const UserAvatarComponent = ({ id, ...props }: { id: User['id'] | undefined } & AvatarProps) => {
  const { sx, ...restProps } = props;

  const { usersSocket } = useSocket();

  const { data, refetch } = useGetUserPropQuery(id, 'avatars');

  const onClick = () => {
    if(!data) return;

    setImageModalSrc(data.originalUrl);
    requestAnimationFrame(() => {
      toggleImageModal();
    });
  };

  useEffect(() => {
    if(!usersSocket || !id) return;

    usersSocket.emit(`user_avatar`, { id });

    const updateListener = () => {
      refetch();
    };

    const cleanup = enableSocketEventListeners(usersSocket, [
      {
        eventName: `user_avatar_update_${id}`,
        eventCallback: updateListener
      }
    ]);

    return cleanup;

  }, [id, refetch, usersSocket]);

  useEffect(() => {
    if(!data) return;

    const img = new Image();
    img.src = data.originalUrl;
  }, [data]);

  return (
    <Avatar
      sx={{
        ...sx,
        cursor: data && 'pointer'
      }}
      {...restProps}
      src={data ? data.thumbnailUrl : ''}
      onClick={onClick}
    />
  );
};
export default UserAvatarComponent;
