import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeBlock = (props) => {
  const { language, value } = props;
  console.log(props);
  return (
    <SyntaxHighlighter language={language} style={atomOneLight} showLineNumbers>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
