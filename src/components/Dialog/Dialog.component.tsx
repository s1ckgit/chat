import styles from './Dialog.module.css';

import { Avatar } from '@mui/material';
const Dialog = () => {
  const onClick = () => {
    // Change chat id
  };

  return (
    <div onClick={onClick} className={styles.dialog}>
      <Avatar src='https://www.drivetest.de/wp-content/uploads/2019/08/drivetest-avatar-m.png' />
      <div className={styles['dialog-info']}>
        <p>name</p>
        <p>date</p>
        <p>last message</p>
        <div>99+</div>
      </div>
    </div>
  );
};

export default Dialog;
