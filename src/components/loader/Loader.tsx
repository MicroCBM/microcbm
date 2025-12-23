import { cn, Icon } from '@/libs';

type Props = Readonly<{
  className?: string;
  iconClassName?: string;
  size?: 'small' | 'medium' | 'big';
  position?: 'left' | 'center';
}>;
export function Loader({
  className,
  iconClassName,
  size = 'medium',
  position = 'left',
}: Props) {
  const sizeValues = {
    small: 'text-xl',
    medium: 'text-[50px]',
    big: 'text-[100px]',
  };

  const positionValues = {
    left: 'flex justify-start items-start',
    center: 'center',
  };

  return (
    <div
      data-testid="loader"
      className={cn('h-full w-full', positionValues[position], className)}
    >
      <Icon
        icon="hugeicons:loading-03"
        className={cn('animate-spin', sizeValues[size], iconClassName)}
      />
    </div>
  );
}
