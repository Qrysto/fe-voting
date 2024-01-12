'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { oswald } from '@/fonts';
import { candidates } from '@/data';
import coverImg from './bitmapCopy@2x.jpg';

export default function CandidateDetails({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const addVote = useStore((state) => state.addVote);
  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) return null;

  return (
    <div
      className="mx-[-1rem] bg-[100%_auto] bg-top pt-[85vw]"
      style={{ backgroundImage: `url('${coverImg.src}')` }}
    >
      <div className="rounded-t-[27px] bg-white">
        <div className="px-9 py-6">
          <h1 className="text-4xl uppercase">{candidate.name}</h1>
          <label
            className={`uppercase ${
              candidate.party === 'DEMOCRATIC PARTY'
                ? 'text-blue'
                : candidate.party === 'REPUBLICAN PARTY'
                  ? 'text-red'
                  : 'text-orange'
            } ${oswald.className} font-bold`}
          >
            {candidate.party}
          </label>

          <h3 className="mt-6 text-[14px] uppercase text-gray">
            Election status
          </h3>
          <div className="mt-2 flex justify-between">
            <div className="flex">
              <div
                className={`${oswald.className} h-12 rounded-md bg-red/5 px-5 font-bold uppercase leading-[48px] text-red`}
              >
                2nd
              </div>
              <div
                className={`${oswald.className} ml-2 h-12 rounded-md bg-red/5 px-5 font-bold uppercase leading-[48px] text-red`}
              >
                48%
              </div>
            </div>
            <Link
              href={'https://nexus.io/'}
              className={`${oswald.className} h-12 rounded-md bg-lightBlue px-5 font-bold uppercase leading-[48px] text-blue active:bg-lightBlue/60`}
            >
              Website
            </Link>
          </div>

          <h3 className="mt-7 text-[14px] uppercase text-gray">Biography</h3>
          <div className="mt-[10px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ipsum
            risus, placerat quis lacus vitae, tincidunt faucibus elit.
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Aenean ultrices, metus vulputate cursus
            consectetur…
          </div>
        </div>

        <div className="bg-lightGray px-9 pb-36 pt-8">
          <h2 className="text-4xl uppercase">Stance on issues</h2>
          <p className="mt-[10px]">
            Lorem ipsum dolor sit amet, consectetur adipisciaucibus elit.
            Pellentesqabitant morbi tristique senectus et netus et malees .
          </p>
          <p className="mt-[10px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ipsum
            risus, placerat quis lacus vitae, tincidunt faucibus elit.
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas.
          </p>
        </div>

        <button
          onClick={() => {
            addVote(candidate.id);
            router.push('/vote');
          }}
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgb(54, 107, 178) , rgb(12, 71, 151))',
          }}
          className={`fixed bottom-9 left-9 right-9 block h-[50px] rounded-md ${oswald.className} text-center font-bold uppercase text-white`}
        >
          Vote for Candidate Now
        </button>
      </div>
    </div>
  );
}
