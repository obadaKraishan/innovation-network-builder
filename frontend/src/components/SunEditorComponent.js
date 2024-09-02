import React, { useRef } from 'react';
import suneditor from 'suneditor';
import 'suneditor/dist/css/suneditor.min.css';
import plugins from 'suneditor/src/plugins';

const SunEditorComponent = ({ value, onChange }) => {
  const editorRef = useRef(null);

  React.useEffect(() => {
    const editor = suneditor.create(editorRef.current, {
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
    });

    editor.onChange = (content) => {
      onChange(content);
    };

    return () => {
      editor.destroy();
    };
  }, [onChange]);

  return <div ref={editorRef} />;
};

export default SunEditorComponent;
