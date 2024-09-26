import React, { useEffect, useRef } from 'react';
import suneditor from 'suneditor';
import 'suneditor/dist/css/suneditor.min.css';
import plugins from 'suneditor/src/plugins';

const SunEditorComponent = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    // Initialize the editor with iframe disabled
    editorInstanceRef.current = suneditor.create(editorRef.current, {
      plugins: plugins,
      height: 200,
      buttonList: [
        ['undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['bold', 'underline', 'italic', 'strike'],
        ['removeFormat'],
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list', 'table'],
        ['link', 'image', 'video'],
        ['fullScreen', 'showBlocks', 'codeView'],
      ],
      iframe: false,  // Ensure iframe is completely disabled
      disableAutoHeight: true, // Disable auto height
      // Optionally, set a min or max height
      minHeight: '200px', 
      maxHeight: '500px'
    });
    
    // Set initial value
    editorInstanceRef.current.setContents(value || '');

    // Handle content changes
    editorInstanceRef.current.onChange = (content) => {
      onChange(content);
    };

    return () => {
      // Cleanup SunEditor on component unmount
      editorInstanceRef.current?.destroy();
    };
  }, [onChange, value]);

  return <div ref={editorRef} />;
};

export default SunEditorComponent;
