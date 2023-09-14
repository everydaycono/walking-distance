import { FC } from 'react';

import './style.css';
interface HtmlRenderProps {
  html: string;
}

const HtmlRender: FC<HtmlRenderProps> = ({ html }) => {
  return (
    <section>
      <div className="html-render" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
};

export default HtmlRender;
