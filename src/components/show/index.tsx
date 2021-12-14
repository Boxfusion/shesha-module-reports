import React, { useMemo, FC, PropsWithChildren } from 'react';

export interface IShowInterface {
  when: boolean;
}

/**
 * Use <Show> for conditional logic. It takes a singular when prop for a condition to match for. When the condition is truthy, the children will render, otherwise they will not
 */
export const Show: FC<PropsWithChildren<IShowInterface>> = ({ children, when = false }) => {
  const memoizedWhen = useMemo(() => when, [when]);

  return memoizedWhen ? <>{children}</> : null;
};

export default Show;
