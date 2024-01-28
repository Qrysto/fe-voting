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
          Your vote has been submitted, thank you for your vote! Your voice
          matters.
        </p>
        <p className="mt-[10px]">
          Help us fund the Free and Equal Debate and reduce corporate influence
          in politics. Every donation counts. Support us here:{' '}
          <a
            href="https://givebutter.com/free-and-equal-debate"
            target="_blank"
            className="underline underline-offset-1"
          >
            https://givebutter.com/free-and-equal-debate
          </a>
        </p>
        <BigButton className="mt-8" primary onClick={close}>
          Close & continue
        </BigButton>
      </div>
    </Modal>
  );
}
