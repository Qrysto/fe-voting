import Modal from '@/components/Modal';
import BigButton from '@/components/BigButton';
import Image from 'next/image';
import { oswald } from '@/fonts';
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
      <div className="absolute inset-0 flex flex-col items-stretch px-6 py-7">
        <div className="flex shrink grow items-center">
          <Image src={thumbsupImg} alt="" className="" />
        </div>
        <h1 className="text-4xl uppercase">Vote confirmed</h1>
        <p className="mt-[10px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <BigButton className="mt-8" primary onClick={close}>
          Close & continue
        </BigButton>
      </div>
    </Modal>
  );
}
