interface GradeFilterProps {
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
  required?: boolean;
  label?: string;
}

const FILTER_OPTIONS = [
  { value: '유치부,1학년', label: '유치부 & 1학년' },
  { value: '2학년', label: '2학년' },
  { value: '첫영성체', label: '첫영성체' },
  { value: '4학년', label: '4학년' },
  { value: '5학년', label: '5학년' },
  { value: '6학년', label: '6학년' },
];

export default function GradeFilter({ 
  selectedGrade, 
  onGradeChange, 
  required = false,
  label = '학년 선택 (메인 필터)'
}: GradeFilterProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={selectedGrade}
        onChange={(e) => onGradeChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
        required={required}
      >
        {!required && <option value="">전체</option>}
        {required && <option value="">학년을 선택하세요</option>}
        {FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}


