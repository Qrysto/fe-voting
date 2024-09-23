'use client';

import { ComponentPropsWithoutRef } from 'react';
import { toast } from '@/lib/useToast';
import { Copy } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function UList({ className, ...props }: ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul
      {...props}
      className={cn('my-2 list-inside list-disc space-y-2 pl-3', className)}
    />
  );
}

export function UListItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'li'>) {
  return (
    <li {...props} className={cn('list-inside', className)}>
      <span className="ml-[-10px]">{children}</span>
    </li>
  );
}

export function Emphasize({
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('font-semibold', className)} {...props} />;
}

export function InlineCode({
  className,
  ...props
}: ComponentPropsWithoutRef<'code'>) {
  return (
    <code
      className={cn(
        'inline-block rounded-sm bg-accent px-1 text-accent-foreground',
        className
      )}
      {...props}
    />
  );
}

export function BlockCode({
  className,
  content,
  ...props
}: ComponentPropsWithoutRef<'code'> & { content: string }) {
  return (
    <div className={cn('my-2 flex items-stretch', className)} {...props}>
      <ScrollArea className="flex-1 rounded-l-sm bg-accent text-accent-foreground">
        <code className="block whitespace-nowrap px-4 py-3">{content}</code>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <button
        className="flex flex-shrink-0 items-center rounded-r-sm border-l border-lightGray/50 bg-accent px-4 text-accent-foreground transition-colors hover:bg-accent/80"
        onClick={() => {
          if (!navigator?.clipboard) return;
          navigator.clipboard.writeText(content);
          toast({
            title: 'Copied!',
            description: 'The code has been copied to the clipboard.',
          });
        }}
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ExternalLink({
  className,
  href,
  target = '_blank',
  ...props
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      href={href}
      target={target}
      className={cn('text-blue underline underline-offset-1', className)}
      {...props}
    />
  );
}
