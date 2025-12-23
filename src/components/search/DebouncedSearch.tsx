import { useDebouncedState } from "@/hooks";

import { Search } from "./Search";

interface Props {
  value: string;
  onChange: (value: string) => void;
  debounceTime?: number;
}
type InputProps = React.ComponentProps<typeof Search>;
type SearchInputProps = Readonly<Omit<InputProps, "onChange"> & Props>;

export function DebouncedSearch({
  value,
  onChange,
  debounceTime,
  ...props
}: SearchInputProps) {
  const { value: innerValue, onChangeHandler } = useDebouncedState<string>({
    initialValue: value,
    onChange,
    debounceTime,
  });
  return <Search value={innerValue} onChange={onChangeHandler} {...props} />;
}
