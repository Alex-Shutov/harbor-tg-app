import './rating.scss'
interface IProps{
  rating:number|undefined
}
const Index = ({rating}:IProps) => {
  return (
    <div className="rating">
      <span>{rating}</span>
    </div>
  );
};

export default Index;