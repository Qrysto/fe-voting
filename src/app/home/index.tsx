import Link from 'next/link';
import Image from 'next/image';
import { oswald } from '../../fonts';
import backgroundImg from './bg@2x.jpg';
import headingImg from './heading@2x.png';
import iconImg from './icon@2x.png';
import bannerImg from './banner@2x.png';
import shareIcon from './shareIcon.svg';

export default function HomePage() {
  return (
    <main
      style={{ backgroundImage: `url('${backgroundImg.src}')` }}
      className="absolute bottom-0 left-0 right-0 top-0 mx-[-1rem] flex flex-col items-stretch bg-cover py-8"
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
      <div className="flex flex-col items-center">
        <Link
          href="/vote"
          className={`block h-12 w-44 rounded-md text-center leading-[48px] ${oswald.className} bg-lightBlue font-bold uppercase text-blue active:bg-lightBlue/90`}
        >
          Vote now
        </Link>
        <button
          className={`${oswald.className} mt-10 font-bold uppercase text-white`}
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
        </button>
      </div>
    </main>
  );
}
