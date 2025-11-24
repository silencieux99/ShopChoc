import { cn } from '../utils/cn';

export default function Card({ 
  children, 
  className, 
  padding = true,
  hover = false,
  onClick,
  ...props 
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200',
        'shadow-sm',
        padding && 'p-4 sm:p-6',
        hover && 'hover:shadow-md transition-shadow duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5',
        'border-b border-gray-200 pb-4 mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn(
        'text-sm text-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center space-x-4',
        'border-t border-gray-200 pt-4 mt-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
