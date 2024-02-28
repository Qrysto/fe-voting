import Modal from '@/components/Modal';
import BigButton from '@/components/BigButton';
import Image from 'next/image';
import thumbsupImg from './thumbsup.svg';

export default function VoteConfirmedModal({
  open,
  close,
}: {
  open?: boolean;
  close: () => void;
}) {
  return (
    <Modal open={open} close={close}>
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-stretch px-6 py-7">
        <div className="flex shrink grow items-center">
          <Image src={thumbsupImg} alt="" className="" />
        </div>
        <h1 className="text-4xl uppercase">Vote confirmed</h1>
        <p className="mt-[10px]">
          Thank you for participating! Did your candidate miss out on this
          debate stage? Here&#39;s how you can help:{' '}
          <a
            target="_blank"
            href="https://freeandequal.org/donate"
            className="text-darkBlue underline underline-offset-2 active:text-darkBlue/90"
          >
            Donate to Free & Equal
          </a>{' '}
          to support the production of our third presidential debate.
        </p>
        <BigButton className="mt-8" primary onClick={close}>
          Close & continue
        </BigButton>
      </div>
    </Modal>
  );
}
