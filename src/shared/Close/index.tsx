
interface IProps{
  onClose:()=>void
}

const Index = ({onClose}:IProps) => {
    return (
        <div onClick={onClose}>
            <img src={'/close.svg'}/>
        </div>
    );
};

export default Index;