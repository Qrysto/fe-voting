import Image from 'next/image';
import closeIcon from './closeIcon.svg';

export default function Modal({
  open,
  close,
  children,
}: {
  open?: boolean;
  close: () => void;
  children?: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 bg-black/70">
      <div className="container relative h-full md:max-w-3xl">
        <div className="absolute inset-x-5 inset-y-9 rounded-[28px] bg-white">
          <div>{children}</div>
          <button
            className="absolute left-6 top-7 px-0 py-0 text-4xl"
            onClick={close}
          >
            <Image src={closeIcon} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
