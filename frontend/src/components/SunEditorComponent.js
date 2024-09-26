import React, { useEffect, useRef } from 'react';
import suneditor from 'suneditor';
import 'suneditor/dist/css/suneditor.min.css';
import plugins from 'suneditor/src/plugins';

const SunEditorComponent = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    // Log SunEditor configuration
    console.log("SunEditor config applied:", {
      plugins: plugins,
      height: '200px',
      minHeight: '200px',
      maxHeight: '500px',
      iframe: false,
    });

    try {
      // Initialize SunEditor without iframe and auto height options
      editorInstanceRef.current = suneditor.create(editorRef.current, {
        plugins: plugins,
        height: '200px',  // Set a fixed height
        minHeight: '200px', // Minimum height
        maxHeight: '500px', // Maximum height
        resizingBar: false, // Disable resizing bar
        iframe: false,  // Disable iframe usage
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
      });

      // Set initial value
      editorInstanceRef.current.setContents(value || '');

      // Handle content changes
      editorInstanceRef.current.onChange = (content) => {
        onChange(content);
      };

    } catch (error) {
      console.error("Error initializing SunEditor:", error);
    }

    return () => {
      // Cleanup SunEditor on component unmount
      editorInstanceRef.current?.destroy();
    };
  }, [onChange, value]);

  return <div ref={editorRef} />;
};

export default SunEditorComponent;
