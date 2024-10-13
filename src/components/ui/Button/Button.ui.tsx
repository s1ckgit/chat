import cn from 'classnames';

import styles from './Button.module.css';

import type { ButtonHTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'icon';
}

const Button = ({ variant, ...props }: IButtonProps) => {
  return (
    <button
      className={
        cn(
          styles.button,
          {
            [styles['button_icon']]: variant === 'icon'
          }
        )
      }
     {...props}>

    </button>
  );
};
export default Button;
