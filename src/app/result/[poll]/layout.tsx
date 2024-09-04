import Header from './Header';

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-[-1rem] h-full">
      <div className="px-4" style={{ background: 'rgb(243, 244, 248)' }}>
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
