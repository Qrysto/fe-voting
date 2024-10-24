'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import ResultLinks from '@/components/ResultLinks';
import { oswald } from '@/fonts';

export default function ResultLinksDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button
          variant="link"
          className={`${oswald.className} mt-4 text-sm uppercase text-lightBlue/90 underline underline-offset-2 active:text-lightBlue/80`}
        >
          See all poll results
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[60%] after:hidden">
        <div className="container flex min-h-0 flex-1 flex-col md:max-w-3xl">
          <DrawerHeader className="flex-shrink-0">
            <DrawerTitle className="text-3xl uppercase text-darkBlue">
              Poll results
            </DrawerTitle>
          </DrawerHeader>
          <div className="mx-[-1.5rem] flex-1 overflow-auto pb-6">
            <ResultLinks />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
