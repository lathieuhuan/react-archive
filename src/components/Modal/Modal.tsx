import cn from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { useCloseWithEsc } from "@Src/hooks/useCloseWithEsc";

import styles from "./styles.module.scss";

interface ModalProps {
  active?: boolean;
  wrapperClassName?: string;
  children: ReactNode;
}
export function Modal({ active = false, wrapperClassName, children }: ModalProps) {
  const [state, setState] = useState({
    active: false,
    animate: false,
  });

  const closeModal = () => {
    setState((prev) => ({ ...prev, animate: false }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, active: false }));
    }, 160);
  };

  useEffect(() => {
    if (active) {
      setState({ active: true, animate: true });
    } else {
      closeModal();
    }
  }, [active]);

  useCloseWithEsc(closeModal);

  return state.active ? (
    <div className="fixed full-stretch z-50">
      <div
        className={cn(
          "w-full h-full bg-black transition duration-150 ease-linear",
          state.animate ? "opacity-60" : "opacity-0"
        )}
        onClick={closeModal}
      />
      <div
        className={cn(
          "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 shadow-white-glow transition duration-150 ease-linear",
          state.animate ? "opacity-100" : "opacity-0",
          wrapperClassName || cn("rounded-lg bg-darkblue-2", styles["content-wrapper"])
        )}
      >
        {children}
      </div>
    </div>
  ) : null;
}
