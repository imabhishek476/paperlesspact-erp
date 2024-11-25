import { DecoratorNode, ParagraphNode } from "lexical";
import { Plus } from "lucide-react";
import { ReactNode } from "react";
import {applyMixins} from '@/lib/helpers/classHelpers';

const onMouseEnter=(e:MouseEvent) =>{
    console.log(e);
    const nodeEle = e.target as HTMLElement;
    console.log(nodeEle);
    nodeEle.setAttribute('style', 'border: 2px solid #05686e;');
    console.log(nodeEle.children);
    
    // debugger;
}
const onMouseLeave=(e:MouseEvent) =>{
    console.log(e);
    const nodeEle = e.target as HTMLElement;
    // setTimeout(()=>{
        nodeEle.setAttribute('style', 'border:none;');
    // },750)
}

function ButtonComponent(){
 return (
    <>
    <span className="absolute left-[50%] ">
    <Plus/>
    </span>
    </>
 )
}



export class CustomParagraphNode extends ParagraphNode {
  static getType() {
    return "custom-paragraph";
  }

  static clone(node:ParagraphNode) {
    return new CustomParagraphNode(node.__key);
  }

  createDOM(config:any) {
    const dom = super.createDOM(config);
    dom.addEventListener('mouseenter',onMouseEnter);
    dom.addEventListener('mouseleave',onMouseLeave);
    // dom.setAttribute('style','position:absolute; border:none;')
    // const topButton = document.createElement('button');
    // topButton.setAttribute('style','background-color:#05686e; border-radius:50%; position:absolute; height:5px; width:5px display:hidden;');
    // topButton.textContent = 'button'; 
    // dom.appendChild(topButton); 
    return dom;
  }

  decorate(): ReactNode {
    return <ButtonComponent  />;
  } 
}

// export interface CustomParagraphNode extends DecoratorNode<ReactNode> {};
// applyMixins(CustomParagraphNode,[DecoratorNode<ReactNode>]);


