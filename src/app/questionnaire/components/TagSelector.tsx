"use client";

interface TagSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function TagSelector({
  options,
  selected,
  onChange,
}: TagSelectorProps) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`rounded-full border px-4 py-2 text-sm transition-all ${
              isSelected
                ? "border-terra bg-terra/10 text-terra"
                : "border-warm-200 bg-white text-warm-500 hover:border-warm-300 hover:text-warm-700"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
