import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onDelete,
  itemName = 'this item',
  loading = false,
  icon: Icon = ExclamationTriangleIcon,
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-60 transition-opacity backdrop-blur-sm bg-black/60"/>
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto   xl:left-50">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-[#23232b] rounded-xl px-6 pt-8 pb-6 shadow-xl w-full max-w-md mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center">
                  <span className="bg-red-600 rounded-full p-3 mb-4">
                    <Icon className="h-8 w-8 text-white" aria-hidden="true" />
                  </span>
                  <Dialog.Title as="h3" className="text-2xl font-bold text-white mb-2">
                    Delete "{itemName}"
                  </Dialog.Title>
                  <p className="text-gray-300 text-base mb-6 text-center">
                    Are you sure you want to delete this <span className="font-semibold text-white">{itemName}</span>? Once deleted, it cannot be recovered.
                  </p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold disabled:opacity-60"
                    onClick={onDelete}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
