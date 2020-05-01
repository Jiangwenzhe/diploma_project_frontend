import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import icon_font_url from '../../config/iconfont';

const IconFont = createFromIconfontCN({
  scriptUrl: icon_font_url,
});

const IconFromIconFont = (props) => {
  const { type, className, style } = props;
  return <IconFont className={className} style={style} type={type} />;
};

export default IconFromIconFont;
