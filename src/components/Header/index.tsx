import Image from 'next/image';
import logo from './full-logo@2x.png';
import backIcon from './arrow-left.svg';
import searchIcon from './search.svg';
import shareIcon from './shareIcon.svg';

function IconButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button className={'px-1 py-1 ' + (className || '')}>{children}</button>
  );
}

export default function Header({ back = true }: { back?: boolean }) {
  return (
    <header className="relative py-2">
      <Image
        src={logo}
        width={106}
        height={50}
        alt="Free & Equal"
        className="mx-auto"
        priority
      />
      {back && (
        <div className="absolute inset-y-0 left-0 flex items-center object-right-top">
          <IconButton>
            <Image src={backIcon} height={18} alt="Back" />
          </IconButton>
        </div>
      )}
      <div className="absolute inset-y-0 right-0 flex items-center object-right-top">
        <IconButton>
          <Image src={searchIcon} height={23} alt="Search" />
        </IconButton>
        <IconButton className="ml-4">
          <Image src={shareIcon} height={23} alt="Share" />
        </IconButton>
      </div>
    </header>
  );
}
