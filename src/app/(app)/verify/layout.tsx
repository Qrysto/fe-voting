'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateSearchParams } from '@/lib/client';

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const tab = searchParams.get('tab');

  return (
    <Tabs
      value={tab === 'local' ? 'local' : 'online'}
      onValueChange={(val) => {
        updateSearchParams('tab', val);
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="online">Verify online</TabsTrigger>
        <TabsTrigger value="local">Verify locally</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
