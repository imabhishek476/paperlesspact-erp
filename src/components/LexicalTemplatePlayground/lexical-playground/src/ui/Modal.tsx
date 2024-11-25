/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { X } from 'lucide-react';
import './Modal.module.css';

import * as React from 'react';
import {ReactNode, useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';

function PortalImpl({
  onClose,
  children,
  title,
  closeOnClickOutside,
  item,
  handleRemoveItem,
}: {
  children: ReactNode;
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
  item:any
  handleRemoveItem:any
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        item && handleRemoveItem(item)
      }
    };
    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (
        modalRef.current !== null &&
        !modalRef.current.contains(target as Node) &&
        closeOnClickOutside
      ) {
        onClose();
        item && handleRemoveItem(item)
      }
    };
    const modelElement = modalRef.current;
    if (modelElement !== null) {
      modalOverlayElement = modelElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener('click', clickOutsideHandler);
      }
    }

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);
const handelClose=()=>{
  onClose();
  item && handleRemoveItem(item)
}
  return (
    <div className="Modal__overlay" role="dialog">
      <div className="Modal__modal" tabIndex={-1} ref={modalRef}>
        <h2 className="Modal__title">{title}</h2>
        <button
          className="Modal__closeButton"
          aria-label="Close modal"
          type="button"
          onClick={handelClose}>
          <X/>
        </button>
        <div className="Modal__content">{children}</div>
      </div>
    </div>
  );
}

export default function Modal({
  onClose,
  children,
  title,
  closeOnClickOutside = false,
  item,
  handleRemoveItem,
}: {
  children: ReactNode;
  closeOnClickOutside?: boolean;
  onClose: () => void;
  title: string;
  item:any
  handleRemoveItem:any
}): JSX.Element {
  return createPortal(
    <PortalImpl
      onClose={onClose}
      title={title}
      item={item}
      handleRemoveItem={handleRemoveItem}
      closeOnClickOutside={closeOnClickOutside}>
      {children}
    </PortalImpl>,
    document.body,
  );
}
