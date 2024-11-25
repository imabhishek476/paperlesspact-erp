import { EditorBinding } from "@/Utils/Collaboration/y-editor/y-editor";
import EditorJS from "@editorjs/editorjs";
import * as Y from "yjs";
import { useEffect, useRef } from "react";
import { WebsocketProvider } from "y-websocket";
import { tools } from "./EditorTools";

const EditorComponent = ({ data, onChange, holder }) => {
  const ref = useRef();
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
        const holder1 = document.getElementById(holder);
      const editor = new EditorJS({
        holder: holder1,
        tools: tools,
        data,
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
        minHeight:200
      });
      const ydoc1 = new Y.Doc();

      const provider = new WebsocketProvider(
        "ws:localhost:1234",
        "editorjs-demo",
        ydoc1
      );

      const binding1 = new EditorBinding(
        editor,
        holder1,
        ydoc1.getArray("docId")
      );
      ref.current = editor;
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return <div id={holder}></div>;
};
export default EditorComponent;
