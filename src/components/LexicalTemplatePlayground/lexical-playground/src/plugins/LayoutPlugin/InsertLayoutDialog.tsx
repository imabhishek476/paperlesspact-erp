/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {$createParagraphNode, LexicalEditor, LexicalNode} from 'lexical';
import * as React from 'react';
import {useState} from 'react';

// import Button from '../../ui/Button';
import DropDown, {DropDownItem} from '../../ui/DropDown';
import {INSERT_LAYOUT_COMMAND,  getItemsCountFromTemplate} from './LayoutPlugin';
import { $createLayoutContainerNode } from '../../nodes/LayoutContainerNode';
import { $createLayoutItemNode } from '../../nodes/LayoutItemNode';
import { Button } from '@nextui-org/button';

const LAYOUTS = [
  {label: '2 columns (equal width)', value: '1fr 1fr'},
  {label: '2 columns (25% - 75%)', value: '1fr 3fr'},
  {label: '3 columns (equal width)', value: '1fr 1fr 1fr'},
  {label: '3 columns (25% - 50% - 25%)', value: '1fr 2fr 1fr'},
  {label: '4 columns (equal width)', value: '1fr 1fr 1fr 1fr'},
];

export default function InsertLayoutDialog({
  activeEditor,
  onClose,
  fromEditor,
  targetNode,
  isTopAdd
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
  fromEditor: boolean;
  isTopAdd: boolean;
  targetNode:LexicalNode | null;
}): JSX.Element {
  const [layout, setLayout] = useState(LAYOUTS[0].value);
  const buttonLabel = LAYOUTS.find((item) => item.value === layout)?.label;

  const onClick = () => {
    
    if(fromEditor){
      try{
        if(!targetNode){
          throw Error('no target node');
        }
        // activeEditor.dispatchCommand(INSERT_LAYOUT_TARGET_COMMAND,{template:layout,targetNode});
        activeEditor.update(() => {
          const container = $createLayoutContainerNode(layout);
          const itemsCount = getItemsCountFromTemplate(layout);
    
                for (let i = 0; i < itemsCount; i++) {
                  container.append(
                    $createLayoutItemNode().append($createParagraphNode()),
                  );
                }
                if(isTopAdd){
                  targetNode.insertBefore(container);
                }else{
                  targetNode.insertAfter(container);
                }
                onClose();
                // container.selectStart();
              });
      }catch(err){
        console.log(err);
      }
    }else{
      activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);
      onClose();
    }
  };

  return (
    <>
      <DropDown      
        buttonClassName="toolbar-item dialog-dropdown"
        buttonLabel={buttonLabel}>
        {LAYOUTS.map(({label, value}) => (
          <DropDownItem
            key={value}
            className="item"
            onClick={() => setLayout(value)}>
            <span className="text">{label}</span>
          </DropDownItem>
        ))}
      </DropDown>
      <div className='w-full flex justify-end'>
      <Button onClick={onClick} className="bg-[#05686E] text-[#FFF]">Insert</Button>
      </div>
    </>
  );
}
