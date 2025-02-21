import { DivideIcon } from 'lucide-react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: typeof DivideIcon;
  className?: string;
  disabled: boolean | undefined;
}

export function Button({
  onClick,
  children,
  variant = 'primary',
  icon: Icon,
  className = '',
  disabled
}: ButtonProps) {
  const baseStyles = `w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm ${disabled?"cursor-not-allowed bg-gray-400 text-gray-600": ""}`;
  const variantStyles = {
    primary: `bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-600 hover:to-blue-700 border border-blue-500/20 text-white `,
    secondary: `bg-gradient-to-r from-purple-600/90 to-purple-700/90 hover:from-purple-600 hover:to-purple-700 border border-purple-500/20 text-white`,
    danger: `bg-gradient-to-r from-red-600/90 to-red-700/90 hover:from-red-600 hover:to-red-700 border border-red-500/20 text-white`,
    success: `bg-gradient-to-r from-green-600/90 to-green-700/90 hover:from-green-600 hover:to-green-700 border border-green-500/20 text-white`
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className} `}
    >
      {Icon && <Icon size={20} className="animate-pulse-slow" />}
      <span className="font-medium">{children}</span>
    </button>
  );
}
