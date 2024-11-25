import { createContext, useContext, useCallback, useMemo, useState } from 'react';

const EditorContext = createContext(null);

const EditorProvider = (props) => {
  const [editors, setEditors] = useState({});

  const createEditor = useCallback((id, editor) => {
    console.log('creating editor',id,editor);
    setEditors((editors) => {
      if (editors[id]) return editors;
      return { ...editors, [id]: editor };
    });
  }, []);

  const deleteEditor = useCallback((id) => {
    setEditors((editors) => {
      if (!editors[id]) return editors;
      const { [id]: _, ...rest } = editors;
      return rest;
    });
  }, []);

  const value = useMemo(() => {
    return {
      editors,
      createEditor,
      deleteEditor,
    };
  }, [editors, createEditor, deleteEditor]);

  return (
    <EditorContext.Provider value={value}>
      {props.children}
    </EditorContext.Provider>
  );
};

const useEditors = () => {
  const context = useContext(EditorContext);
  if (context === null) {
    throw new Error(
      'The `useEditors` hook must be used inside the <EditorProvider> component\'s context.'
    );
  }
  const { createEditor, deleteEditor } = context;
  return { createEditor, deleteEditor };
};

const useEditor = (id) => {
  const context = useContext(EditorContext);
  if (context === null) {
    throw new Error(
      'The `useEditor` hook must be used inside the <EditorProvider> component\'s context.'
    );
  }
  return context.editors[id] || null;
};

export { EditorProvider, useEditors, useEditor };
