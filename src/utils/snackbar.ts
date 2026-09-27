import { enqueueSnackbar } from 'notistack';

export const handleSubmitSnackBar = (text:string) =>{
  return enqueueSnackbar(text,{ variant: 'success', autoHideDuration:1000,anchorOrigin:{horizontal:'right', vertical:'top'}, style:{background:'#045BFF',zIndex:9999} });
}
export const handleInfoSnackBar = (text:string) => {
  return   enqueueSnackbar(text, { variant: 'info',autoHideDuration:1000,anchorOrigin:{horizontal:'right', vertical:'top'} });
}