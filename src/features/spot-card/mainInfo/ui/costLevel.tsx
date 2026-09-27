import './level.scss'

interface IProps{
  level:number;
}
const costLevelOptions: Array<{ value:  number; label: string }> = [
  { value: 1, label: '₽', },
  { value: 2, label: '₽₽' },
  { value: 3, label: '₽₽₽' },
  { value: 4, label: '₽₽₽₽' },
  { value: 5, label: '₽₽₽₽₽' },
];
export const CostLevelComponent = ({level}:IProps) => {
  const costLevel = costLevelOptions.find((el=>el.value === level))
  return costLevel && <div className={'establishment-page__costLevel'}>
    <div className={`establishment-page__costLevel_level active`}>{costLevel.label}</div>
  </div>;
};

