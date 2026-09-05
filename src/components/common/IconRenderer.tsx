import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size = 20, ...props }) => {
  const Component = (Icons as Record<string, any>)[name] || Icons.Wrench;
  return <Component className={className} size={size} {...props} />;
};
