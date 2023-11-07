import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import JSON5 from 'json5';

function Import() {
  const [jsonText, setJsonText] = useState('');
  const [highlightedJson, setHighlightedJson] = useState('');

  const handleTextChange = (event) => {
    const inputText = event.target.value;

    // Attempt to parse JSON using json5 (handles both JSON and JavaScript objects)
    try {
      const parsedJson = JSON.stringify(JSON5.parse(inputText), null, 2);
      setJsonText(inputText);
      setHighlightedJson(parsedJson);
    } catch (error) {
      setJsonText(inputText);
      setHighlightedJson('Invalid JSON');
    }
  };

  return (
    <div>
      <TextField
        label="JSON Input"
        variant="outlined"
        multiline
        fullWidth
        value={jsonText}
        onChange={handleTextChange}
      />
      <SyntaxHighlighter language="json" style={xonokai}>
        {highlightedJson}
      </SyntaxHighlighter>
    </div>
  );
}

export default Import;
