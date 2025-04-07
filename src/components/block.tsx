"use client";

import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
  outerClassName?: string;
  innerClassName?: string;
};

export const Block = ({ children, outerClassName, innerClassName }: Props) => {
  // 使用useState和useEffect确保客户端和服务端一致的渲染
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={clsx(outerClassName)}>
      <div
        className={clsx("max-w-screen-xl pl-3 pr-3 xl:mx-auto", innerClassName)}
      >
        {children}
      </div>
    </div>
  );
};

export default Block;
