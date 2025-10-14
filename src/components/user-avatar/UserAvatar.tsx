interface UserAvatarProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({
  firstName,
  lastName,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`;

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600`}
      >
        {initials}
      </div>
      <span className="text-sm text-gray-900">{fullName}</span>
    </div>
  );
}
