import { useDebouncedState } from "@/hooks";
import { cn } from "@/libs";
import { Icon } from "@iconify/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  debounceTime?: number;
  inputClassName?: string;
  buttonClassname?: string;
}
type InputProps = React.ComponentProps<"input">;
type SearchInputProps = Readonly<Omit<InputProps, "onChange"> & Props>;

export function Search({
  placeholder = "Search...",
  value,
  onChange,
  debounceTime = 400,
  inputClassName,
  className,
  buttonClassname,
  ...rest
}: SearchInputProps) {
  const { value: innerValue, onChangeHandler } = useDebouncedState<string>({
    initialValue: value,
    onChange,
    debounceTime,
  });

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={cn(
        "px-4 py-2 flex items-center gap-2 group border border-[#ECEDEE] focus-within:border max-w-[729px] w-full",
        className
      )}
    >
      <input
        type="text"
        value={innerValue}
        onChange={onChangeHandler}
        placeholder={placeholder}
        className={cn(
          "placeholder:text-black placeholder:text-sm outline-none leading-4 w-full text-gray-600 bg-white/0",
          inputClassName
        )}
        {...rest}
      />
      <button
        onClick={handleSearch}
        className={cn("p-4 rounded-lg bg-yellow-primary", buttonClassname)}
      >
        <Icon
          icon="material-symbols:search-rounded"
          className="w-4 h-4 text-white"
        />
      </button>
    </div>
  );
}
