import Header from '@editorjs/header';
// import Table from 'editorjs-table';
import List from "@editorjs/list";
export const tools = {

    header: {
        class: Header,
        config: {
          placeholder: 'Header',
          levels: [2, 3, 4],
          defaultLevel: 3
        }
      },
    //   table: {
    //     class: Table,
    //     inlineToolbar: true,
    //     config: {
    //       rows: 2,
    //       cols: 3,
    //     },
    //   },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        }
      },
}