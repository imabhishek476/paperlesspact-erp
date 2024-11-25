import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEditors } from '../../context/EditorProvider';

export function MultipleEditorStorePlugin(props) {
  const { id } = props;
  const [editor] = useLexicalComposerContext();
  const editors = useEditors();

  useEffect(() => {
    editors.createEditor(id, editor);
    return () => editors.deleteEditor(id);
  }, [id, editor]);

  return null;
}
