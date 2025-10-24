import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export function Modal({
  title,
  isOpen = false,
  onRequestClose,
  children,
  className,
  ...props
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`nobat-modal ${className || ''}`}
        onClose={onRequestClose}
        {...props}
      >
        <Transition.Child
          as={Fragment}
          enter="nobat-modal-overlay--enter"
          enterFrom="nobat-modal-overlay--enter-from"
          enterTo="nobat-modal-overlay--enter-to"
          leave="nobat-modal-overlay--leave"
          leaveFrom="nobat-modal-overlay--leave-from"
          leaveTo="nobat-modal-overlay--leave-to"
        >
          <div className="nobat-modal__overlay" aria-hidden="true" />
        </Transition.Child>

        <div className="nobat-modal__wrapper">
          <div className="nobat-modal__container">
            <Transition.Child
              as={Fragment}
              enter="nobat-modal-content--enter"
              enterFrom="nobat-modal-content--enter-from"
              enterTo="nobat-modal-content--enter-to"
              leave="nobat-modal-content--leave"
              leaveFrom="nobat-modal-content--leave-from"
              leaveTo="nobat-modal-content--leave-to"
            >
              <Dialog.Panel className="nobat-modal__panel">
                {title && (
                  <div className="nobat-modal__header">
                    <Dialog.Title as="h2" className="nobat-modal__title">
                      {title}
                    </Dialog.Title>
                    <button
                      className="nobat-modal__close"
                      onClick={onRequestClose}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="nobat-modal__body">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

