import classNames from 'classnames';
import { ReactNode } from 'react';

import './SectionPlaceholder.scss';

type SectionPlaceholderProps = {
  title: string;
  description?: ReactNode;
  className?: string;
};

export const SectionPlaceholder = ({
  title,
  description,
  className,
}: SectionPlaceholderProps) => {
  return (
    <section className={classNames('account-section-placeholder', className)}>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </section>
  );
};

export default SectionPlaceholder;

