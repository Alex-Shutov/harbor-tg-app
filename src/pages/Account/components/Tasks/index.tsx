import { SectionPlaceholder } from '../SectionPlaceholder';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';

const Tasks = () => {
  useAutoBackNavigation()

  return (
    <SectionPlaceholder
      title="Задания"
      description="Здесь можно будет выполнять задания и получать дополнительные бонусы. Раздел уже в работе."
    />
  );
};

export default Tasks;


