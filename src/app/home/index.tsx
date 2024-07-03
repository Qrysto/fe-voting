import Link from 'next/link';
import Image from 'next/image';
import { oswald } from '../../fonts';
import backgroundImg from './bg@2x.jpg';
import headingImg from './heading@2x.png';
import iconImg from './icon@2x.png';
import bannerImg from './banner@2x.png';
import shareIcon from './shareIcon.svg';
import { endTime } from '@/constants';

export default function HomePage() {
  const pollEnded = Date.now() > endTime;

  return (
    <main
      style={{ backgroundImage: `url('${backgroundImg.src}')` }}
      className="absolute left-0 right-0 top-0 mx-[-1rem] flex min-h-full flex-col items-stretch bg-cover pb-4 pt-8"
    >
      <div className="flex grow items-center">
        <div className="relative h-[480px] w-full">
          <Image
            src={headingImg}
            width={312}
            height={231}
            className="absolute right-1/2 top-0 translate-x-1/2 "
            alt="Free & Equal"
          />
          <Image
            src={iconImg}
            width={299}
            height={298}
            className="absolute right-1/2 top-[118px] translate-x-1/2"
            alt=""
          />
          <Image
            src={bannerImg}
            width={251}
            height={168}
            className="absolute bottom-0 right-1/2 translate-x-1/2"
            alt="2024 Presidental Debate voting form"
          />
        </div>
      </div>
      <div className="flex flex-col items-center pt-6">
        <div
          className={`${oswald.className} mb-4 text-xl font-bold uppercase text-white`}
        >
          Who won the debate?
        </div>
        <Link
          href={pollEnded ? 'result/poll3' : '/vote'}
          className={`block h-12 w-44 rounded-md text-center leading-[48px] ${oswald.className} bg-lightBlue font-bold uppercase text-blue active:bg-lightBlue/90`}
        >
          {pollEnded ? 'See Result' : 'Vote Now'}
        </Link>

        <Link
          href="/result/poll1"
          className={`${oswald.className} mt-12 text-sm font-medium uppercase text-lightBlue/90 underline underline-offset-2 active:text-lightBlue/80`}
        >
          See Candidate Selection poll&#39;s result
        </Link>
        <Link
          href="/result/poll2"
          className={`${oswald.className} mt-4 text-sm font-medium uppercase text-lightBlue/90 underline underline-offset-2 active:text-lightBlue/80`}
        >
          See Debate Winner poll&#39;s result
        </Link>

        <a
          href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fvote.freeandequal.org"
          target="_blank"
          className={`${oswald.className} mt-12 font-bold uppercase text-white`}
        >
          <span>Share to</span>
          <Image
            src={shareIcon}
            height={23}
            alt="Share"
            className="mx-2 inline-block"
            style={{ verticalAlign: -3 }}
          />
          <span>a friend</span>
        </a>
        <div className="mt-5 text-sm">
          <span className="text-white/70">Powered by </span>
          <a href="https://nexus.io/" target="_blank" className="text-white">
            Nexus.io
          </a>
        </div>
      </div>
    </main>
  );
}
