'use client';

import Modal from '@/components/Modal';
import BigButton from '@/components/BigButton';
import { ExternalLink } from '@/components/ui/typo';
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
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-stretch overflow-y-auto px-6 py-7">
        <div className="flex shrink grow items-center">
          <Image src={thumbsupImg} alt="" className="" />
        </div>
        <h1 className="text-4xl uppercase">Vote confirmed</h1>
        <p className="mt-[10px]">
          Thank you for your vote! Do you believe Americans deserve debates with
          more candidates and audience participation? Here&#39;s how you can
          help:{' '}
          <a
            target="_blank"
            href="https://freeandequal.org/donate"
            className="text-darkBlue underline underline-offset-2 active:text-darkBlue/90"
          >
            Donate to Free & Equal
          </a>{' '}
          to support the production of our nationwide civic activism festival
          United We Stand 2025!
        </p>
        <BigButton
          className="mt-8 flex-shrink-0"
          primary
          href="https://freeandequal.org/donate/"
          target="_blank"
        >
          Support United We Stand
        </BigButton>
        <div className="mt-4 text-center text-sm">
          <ExternalLink onClick={close}>
            Or jump to the results page, if you promise you&#39;ll support us
            later
          </ExternalLink>
        </div>
      </div>
    </Modal>
  );
}
