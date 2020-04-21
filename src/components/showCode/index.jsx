import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// language options
// * cpp
// * java
// * python

const convert_language = language => {
  if (language === 'Python2' || language === 'Python3') {
    return 'python';
  }
  if (language === 'C++' || language === 'C') {
    return 'cpp';
  }
  if (language === 'Java') {
    return 'java';
  }
};

const showCode = props => {
  const { code, language } = props;

  return (
    <div>
      <SyntaxHighlighter
        language={convert_language(language)}
        style={atomOneLight}
        showLineNumbers
      >
        {code || '// no code'}
      </SyntaxHighlighter>
    </div>
  );
};

export default showCode;
