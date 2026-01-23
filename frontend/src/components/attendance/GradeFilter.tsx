import { Grade } from '../../types/Student';

interface GradeFilterProps {
  selectedGrade: Grade | '';
  onGradeChange: (grade: Grade | '') => void;
  required?: boolean;
  label?: string;
}

const GRADES: Grade[] = ['유치부', '1학년', '2학년', '첫영성체', '4학년', '5학년', '6학년'];

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
        onChange={(e) => onGradeChange(e.target.value as Grade | '')}
        className="w-full p-2 border border-gray-300 rounded-lg"
        required={required}
      >
        {!required && <option value="">전체</option>}
        {required && <option value="">학년을 선택하세요</option>}
        {GRADES.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </div>
  );
}


